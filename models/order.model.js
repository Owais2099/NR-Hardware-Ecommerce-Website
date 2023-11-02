const User = require("../models/user.model");

const db = require("../data/database");

class Order {
  constructor(productItems, userId, totalQuantity, totalPrice, status_id = 1, orderId, date) {
    this.productItems = productItems;
    this.userId = userId;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
    this.status_id = status_id;

    if(orderId) {
      this.id = orderId;
    }

    if (date) {
      this.orderedOn = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  static async getOrderStatusList() {
    const [status] = await db.query("SELECT id, title FROM order_status");
    return status;
  }

  static async getStatusTitle(statusId) {
    const query = `SELECT title FROM order_status WHERE id = ?`;
    const [statusTitle] = await db.query(query, [statusId]);
  
    return statusTitle[0].title;
  }

  static async transformOrderObject(orderObj) {
    const query = `SELECT order_items.product_id, order_items.quantity, order_items.unit_price AS price, 
    products.title FROM order_items
    INNER JOIN products ON order_items.product_id = products.id
    WHERE order_id = ?`;
    const [orderItems]  = await db.query(query, [orderObj.id]);

    const productItems = [];
    for (const item of orderItems) {
      const product = {
        product: {
          id: item.product_id,
          title: item.title,
          price: item.price
        },
        quantity: item.quantity,
        totalPrice: item.quantity * item.price
      }
      productItems.push(product);
    }
    
    return new Order(
      productItems,
      orderObj.user_id,
      orderObj.total_quantity,
      orderObj.total_price,
      orderObj.status_id,
      orderObj.id,
      orderObj.ordered_on
    );
  }

  static transformOrderObjects(orderObjs) {
    return orderObjs.map(this.transformOrderObject);
  }

  static async findAllOrdersForAdmin() {
    const query = `SELECT * FROM orders ORDER BY id DESC`;
    const [orders] = await db.query(query);

    let ordersList = this.transformOrderObjects(orders);
    ordersList = await Promise.all(ordersList);

    for(const order of ordersList) {
      const userDataQuery = `SELECT users.email, user_details.fullname AS name, user_details.phone_number AS phone, user_details.address, user_details.city, user_details.postal_code AS postalCode 
      FROM users
      INNER JOIN user_details ON users.id = user_details.user_id
      WHERE users.id = ?`;
      const [userData] = await db.query(userDataQuery, [order.userId]);
      order.userData = userData[0];

      const statusTitle = await this.getStatusTitle(order.status_id);
      order.status = statusTitle;
    }

    return ordersList;
  }

  static async findAllOrdersForUser(userId) {
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`;
    const [orders] = await db.query(query, [userId]);

    let ordersList = this.transformOrderObjects(orders);
    ordersList = await Promise.all(ordersList);

    for(const order of ordersList) {
      const statusTitle = await this.getStatusTitle(order.status_id);
      order.status = statusTitle;
    }

    return ordersList;
  }

  static async findOrderById(orderId) {
    const query = `SELECT * FROM orders WHERE id = ?`;
    const [order] = await db.query(query, [orderId]);

    return this.transformOrderObject(order[0]);
  }

  async saveOrder() {
    if (this.id) {
      const query = `UPDATE orders SET status_id=? WHERE id=?`;
      return db.query(query, [this.status_id, this.id]);

    } else {
      const order = [
        this.userId,
        this.totalQuantity,
        this.totalPrice,
        this.status_id
      ];
      const orderQuery = `INSERT INTO orders (user_id, total_quantity, total_price, status_id) VALUES (?)`;
      const [result] = await db.query(orderQuery, [order]);

      const orderId = result.insertId;

      for (const item of this.productItems) {
        const productId = item.product.id;
        const unitPrice = item.product.price;
        const { quantity } = item;

        const orderItem = [
          orderId,
          productId,
          quantity,
          unitPrice,
        ];
        const orderItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?)`;
        await db.query(orderItemQuery, [orderItem]);
      }
      return;
    }
  }
}

module.exports = Order;