
const ApiError = require("../model/ApiError");
const Order = require("../model/Order");
const mongoose = require("mongoose");

class OrderDao {
// When an order is created, it is in "active" state
  async create({ customer, products }) {
    // Hint: Total price is computer from the list of products.
    // check valid customer
    if(customer === undefined) {
      throw new ApiError(400, "Return 400 for missing customer");
    }
    if (products === undefined) {
      throw new ApiError(400, "Return 404 for non-existing product attribute");
    }
    if(!customer || !mongoose.isValidObjectId(customer)) {
      throw new ApiError(404, "Return 404 for non-existing customer");
    }
    let total = 0;
    products.forEach((product) => {
      if (product.product === undefined) {
        throw new ApiError(404, "Return 404 for non-existing product attribute");
      }
      if ( !mongoose.isValidObjectId(product.product)) {
        throw new ApiError(400, "Return 404 for non-existing product attribute");
      }
      if ( product.quantity === undefined || !Number.isInteger(product.quantity)) {
        throw new ApiError(400, "Return 400 for invalid quantity attribute");
      }
      total += product.product.price * product.quantity;
    });
    const order = await Order.create({total, customer, products});

    return {
      _id: order._id.toString(),
      status: order.status,
      total: order.total,
      customer: order.customer,
      products: order.products,
    };
  }

  async getOrder(id, adminAccess, customer, role) {
    const order = await Order.findById(id).lean().select("-__v");
    if (order === null) {
      throw new ApiError(404, "Return 404 for invalid order ID");
    }
    if (adminAccess && role !== "ADMIN" && order.customer.toString() !== customer){
      throw new ApiError(403, "Return 403 for unauthorized token");
    } else if (!adminAccess && order.customer.toString() !== customer) {
      throw new ApiError(403, "Return 403 for unauthorized token");
    }
    return order;
  }

  async read(id, customer, role) {
    // Hint:
    //  If role==="ADMIN" then return the order for the given ID
    //  Otherwise, only return it if the customer is the one who placed the order!
    if (role !== "ADMIN" && role !== "CUSTOMER") {
      throw new ApiError(400, "Every user must have a valid role!");
    }

    const order = await Order.findById(id).lean().select("-__v");

    if (order === null) {
      throw new ApiError(404, "Return 404 for invalid order ID");
    }
    if (role !== "ADMIN" && order.customer.toString() !== customer) {
      throw new ApiError(403, "Return 403 for unauthorized token");
    }
    return order;
  }
// Pre: The requester is an ADMIN or is the customer!
//  The route handler must verify this!
  async readAll({ customer, status }) {
    // Hint:
    //  The customer and status parameters are filters.
    //  For example, one may search for all "ACTIVE" orders for the given customer.

    let orders = await Order.find({}).lean().select("-__v");

    if (customer) {
      orders = orders.filter((order) =>
          order.customer.toString() === customer
      );
    }
    if (status) {
      orders = orders.filter((order) =>
          order.status === status
      );
    }
    return orders;
  }

  async delete(id, customer) {
    // Hint: The customer must be the one who placed the order!
    await this.getOrder(id, false, customer);
    return Order.findByIdAndDelete(id).lean().select("-__v");
  }

// One can update the list of products or the status of an order
  async update (id, customer, { products, status }) {
    // Hint: The customer must be the one who placed the order!
    const order = await Order.findById(id).lean().select("-__v");

    if (order === null) {
      throw new ApiError(404, "Return 404 for invalid order ID");
    }
    if (order.customer.toString() !== customer) {
      throw new ApiError(403, "Return 403 for unauthorized token");
    }

    const update = {products, status};
    let total = order.total;

    // check status
    if (update.status && update.status !== "COMPLETE" && update.status !== "ACTIVE") {
      throw new ApiError(400, "Return 400 for invalid status attribute");
    }

    //update total when quantity updated
    if (update.products !== undefined) {
      total = 0;
      update.products.forEach((product) => {
        if (!mongoose.isValidObjectId(product.product._id)) {
          throw new ApiError(404, "Return 404 for non-existing customer");
        }
        if (product != undefined) {
          if (!Number.isInteger(product.quantity)) {
            throw new ApiError(400, "Return 400 for invalid quantity attribute");
          }
          total += product.product.price * product.quantity;
        }
      });
    }

    return Order.findByIdAndUpdate(
        id,
        {products, status, total},
        {new: true, runValidators: true}
    ).lean().select("-__v");
  }
}
module.exports = OrderDao;
