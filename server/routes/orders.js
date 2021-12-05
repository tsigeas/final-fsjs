const express = require("express");
const OrderDao = require("../data/OrderDao");
const ApiError = require("../model/ApiError");
const { checkToken, checkAdmin } = require("../util/middleware");

const router = express.Router();
const orders = new OrderDao();

router.get("/api/orders", checkAdmin, async (req, res, next) => {
  try {
    // TODO Implement Me!
    const {customer, status} = req.body;
    if (customer && status) {
      throw new ApiError(403, "Return 403 for invalid token");
    }
    const data = await orders.readAll(customer, status);
    res.json({data});
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orders.read(id);
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
