const express = require("express");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./error/global-error-handler");
const ApiError = require("./error/ApiError");

const jobRouter = require("./routes/jobRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

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
