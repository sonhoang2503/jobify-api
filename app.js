const express = require("express");

const errorHandler = require("./error/global-error-handler");
const ApiError = require("./error/ApiError");

const jobRouter = require("./routes/jobRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/auth", authRouter);
app.all("*", (req, res, next) => {
  next(
    ApiError.notfound(
      `Cannot find this ${req.originalUrl} route in the server!`
    )
  );
});
app.use(errorHandler);

module.exports = app;
