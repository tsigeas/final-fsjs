const faker = require("faker");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../server");
const UserDao = require("../../server/data/UserDao");
const OrderDao = require("../../server/data/OrderDao")
const ProductDao = require("../../server/data/ProductDao")
const { createToken } = require("../../server/util/token");
 
const users = new UserDao();
const orders = new OrderDao();
const products = new ProductDao();
const request = supertest(app);
 
const endpoint = "/api/orders";
 
describe(`Test ${endpoint} endpoints`, () => {
 const tokens = {};
 const userList = [];
 const productsList = [];
 const productList = [];
 
 
 // You may want to declare variables here
 
 beforeAll(async () => {
   await mongoose.connect(global.__MONGO_URI__);
   tokens.admin = await createToken({ role: "ADMIN" });
   tokens.invalid = tokens.admin
     .split("")
     .sort(function () {
       return 0.5 - Math.random();
     })
     .join("");
   tokens.customer = await createToken({ role: "CUSTOMER" });
   tokens.expiredAdmin = await createToken({ role: "ADMIN" }, -1);
   tokens.expiredCustumer = await createToken({ role: "CUSTOMER" }, -1);
 
 
   userList[0] = await users.create({
     username: faker.internet.userName(),
     password: faker.internet.password(),
     role: "CUSTOMER",
   });
 
   userList[1] = await users.create({
     username: faker.internet.userName(),
     password: faker.internet.password(),
     role: "CUSTOMER",
   });
 
   userList[2] = await users.create({
     username: faker.internet.userName(),
     password: faker.internet.password(),
     role: "ADMIN",
   });
 
 
   productList[0] = await products.create({
     name: "Eloquent JavaScript",
     price: 20.99,
   });
 
   productList[1] = await products.create({
     name: "JavaScript: The Good Parts",
     price: 13.69,
   });
 
   productsList[0] = {
     quantity: 2,
     product: productList[1],
   }
 
   productsList[1] = {
     quantity: 3,
     product: productList[0],
   }
   // You may want to do more in here, e.g. initialize
   // the variables used by all the tests!
 });
 
 describe(`Test GET ${endpoint}`, () => {
   const samples = [];
 
   beforeAll(async () => {
     samples[0] = await orders.create({
         customer: userList[0],
         products: productsList,
       });
 
     samples[1] = await orders.create({
       customer: userList[1],
       products: productsList,
     });
 
     samples[2] = await orders.create({
       customer: userList[2],
       products: productsList,
     });
   });
 
   test("Return 403 for missing token", async () => {
     const response = await request.get(endpoint);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for invalid token", async () => {
     // TODO Implement me!
     const response = await request
       .get(endpoint)
       .set("Authorization", `Bearer ${tokens.invalid}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for unauthorized token", async () => {
     // An admin can see any order, however a customer should not be allowed to
     //  see other customers' orders
     // TODO Implement me!
     const response = await request
       .get(endpoint)
       .set("Authorization", `Bearer ${tokens.customer}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for expired token", async () => {
     // TODO Implement me!
     const response = await request
       .get(endpoint)
       .set("Authorization", `Bearer ${tokens.expiredAdmin}`);
     expect(response.status).toBe(403);
   });
 
   describe("Return 200 and list of orders for successful request", () => {
     test("Admin can see any order", async () => {
       const response = await request
         .get(endpoint)
         .set("Authorization", `Bearer ${tokens.admin}`);
       expect(response.status).toBe(200);
       expect(response.body.data.length).toBe(samples.length);
     });
 
     // test("Customer can see their orders", async () => {
     //   // TODO Implement me!;
     // });
   });
 
   describe(`Test GET ${endpoint} with query parameter`, () => {
     describe("Admin can see any order", () => {
       test("Return 200 and the order for a given customer", async () => {
         // TODO Implement me!
         const custumer = samples[1].custumer;
         const response = await request
           .get(`${endpoint}?custumer=${custumer}`)
           .set("Authorization", `Bearer ${tokens.admin}`);
         const expected = samples.filter((s) => s.custumer === custumer);
         expect(response.status).toBe(200);
         expect(response.body.data).toStrictEqual(expected);
       });
 
       test("Return 200 and the orders with status of ACTIVE", async () => {
         const status = "ACTIVE";
         const response = await request
           .get(`${endpoint}?status=${status}`)
           .set("Authorization", `Bearer ${tokens.admin}`);
         const expected = samples.filter((s) => s.status === status).length;
         expect(response.status).toBe(200);
         expect(response.body.data.length).toBe(expected);
       });
 
       test("Return 200 and the orders with status of COMPLETE", async () => {
         // TODO Implement me!
         const status = "COMPLETE";
         const response = await request
           .get(`${endpoint}?status=${status}`)
           .set("Authorization", `Bearer ${tokens.admin}`);
         const expected = samples.filter((s) => s.status === status).length;
         expect(response.status).toBe(200);
         expect(response.body.data.length).toBe(expected);
       });
     });
 
     describe("Customer can see their order(s)", () => {
       test("Return 200 and the order for a given customer", async () => {
         // TODO Implement me!
         const custumer = samples[1].custumer;
         const custumerToken = await createToken(custumer);
         const response = await request
           .get(`${endpoint}?custumer=${custumer}`)
           .set("Authorization", `Bearer ${custumerToken}`);
         const expected = samples.filter((s) => s.custumer === custumer);
         expect(response.status).toBe(200);
         expect(response.body.data).toStrictEqual(expected);
       });
 
       test("Return 200 and this customer's orders with status of ACTIVE", async () => {
         // TODO Implement me!
         const status = "ACTIVE";
         const custumer = samples[1].custumer;
         const custumerToken = await createToken(custumer);
         const response = await request
           .get(`${endpoint}?custumer=${custumer}?status=${status}`)
           .set("Authorization", `Bearer ${custumerToken}`);
         const expected = samples.filter((s) => (s.custumer === custumer) && (s.status === status));
         expect(response.status).toBe(200);
         expect(response.body.data).toStrictEqual(expected);
       });
 
       test("Return 200 and this customer's orders with status of COMPLETE", async () => {
         // TODO Implement me!
         const status = "COMPLETE";
         const custumer = samples[1].custumer;
         const custumerToken = await createToken(custumer);
         const response = await request
           .get(`${endpoint}?custumer=${custumer}?status=${status}`)
           .set("Authorization", `Bearer ${custumerToken}`);
         const expected = samples.filter((s) => (s.custumer === custumer) && (s.status === status));
         expect(response.status).toBe(200);
         expect(response.body.data).toStrictEqual(expected);
       });
     });
 
     test("Return 200 and an empty list for orders with invalid customer query", async () => {
       // TODO Im
       const custumer = undefined;
       const response = await request
         .get(`${endpoint}?custumer=${custumer}`)
         .set("Authorization", `Bearer ${tokens.admin}`);
       //const expected = samples.filter((s) => s.status === status).length;
       const expected = [];
       expect(response.status).toBe(200);
       expect(response.body.data.length).toBe(expected);
     });
 
     test("Return 200 and an empty list for orders with invalid status query", async () => {
       // TODO Implement me!
       const status = "non-existing-status";
       const response = await request
         .get(`${endpoint}?status=${status}`)
         .set("Authorization", `Bearer ${tokens.admin}`);
       //const expected = samples.filter((s) => s.status === status).length;
       const expected = [];
       expect(response.status).toBe(200);
       expect(response.body.data.length).toBe(expected);
     });
   });
 
   afterAll(async () => {
     for (const sample of samples) {
       await orders.delete(sample._id);
     }
   });
 
 });
 
 describe(`Test GET ${endpoint}/:id`, () => {
   let order;
   let user;
   let userToken;
 
   beforeAll(async () => {
     user = await users.create({
       username: faker.internet.userName(),
       password: faker.internet.password(),
       role: "CUSTOMER",
     });
 
     order = await orders.create({
       customer: user,
       products: productsList,
     });
 
  
     userToken = await createToken(user);
   });
   test("Return 404 for invalid order ID", async () => {
     // TODO Implement me!
     const id = mongoose.Types.ObjectId().toString();
     const response = await request
       .get(`${endpoint}/${id}`)
       .set("Authorization", `Bearer ${tokens.admin}`);
     expect(response.status).toBe(404);
   });
 
   test("Return 403 for missing token", async () => {
     // TODO Implement me!
     const id = order._id;
     const response = await request.get(`${endpoint}/${id}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for invalid token", async () => {
     // TODO Implement me!
     const id = order._id;
     const response = await request
       .get(`${endpoint}/${id}`)
       .set("Authorization", `Bearer ${tokens.invalid}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for unauthorized token", async () => {
     // An admin can see any order, however a customer should not be allowed to
     //  see other customers' orders
     // TODO Implement me!
     const id = order._id;
     const response = await request
       .get(`${endpoint}/${id}`)
       .set("Authorization", `Bearer ${tokens.customer}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for expired token", async () => {
     // TODO Implement me!
     const id = order._id;
     const response = await request
       .get(`${endpoint}/${id}`)
       .set("Authorization", `Bearer ${tokens.expiredAdmin}`);
     expect(response.status).toBe(403);
   });
 
   describe("Return 200 and the order for successful request", () => {
     test("Admin can see any order", async () => {
       // TODO Implement me!
       const id = order._id;
       const response = await request
         .get(`${endpoint}/${id}`)
         .set("Authorization", `Bearer ${tokens.admin}`);
       expect(response.status).toBe(200);
       expect(response.body.data).toStrictEqual(order);
     });
 
     test("Customer can see their order only", async () => {
       // TODO Implement me!
       const id = order._id;
       const response = await request
         .get(`${endpoint}/${id}`)
         .set("Authorization", `Bearer ${userToken}`);
       expect(response.status).toBe(200);
       expect(response.body.data).toStrictEqual(order);
     });
   });
 
   afterAll(async () => {
     await users.delete(user._id);
     await orders.delete(order._id);
 
   });
 });
 
 describe(`Test POST ${endpoint}`, () => {
   let order;
   let user;
   let userToken;
 
   beforeAll(async () => {
     user = await users.create({
       username: faker.internet.userName(),
       password: faker.internet.password(),
       role: "CUSTOMER",
     });
 
     order = await orders.create({
       customer: user,
       products: productsList,
     });
 
  
     userToken = await createToken(user);
   });
 
   test("Return 403 for missing token", async () => {
     const response = await request.post(endpoint).send(order);
     expect(response.status).toBe(403);
     // TODO Implement me!
   });
 
   test("Return 403 for invalid token", async () => {
     // TODO Implement me!
     const response = await request
       .post(endpoint)
       .send(order)
       .set("Authorization", `Bearer ${tokens.invalid}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for expired token", async () => {
     // TODO Implement me!
     const response = await request
       .post(endpoint)
       .send(order)
       .set("Authorization", `Bearer ${tokens.expiredCustumer}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 400 for missing customer", async () => {
     // TODO Implement me!
     const response = await request
       .post(endpoint)
       .send({
         products: productsList,
       })
       .set("Authorization", `Bearer ${tokens.custumer}`);
     expect(response.status).toBe(400);
   });
 
   test("Return 404 for non-existing customer", async () => {
     // A token with a user ID that resembles a valid mongoose ID
     //  however, there is no user in the database with that ID!
     // TODO Implement me!
   });
 
   test("Return 400 for missing payload", async () => {
     // TODO Implement me!
     const response = await request
       .post(endpoint)
       .set("Authorization", `Bearer ${userToken}`);
     expect(response.status).toBe(400);
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
   let order;
   let user;
   let userToken;
 
   beforeAll(async () => {
     user = await users.create({
       username: faker.internet.userName(),
       password: faker.internet.password(),
       role: "CUSTOMER",
     });
 
     order = await orders.create({
       customer: user,
       products: productsList,
     });
 
  
     userToken = await createToken(user);
   });
 
   test("Return 404 for invalid order ID", async () => {
     // TODO Implement me!
     const response = await request
       .put(`${endpoint}/${mongoose.Types.ObjectId().toString()}`)
       .send({
         status: "COMPLETE",
       })
       .set("Authorization", `Bearer ${tokens.admin}`);
     expect(response.status).toBe(404);
   });
 
   test("Return 403 for missing token", async () => {
     // TODO Implement me!
     const response = await request.put(`${endpoint}/${order._id}`).send({
       status: "COMPLETE",
     });
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for invalid token", async () => {
     // TODO Implement me!
     const response = await request
       .put(`${endpoint}/${order._id}`)
       .send({
         status: "COMPLETE",
       })
       .set("Authorization", `Bearer ${tokens.invalid}`);
     expect(response.status).toBe(403);
   });
 
   describe("Return 403 for unauthorized token", () => {
     test("Admins not allowed to update others' orders", async () => {
       // TODO Implement me!
       const response = await request
       .put(`${endpoint}/${order._id}`)
       .send({
         status: "COMPLETE",
       })
       .set("Authorization", `Bearer ${tokens.admin}`);
       expect(response.status).toBe(403);
     });
 
     test("Customers not allowed to update others' orders", async () => {
       // TODO Implement me!
       const response = await request
       .put(`${endpoint}/${order._id}`)
       .send({
         status: "COMPLETE",
       })
       .set("Authorization", `Bearer ${tokens.custumer}`);
       expect(response.status).toBe(403);
     });
   });
 
   test("Return 403 for expired token", async () => {
     // TODO Implement me!
     const response = await request
       .put(`${endpoint}/${order._id}`)
       .send({
         status: "COMPLETE",
       })
       .set("Authorization", `Bearer ${tokens.expiredCustumer}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 400 for missing payload", async () => {
     // TODO Implement me!
     const response = await request
       .put(`${endpoint}/${order._id}`)
       .set("Authorization", `Bearer ${tokens.customer}`);
     expect(response.status).toBe(400);
   });
 
   test("Return 400 for invalid status attribute", async () => {
     // TODO Implement me!
     const response = await request
         .put(`${endpoint}/${order._id}`)
         .send({
           status: "non-existing-status",
         })
         .set("Authorization", `Bearer ${userToken}`);
       expect(response.status).toBe(200);
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
       const response = await request
         .put(`${endpoint}/${order._id}`)
         .send({
           status: "COMPLETE",
         })
         .set("Authorization", `Bearer ${userToken}`);
       expect(response.status).toBe(200);
       expect(response.body.data.status).toBe("COMPLETE");
     });
   });
 });
 
 describe(`Test DELETE ${endpoint}/:id`, () => {
   const samples = [];
 
   beforeAll(async () => {
     samples[0] = await orders.create({
       customer: userList[0],
       products: productsList,
     });
 
     samples[1] = await orders.create({
       customer: userList[1],
       products: productsList,
     });
 
     samples[2] = await orders.create({
       customer: userList[2],
       products: productsList,
     });
   });
 
   test("Return 404 for invalid order ID", async () => {
     // TODO Implement me!
     const response = await request
       .delete(`${endpoint}/${mongoose.Types.ObjectId().toString()}`)
       .set("Authorization", `Bearer ${tokens.admin}`);
     expect(response.status).toBe(404);
   });
 
   test("Return 403 for missing token", async () => {
     // TODO Implement me!
     const response = await request.delete(`${endpoint}/${samples[0]._id}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 403 for invalid token", async () => {
     // TODO Implement me!
     const response = await request
       .delete(`${endpoint}/${samples[0].custumer._id}`)
       .set("Authorization", `Bearer ${tokens.invalid}`);
     expect(response.status).toBe(403);
   });
 
   describe("Return 403 for unauthorized token", () => {
     test("Admins not allowed to delete others' orders", async () => {
       // TODO Implement me!
       const response = await request
         .delete(`${endpoint}/${samples[1]._id}`)
         .set("Authorization", `Bearer ${tokens.admin}`);
       expect(response.status).toBe(403);
     });
 
     test("Customers not allowed to delete others' orders", async () => {
       // TODO Implement me!
       const response = await request
         .delete(`${endpoint}/${samples[0]._id}`)
         .set("Authorization", `Bearer ${tokens.customer}`);
       expect(response.status).toBe(403);
     });
   });
 
   test("Return 403 for expired token", async () => {
     // TODO Implement me!
     const response = await request
       .delete(`${endpoint}/${samples[0]._id}`)
       .set("Authorization", `Bearer ${tokens.expiredAdmin}`);
     expect(response.status).toBe(403);
   });
 
   test("Return 200 and the deleted order for successful request", async () => {
     // A customer may delete their order!
     // TODO Implement me!
     const token = await createToken(samples[0].custumer);
     const response = await request
       .delete(`${endpoint}/${samples[0]._id}`)
       .set("Authorization", `Bearer ${token}`);
     expect(response.status).toBe(200);
     expect(response.body.data).toStrictEqual(samples[0]);
   });
 });
 
 afterAll(async () => {
   await mongoose.connection.db.dropDatabase();
   await mongoose.connection.close();
 });
});
 
 

