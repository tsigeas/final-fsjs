const express = require("express");
const OrderDao = require("../data/OrderDao");
const ApiError = require("../model/ApiError");
const { checkToken, checkAdmin } = require("../util/middleware");

const router = express.Router();
const orders = new OrderDao();

router.get("/api/orders", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
    const {customer, status} = req.query;
    if (customer && status) {
      throw new ApiError(403, "Return 403 for invalid token");
    }
    if (customer === undefined || customer === "" || req.user.sub() !== customer && req.user.role !== "ADMIN") {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }

    // const data = user.role === "ADMIN"
    //   ? await orders.readAll({customer, status})
    //   : await orders.read(user.id, customer, user.role);

    const data = await orders.readAll({customer, status});
    res.json({data});
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const data = await orders.read(id, user.sub(), user.role);

    if (user.sub() !== data.customer.toString() && user.role !== "ADMIN") {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/api/orders", checkAdmin, async (req, res, next) => {
  try {
    const { customer, products } = req.body;
    const data = await orders.create({ customer, products });
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
});

router.delete("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orders.delete(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.put("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id, customer } = req.params;
    const { product, status } = req.body;

    if (!product && !status) {
      throw new ApiError(
        400,
        "You must provide at least a name or price attribute!"
      );
    }

    const data = await orders.update(id, customer, { product, status });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
