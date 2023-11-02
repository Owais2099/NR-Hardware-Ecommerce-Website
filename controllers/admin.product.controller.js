const Product = require("../models/product.model");
const Order = require("../models/order.model");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAllProducts();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

async function getNewProduct(req, res, next) {
  try {
    const categories = await Product.getCategoriesList();
    const units = await Product.getUnitsList();
    res.render("admin/products/new-product", {
      categories: categories,
      units: units,
    });
  } catch (error) {
    next(error);
    return;
  } 
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.saveProduct();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  try {
    const categories = await Product.getCategoriesList();
    const units = await Product.getUnitsList();
    const product = await Product.findProductById(req.params.id);
    res.render("admin/products/update-product", {
      product: product,
      categories: categories,
      units: units,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  let product;
  try {
    product = await Product.findProductById(req.params.id);
  } catch (error) {
    next(error);
    return;
  }

  if (req.file) {
    await product.removeImage();
    product = new Product({
      ...req.body,
      id: req.params.id,
    });
    product.replaceImage(req.file.filename);
  } else {
    product = new Product({
      ...req.body,
      id: req.params.id,
    });
  }

  try {
    await product.saveProduct();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findProductById(req.params.id);

    await product.removeImage();
    await product.removeProduct();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted Product!" });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllOrdersForAdmin();
    const statuses = await Order.getOrderStatusList();
    
    res.render("admin/orders/admin-orders", {
      orders: orders,
      statuses: statuses
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findOrderById(orderId);

    order.status_id = newStatus;

    await order.saveOrder();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
