const bcrypt = require("bcryptjs");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, phone, address, city, postal) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.phone = phone;
    this.address = address;
    this.city = city;
    this.postal = postal;
  }

  getUserWithSameEmail() {
    const query = `SELECT * FROM users WHERE email = ?`;
    return db.query(query, [this.email]);
  }

  async existsAlready() {
    const [existingUser] = await this.getUserWithSameEmail();
    if (existingUser[0]) {
      return true;
    }
    return false;
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    const userData = [this.email, hashedPassword];
    const userQuery = `INSERT INTO users (email, password) VALUES (?)`;
    const [result] = await db.query(userQuery, [userData]);

    const userId = result.insertId;

    const userDetails = [
      userId,
      this.name,
      this.phone,
      this.address,
      this.city,
      this.postal,
    ];
    const userDetailsQuery = `INSERT INTO user_details (user_id, fullname, phone_number, address, city, postal_code) VALUES (?)`;
    await db.query(userDetailsQuery, [userDetails]);
  }
}

module.exports = User;
