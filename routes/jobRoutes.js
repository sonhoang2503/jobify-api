const express = require("express");
const jobControllers = require("./../controllers/jobControllers");
const authControllers = require("./../controllers/authControllers");

const router = express.Router();

// Authenticated User after this middleware
router.use(authControllers.authenticated);

router.route("/stats").get(jobControllers.showStats);
router
  .route("/:id")
  .delete(jobControllers.deleteJob)
  .patch(jobControllers.updateJob);
router.route("/").post(jobControllers.createJob).get(jobControllers.getAllJobs);

module.exports = router;
