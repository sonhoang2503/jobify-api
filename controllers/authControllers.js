const User = require("../models/userModel");
const ApiError = require("../error/ApiError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    next(ApiError.badRequest("Please provide all the required values"));
  }

  // res.status(200).json({ msg: "success" });

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    next(ApiError.badRequest("Email already in use"));
  }
  const user = await User.create({ name, email, password });

  const token = user.createJWT();
  res.status(201).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(ApiError.badRequest("Please provide all the required values"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next(ApiError.badRequest("Invalid Credentials"));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    next(ApiError.badRequest("Invalid Credentials"));
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(200).json({ user, token, location: user.location });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    next(ApiError.badRequest("Please provide all the required values"));
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  res.status(200).json({ user, token, location: user.location });
});

exports.authenticated = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(ApiError.unauthorized("Authentication Invalid!! Please login again"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    next(ApiError.unauthorized("Authentication Invalid!! Please login again"));
  }
});
