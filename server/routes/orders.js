
const express = require("express");
const OrderDao = require("../data/OrderDao");
const ApiError = require("../model/ApiError");
const { checkToken } = require("../util/middleware");
const router = express.Router();
const orders = new OrderDao();

router.get("/api/orders", checkToken, async (req, res, next) => {
  try {
    // TODO Implement Me!
    const {customer, status} = req.query;
    console.log(customer);
    console.log(req.user.sub);

    if ((customer === undefined || customer === "" || req.user.sub !== customer) && req.user.role !== 'ADMIN') {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }

    const data = await orders.readAll({customer, status});
    res.json({ data });
  } catch (err) {
    next(err);
  }
});
router.get("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orders.read(id, req.user.sub, req.user.role);

    if (req.user.sub !== data.customer.toString() && req.user.role !== 'ADMIN') {
      throw new ApiError(403, "You are not authorized to perform this action.");
    }
    res.json({ data });
  } catch (err) {
    next(err);
  }
});
router.post("/api/orders", checkToken, async (req, res, next) => {
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
    const data = await orders.delete(id, req.user.sub);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});
router.put("/api/orders/:id", checkToken, async (req, res, next) => {
  try {
    const { id, customer } = req.params;
    const { products , status } = req.body;

    if (!products && !status) {
      throw new ApiError(
          400,
          "You must provide at least a name or price attribute!"
      );
    }

    console.log(products);
    const data = await orders.update(id, req.user.sub, { products, status });
    res.json({ data });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
