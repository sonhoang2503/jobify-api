const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./../models/jobModel");

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const jobs = JSON.parse(fs.readFileSync(`${__dirname}/jobs.json`, "utf-8"));
const jobsNewId = jobs.map((job) => {
  job.createdBy = "626924eecf13bb801ca04e59";
  return { ...job };
});

console.log(jobsNewId.length);

const importData = async () => {
  try {
    await Job.create(jobsNewId);
    console.log("Database created successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const removeData = async () => {
  try {
    await Job.deleteMany();
    // await User.deleteMany();
    console.log("Database deleted successfully");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

importData();
// removeData();
