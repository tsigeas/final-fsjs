// TODO: Implement the operations of OrderDao.
//  Do not change the signature of any of the operations!
//  You may add helper functions, other variables, etc, as the need arises!
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
      if (!mongoose.isValidObjectId(product.product)) {
        throw new ApiError(404, "Return 404 for non-existing customer");
      }
      total += product.product.price * product.quantity;
    });
    
    const order = await Order.create({total, customer, products});
    
    return {
      _id: order._id.toString(),
      total: order.total,
      product: order.product,
    };
  }
  // TODO delete this
s
  async read(id, customer, role) {
    // Hint:
    //  If role==="ADMIN" then return the order for the given ID
    //  Otherwise, only return it if the customer is the one who placed the order!
    const order = await Order.findById(id).lean().select("-__v");

    if (order === null) {
      throw new ApiError(404, "Return 404 for invalid order ID");
    }

    if (role !== "ADMIN" && role !== "CUSTOMER") {
      throw new ApiError(400, "Every user must have a valid role!");
    }

    if (role !== "ADMIN" && customer._id !== id) {
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

    orders.filter((order) =>
      order.customer === customer
    );

    orders.filter((order) =>
      order.status === status
    );

    return orders;
  }

  async delete(id, customer) {
    // Hint: The customer must be the one who placed the order!
    if (role !== "ADMIN" && customer._id !== id) {
      throw new ApiError(403, "Return 403 for unauthorized token");
    }
    await this.read(id);
    return Order.findByIdAndDelete(id).lean().select("-__v");
  }

  // One can update the list of products or the status of an order
  async update(id, customer, { products, status }) {
    // Hint: The customer must be the one who placed the order!
    if (role !== "ADMIN" && customer._id !== id) {
      throw new ApiError(403, "Return 403 for unauthorized token");
    }

    await this.read(id);

    return Order.findByIdAndUpdate(
      id,
      {products, status},
      {new: true, runValidators: true}
    ).lean().select("-__v");
  }
}

module.exports = OrderDao;
