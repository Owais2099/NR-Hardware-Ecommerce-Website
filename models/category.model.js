const db = require("../data/database");

class Category {
  constructor(categoryData) {
    if (categoryData.id) {
      this.id = categoryData.id;
    }

    this.title = categoryData.title;
    this.description = categoryData.description;

    if (categoryData.created_at) {
      this.created_at = categoryData.created_at;
    }
    if (categoryData.modified_at) {
      this.modified_at = categoryData.modified_at;
    }
  }

  static async findCategoryById(categoryId) {
    const query = `SELECT * FROM product_category WHERE id = ?`;
    const [category] = await db.query(query, [categoryId]);

    if (!category[0]) {
      const error = new Error("Could not find category with provided id.");
      error.code = 404;
      throw error;
    }
    return new Category(category[0]);
  }

  static async findAllCategories() {
    const [categories] = await db.query("SELECT * FROM product_category");
    return categories.map(function (category) {
      return new Category(category);
    });
  }

  async saveCategory() {
    const categoryData = [this.title, this.description];

    if (this.id) {
      const query = `UPDATE product_category SET title=?, description=? WHERE id=?`;
      await db.query(query, [...categoryData, this.id]);
    } else {
      const query = `INSERT INTO product_category (title, description) VALUES (?)`;
      await db.query(query, [categoryData]);
    }
  }

  removeCategory() {
    const query = "DELETE FROM product_category WHERE id=?;";
    return db.query(query, [this.id]);
  }
}

module.exports = Category;
