// TODO: Implement the operations of OrderDao.
//  Do not change the signature of any of the operations!
//  You may add helper functions, other variables, etc, as the need arises!

class OrderDao {
  // When an order is created, it is in "active" state
  async create({ customer, products }) {
    // Hint: Total price is computer from the list of products.

    // TODO Impelment me
    return null;
  }

  async read(id, customer, role) {
    // Hint:
    //  If role==="ADMIN" then return the order for the given ID
    //  Otherwise, only return it if the customer is the one who placed the order!

    // TODO Implement me!
    return null;
  }

  // Pre: The requester is an ADMIN or is the customer!
  //  The route handler must verify this!
  async readAll({ customer, status }) {
    // Hint:
    //  The customer and status parameters are filters.
    //  For example, one may search for all "ACTIVE" orders for the given customer.

    // TODO Implement me!
    return [];
  }

  async delete(id, customer) {
    // Hint: The customer must be the one who placed the order!

    // TODO Implement me!
    return null;
  }

  // One can update the list of products or the status of an order
  async update(id, customer, { products, status }) {
    // Hint: The customer must be the one who placed the order!

    // TODO Implement me!
    return null;
  }
}

module.exports = OrderDao;
