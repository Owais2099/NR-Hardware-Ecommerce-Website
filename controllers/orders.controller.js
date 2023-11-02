const stripe = require("stripe")(
  "sk_test_51O68zNHswSpMTg6ORNluFrJCfgLyrDfzid1i91h8KT1iENzfFS28Ai23ocAPPg9MgcqmCQwtM3nvCKTu9WW71vAC00vsk6QLmo"
);

const Order = require("../models/order.model");

async function getOrders(req, res, next) {
  try {
    let orders = await Order.findAllOrdersForUser(res.locals.uid);

    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = res.locals.uid;

  const order = new Order(
    cart.items,
    userId,
    cart.totalQuantity,
    cart.totalPrice
  );

  try {
    await order.saveOrder();
    await clearCart(req);
  } catch (error) {
    return next(error);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

async function clearCart(req) {
  return new Promise(function (resolve, reject) {
    req.session.cart = null;
    // Save the session to ensure the cart is cleared
    req.session.save((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
