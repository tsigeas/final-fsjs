const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../server");

const request = supertest(app);

const endpoint = "/api/orders";

describe(`Test ${endpoint} endpoints`, () => {
  // You may want to declare variables here

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);

    // You may want to do more in here, e.g. initialize
    // the variables used by all the tests!
  });

  describe(`Test GET ${endpoint}`, () => {
    test("Return 403 for missing token", async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(403);
    });

    test("Return 403 for invalid token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for unauthorized token", async () => {
      // An admin can see any order, however a customer should not be allowed to
      //  see other customers' orders
      // TODO Implement me!
    });

    test("Return 403 for expired token", async () => {
      // TODO Implement me!
    });

    describe("Return 200 and list of orders for successful request", () => {
      test("Admin can see any order", async () => {
        // TODO Implement me!
      });

      test("Customer can see their orders", async () => {
        // TODO Implement me!;
      });
    });

    describe(`Test GET ${endpoint} with query parameter`, () => {
      describe("Admin can see any order", () => {
        test("Return 200 and the order for a given customer", async () => {
          // TODO Implement me!
        });

        test("Return 200 and the orders with status of ACTIVE", async () => {
          // TODO Implement me!
        });

        test("Return 200 and the orders with status of COMPLETE", async () => {
          // TODO Implement me!
        });
      });

      describe("Customer can see their order(s)", () => {
        test("Return 200 and the order for a given customer", async () => {
          // TODO Implement me!
        });

        test("Return 200 and this customer's orders with status of ACTIVE", async () => {
          // TODO Implement me!
        });

        test("Return 200 and this customer's orders with status of COMPLETE", async () => {
          // TODO Implement me!
        });
      });

      test("Return 200 and an empty list for orders with invalid customer query", async () => {
        // TODO Implement me!
      });

      test("Return 200 and an empty list for orders with invalid status query", async () => {
        // TODO Implement me!
      });
    });
  });

  describe(`Test GET ${endpoint}/:id`, () => {
    test("Return 404 for invalid order ID", async () => {
      // TODO Implement me!
    });

    test("Return 403 for missing token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for invalid token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for unauthorized token", async () => {
      // An admin can see any order, however a customer should not be allowed to
      //  see other customers' orders
      // TODO Implement me!
    });

    test("Return 403 for expired token", async () => {
      // TODO Implement me!
    });

    describe("Return 200 and the order for successful request", () => {
      test("Admin can see any order", async () => {
        // TODO Implement me!
      });

      test("Customer can see their order only", async () => {
        // TODO Implement me!
      });
    });
  });

  describe(`Test POST ${endpoint}`, () => {
    test("Return 403 for missing token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for invalid token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for expired token", async () => {
      // TODO Implement me!
    });

    test("Return 400 for missing customer", async () => {
      // TODO Implement me!
    });

    test("Return 404 for non-existing customer", async () => {
      // A token with a user ID that resembles a valid mongoose ID
      //  however, there is no user in the database with that ID!
      // TODO Implement me!
    });

    test("Return 400 for missing payload", async () => {
      // TODO Implement me!
    });

    test("Return 400 for invalid quantity attribute", async () => {
      // Quantity attribute for each product must be a positive value.
      // TODO Implement me!
    });

    test("Return 404 for non-existing product attribute", async () => {
      // A product ID that resembles a valid mongoose ID
      //  however, there is no product in the database with that ID!
      // TODO Implement me!
    });

    test("Return 400 for invalid product attribute", async () => {
      // A product ID that is not even a valid mongoose ID!
      // TODO Implement me!
    });

    test("Return 201 and the order for successful request", async () => {
      // The "customer" who places the order must be identified through
      //  the authorization token.
      // Moreover, when an order is placed, its status is ACTIVE.
      // The client only provides the list of products.
      // The API shall calculate the total price!
      // TODO Implement me!
    });
  });

  describe(`Test PUT ${endpoint}/:id`, () => {
    test("Return 404 for invalid order ID", async () => {
      // TODO Implement me!
    });

    test("Return 403 for missing token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for invalid token", async () => {
      // TODO Implement me!
    });

    describe("Return 403 for unauthorized token", () => {
      test("Admins not allowed to update others' orders", async () => {
        // TODO Implement me!
      });

      test("Customers not allowed to update others' orders", async () => {
        // TODO Implement me!
      });
    });

    test("Return 403 for expired token", async () => {
      // TODO Implement me!
    });

    test("Return 400 for missing payload", async () => {
      // TODO Implement me!
    });

    test("Return 400 for invalid status attribute", async () => {
      // TODO Implement me!
    });

    test("Return 400 for invalid quantity attribute", async () => {
      // TODO Implement me!
    });

    describe("Return 200 and the updated order for successful request", () => {
      test("Update products, e.g., add/remove or change quantity", async () => {
        // TODO Implement me!
      });

      test("Update status, e.g., from ACTIVE to COMPLETE", async () => {
        // TODO Implement me!
      });
    });
  });

  describe(`Test DELETE ${endpoint}/:id`, () => {
    test("Return 404 for invalid order ID", async () => {
      // TODO Implement me!
    });

    test("Return 403 for missing token", async () => {
      // TODO Implement me!
    });

    test("Return 403 for invalid token", async () => {
      // TODO Implement me!
    });

    describe("Return 403 for unauthorized token", () => {
      test("Admins not allowed to delete others' orders", async () => {
        // TODO Implement me!
      });

      test("Customers not allowed to delete others' orders", async () => {
        // TODO Implement me!
      });
    });

    test("Return 403 for expired token", async () => {
      // TODO Implement me!
    });

    test("Return 200 and the deleted order for successful request", async () => {
      // A customer may delete their order!
      // TODO Implement me!
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });
});
