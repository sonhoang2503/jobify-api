const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../error/ApiError");
const Job = require("../models/jobModel");
const mongoose = require("mongoose");
const moment = require("moment");

exports.createJob = catchAsync(async (req, res, next) => {
  const { position, company } = req.body;

  if (!position || !company) {
    next(ApiError.badRequest("Please provide all the required values"));
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ job });
});
exports.getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  // NO AWAIT

  let result = Job.find(queryObject);

  // sort

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  console.log(jobs, totalJobs, numOfPages);

  res.status(200).json({ jobs, totalJobs, numOfPages });
};
exports.updateJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    next(ApiError.badRequest("Please provide all the required values"));
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    next(ApiError.notfound(`No job with id :${jobId}`));
  }
  // check permissions for update

  if (checkPermissions(req.user, job.createdBy)) {
    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ updatedJob });
  } else {
    next(ApiError.unauthorized("Not authorized to access this route"));
  }
});
exports.deleteJob = catchAsync(async (req, res, next) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    next(ApiError.notfound(`No job with id :${jobId}`));
  }

  if (checkPermissions(req.user, job.createdBy)) {
    await job.delete();
    res.status(200).json({ msg: "Success! Job removed" });
  } else {
    next(ApiError.unauthorized("Not authorized to access this route"));
  }
});

exports.showStats = catchAsync(async (req, res, next) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({ defaultStats, monthlyApplications });
});
