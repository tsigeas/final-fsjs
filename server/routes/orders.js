const express = require("express");
const { checkToken } = require("../util/middleware");

const router = express.Router();

router.get("/api/orders", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
  } catch (err) {
    next(err);
  }
});

router.post("/api/orders", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
  } catch (err) {
    next(err);
  }
});

router.delete("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
  } catch (err) {
    next(err);
  }
});

router.put("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
  } catch (err) {
    next(err);
  }
});

module.exports = router;
