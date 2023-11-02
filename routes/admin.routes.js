const express = require("express");

const adminProductController = require("../controllers/admin.product.controller");
const adminCategoryController = require("../controllers/admin.category.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

//Category Routes
router.get("/categories", adminCategoryController.getCategories);

router.get("/categories/new", adminCategoryController.getNewCategory);

router.post("/categories", adminCategoryController.createNewCategory);

router.get("/categories/:id", adminCategoryController.getUpdateCategory);

router.post("/categories/:id", adminCategoryController.updateCategory);

router.delete("/categories/:id", adminCategoryController.deleteCategory);


//Product Routes
router.get("/products", adminProductController.getProducts);

router.get("/products/new", adminProductController.getNewProduct);

router.post("/products", imageUploadMiddleware, adminProductController.createNewProduct);

router.get("/products/:id", adminProductController.getUpdateProduct);

router.post("/products/:id", imageUploadMiddleware, adminProductController.updateProduct);

router.delete("/products/:id", adminProductController.deleteProduct);

router.get("/orders", adminProductController.getOrders);

router.patch("/orders/:id", adminProductController.updateOrder);

module.exports = router;
