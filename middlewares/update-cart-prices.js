async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;

  await cart.updatePrices();
  next();
}

module.exports = updateCartPrices;
