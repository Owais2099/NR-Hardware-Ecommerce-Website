const fs = require("fs").promises;
const path = require("path");

const db = require("../data/database");

class Product {
  constructor(productData) {
    if (productData.id) {
      this.id = productData.id;
    }
    this.title = productData.title;
    this.category_id = +productData.category_id;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.unit_id = +productData.unit_id;
    this.stock = +productData.stock;
    this.description = productData.description;

    this.image = productData.image;
    this.updateImageData();

    if (productData.created_at) {
      this.created_at = productData.created_at;
    }
    if (productData.modified_at) {
      this.modified_at = productData.modified_at;
    }
    if (productData.unit_abbreviation) {
      this.unit_abbreviation = productData.unit_abbreviation;
    }
  }

  static async findProductById(productId) {
    const query = `SELECT * FROM products WHERE id = ?`;
    const [product] = await db.query(query, [productId]);

    if (!product[0]) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }
    return new Product(product[0]);
  }

  static async findProductDetailsForCart(productId) {
    const query = `SELECT id, title, price FROM products WHERE id = ?`;
    const [product] = await db.query(query, [productId]);

    if (!product[0]) {
      const error = new Error("Could not find product with provided id.");
      error.code = 404;
      throw error;
    }
    return product[0];
  }

  static async findAllProducts() {
    const query = `
      SELECT products.*, measurement_units.abbreviation AS unit_abbreviation 
      FROM products INNER JOIN measurement_units ON products.unit_id = measurement_units.id
    `;
    const [products] = await db.query(query);
    return products.map(function (product) {
      return new Product(product);
    });
  }

  static async getCategoriesList() {
    const [categories] = await db.query("SELECT * FROM product_category");
    return categories;
  }

  static async getUnitsList() {
    const [units] = await db.query("SELECT * FROM measurement_units");
    return units;
  }

  static async findMultipleProductsById(productIds) {
    if (!productIds || productIds.length === 0) {
      return [];
    }
    const placeholders = productIds.map(() => "?").join(", ");
    const query = `SELECT * FROM products WHERE id IN (${placeholders})`;

    const [products] = await db.query(query, productIds);

    return products.map(function (product) {
      return new Product(product);
    });
  }

  updateImageData() {
    this.imagePath = path.join(
      process.env.IMAGE_UPLOAD_DESTINATION,
      this.image
    );
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async saveProduct() {
    const productData = [
      this.title,
      this.image,
      this.category_id,
      this.summary,
      this.price,
      this.unit_id,
      this.stock,
      this.description,
    ];

    if (this.id) {
      let query;
      if (!this.image) {
        const indexOfImage = productData.indexOf(this.image);
        productData.splice(indexOfImage, 1);
        query = `UPDATE products SET title=?, category_id=?, summary=?, price=?, unit_id=?, stock=?, description=? WHERE id=?`;
      } else {
        query = `UPDATE products SET title=?, image=?, category_id=?, summary=?, price=?, unit_id=?, stock=?, description=? WHERE id=?`;
      }

      await db.query(query, [...productData, this.id]);
    } else {
      const query = `INSERT INTO products (title, image, category_id, summary, price, unit_id, stock, description) VALUES (?)`;
      await db.query(query, [productData]);
    }
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  async removeImage() {
    const imagePath = path.join(process.env.IMAGE_UPLOAD_DESTINATION, this.image);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.error(`Error removing image: ${error.message}`);
    }
  }

  removeProduct() {
    const query = "DELETE FROM products WHERE id=?;";
    return db.query(query, [this.id]);
  }
}

module.exports = Product;
