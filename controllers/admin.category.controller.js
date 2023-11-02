const Category = require("../models/category.model");

async function getCategories(req, res, next) {
  try {
    const categories = await Category.findAllCategories();
    res.render("admin/categories/all-categories", { categories: categories });
  } catch (error) {
    next(error);
    return;
  }
}

async function getNewCategory(req, res) {
  res.render("admin/categories/new-category");
}

async function createNewCategory(req, res, next) {
  const category = new Category({
    ...req.body,
  });

  try {
    await category.saveCategory();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/categories");
}

async function getUpdateCategory(req, res, next) {
  try {
    const category = await Category.findCategoryById(req.params.id);
    res.render("admin/categories/update-category", { category: category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  const category = new Category({
    ...req.body,
    id: req.params.id,
  });

  try {
    await category.saveCategory();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/categories");
}

async function deleteCategory(req, res, next) {
  let category;
  try {
    category = await Category.findCategoryById(req.params.id);
    await category.removeCategory();
  } catch (error) {
    next(error);
  }

  res.json({ message: "Deleted Category!" });
}

module.exports = {
  getCategories: getCategories,
  getNewCategory: getNewCategory,
  createNewCategory: createNewCategory,
  getUpdateCategory: getUpdateCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
}