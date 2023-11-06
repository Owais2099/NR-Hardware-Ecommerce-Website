const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2/promise");
const db = require("./data/database");

async function initDB() {
  try {
    // Create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    await connection.end();

    // Create tables if they don't exist

    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      email VARCHAR(45) NOT NULL,
      password VARCHAR(255) NOT NULL,
      isAdmin TINYINT NOT NULL DEFAULT '0',
      PRIMARY KEY (id))
      ENGINE = InnoDB;`);

    await db.query(`CREATE TABLE IF NOT EXISTS user_details (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      fullname VARCHAR(100) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(20) NOT NULL,
      postal_code INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX user_id_idx (user_id ASC) VISIBLE,
      CONSTRAINT user_id
        FOREIGN KEY (user_id)
        REFERENCES ${process.env.DB_NAME}.users (id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT);`);

    await db.query(`CREATE TABLE IF NOT EXISTS measurement_units (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(45) NOT NULL,
      abbreviation VARCHAR(10) NOT NULL,
      PRIMARY KEY (id));`);

    await db.query(`CREATE TABLE IF NOT EXISTS product_category (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(45) NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id));`);

    await db.query(`CREATE TABLE IF NOT EXISTS products (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(100) NOT NULL,
      image VARCHAR(255) NOT NULL,
      category_id INT NOT NULL,
      summary VARCHAR(255) NOT NULL,
      price DECIMAL(13,2) NOT NULL,
      unit_id INT NOT NULL,
      stock INT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX category_id_idx (category_id ASC) VISIBLE,
      INDEX unit_id_idx (unit_id ASC) VISIBLE,
      CONSTRAINT category_id
        FOREIGN KEY (category_id)
        REFERENCES ${process.env.DB_NAME}.product_category (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
      CONSTRAINT unit_id
        FOREIGN KEY (unit_id)
        REFERENCES ${process.env.DB_NAME}.measurement_units (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE);`);

    await db.query(`CREATE TABLE IF NOT EXISTS order_status (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(20) NOT NULL,
      description VARCHAR(255) NOT NULL,
      PRIMARY KEY (id));`);

    await db.query(`CREATE TABLE IF NOT EXISTS orders (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      total_quantity INT NOT NULL,
      total_price DECIMAL(13,2) NOT NULL,
      status_id INT NOT NULL,
      ordered_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX fk_status_id_idx (status_id ASC) VISIBLE,
      INDEX fk_user_id_idx (user_id ASC) VISIBLE,
      CONSTRAINT fk_status_id
        FOREIGN KEY (status_id)
        REFERENCES ${process.env.DB_NAME}.order_status (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
      CONSTRAINT fk_user_id
        FOREIGN KEY (user_id)
        REFERENCES ${process.env.DB_NAME}.users (id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT);`);

    await db.query(`CREATE TABLE IF NOT EXISTS order_items (
      id INT NOT NULL AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(13,2) NOT NULL,
      PRIMARY KEY (id),
      INDEX order_id_idx (order_id ASC) VISIBLE,
      INDEX product_id_idx (product_id ASC) VISIBLE,
      CONSTRAINT order_id
        FOREIGN KEY (order_id)
        REFERENCES ${process.env.DB_NAME}.orders (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT product_id
        FOREIGN KEY (product_id)
        REFERENCES ${process.env.DB_NAME}.products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE);`);

    //Insert Data into Tables

    await db.query(`INSERT INTO users (email, password, isAdmin) 
      VALUES ("admin@gmail.com", "$2a$12$fiQ9acyFjvXY5BpAKLoUxOoE4mMuuVS/P6lcRzKB25ASuNUPryfZu", 1),
      ("john@gmail.com", "$2a$12$O0fftDnIlZUPoVvx7Pq1O.5GIG9M7rnqX43hPGmcqvc2MDmmGovTW", 0),
      ("tom@gmail.com", "$2a$12$WQQv/RN21lWLxPizVUv8W.sMuB9o8PwJ6uG70D85Q4dpmb58x8DMa", 0);`);

    await db.query(`INSERT INTO user_details (user_id, fullname, phone_number, address, city, postal_code) 
      VALUES (1, "Muhammad Owais", "0123456789", "House#354, Main-Road, Lala-Rukh", "Wah Cantt", 47010),
      (2, "John Cena", "203-352-8600", "World Wrestling Entertainment, 1214, East Main Street, Stamford, United States", "Stamford", 26902),
      (3, "Tom Cruise", "+1-323-684-7666", "Tom Cruise, 42 West, 600 3rd Avenue, 23rd Floor, New York, USA", "New York", 10016);`);

    await db.query(`INSERT INTO measurement_units (title, abbreviation) 
      VALUES ("Piece", "pc"),
      ("Pair", "pr"),
      ("Dozen", "doz"),
      ("Set", "set"),
      ("Milligrams", "mg"),
      ("Grams", "g"),
      ("Kilograms", "kg"),
      ("Pounds", "lb"),
      ("Ounces", "oz"),
      ("Milliliters", "mL"),
      ("Liters", "L"),
      ("Gallons", "gal"),
      ("Fluid Ounces", "fl oz"),
      ("Millimeters", "mm"),
      ("Centimeters", "cm"),
      ("Meters", "m"),
      ("Inches", "in"),
      ("Feet", "ft"),
      ("Square Centimeters", "sq cm"),
      ("Square Meters", "sq m"),
      ("Square Inches", "sq in"),
      ("Square Feet", "sq ft");`);

    await db.query(`INSERT INTO product_category (title, description) 
      VALUES ("Hand Tools", "Encompasses manual tools for various tasks. Examples: Hammers, screwdrivers, pliers, wrenches, saws."),
      ("Electrical", "Covers hardware components for electrical systems, including electrical connectors, conduit fittings, and junction boxes."),
      ("Plumbing", "Hardware components for plumbing systems, including faucet washers, pipe clamps, and drain traps."),
      ("Power Equipment", "Hardware related to outdoor power tools, including chainsaw chains, lawnmower blades, and leaf blower nozzles."),
      ("Clothing", "Includes hardware for clothing and accessories, such as helmets, buttons, zippers, and buckles."),
      ("Power Tools", "Hardware for electric and cordless power tools, including drill bits, saw blades, and grinder discs."),
      ("Housewares", "Hardware products for home organization and repair, including cabinet knobs, drawer slides, and door hinges."),
      ("Building & Construction", "Hardware for construction and building materials, including construction screws, brackets, and anchors.");
      `);

    await db.query(`INSERT INTO products (title, image, category_id, summary, price, unit_id, stock, description) 
      VALUES ("Harden Claw Hammer", "65bad99a-704f-4045-90fa-37f1204dc9f4-hammer.jpg", 1, "Claw Hammer with HRC>48 steel head, magnetic for nail adsorption, and ergonomic cushioned grip.", 6.00, 1, 30, "- Claw Hammer with Fiberglass Handle 0.70kg/24oz
      - Forged fine grain steel head hardened. HRC>48
      - Head with magnetic, easy for adsorption of nails while working.
      - Shaft with comfortable ergonomics cushion grip."),
      ("Plass", "c6d8e538-ae4f-4c84-8571-44391efacb71-plass.jpg", 1, "Premium 8-inch red plass for electrical and mechanical work, with a durable rubber handle, ideal for professional and household use", 3.00, 1, 34, "- Durable Premium Quality Product
      - Size: 8 inches
      - Color: Red
      - Suitable for Electrical, Mechanical Work
      - For Professional and Household Works
      - Durable Rubber Handle"),
      ("Safety Helmet", "a32aa398-faca-476f-bdaf-033ccac49872-Safety-helmet.jpg", 5, "Versatile safety helmet with UV-resistant shell, adjustable harness, and accessory compatibility for head protection.", 2.75, 1, 145, "- Ratchet size adjustment: 53/63 cm.
      - Weight: 0.360 kg
      - Adjustable ventilation shell
      Multipurpose safety helmet with UV-resistant high density polypropylene (PP) ventilated outer shell protects from head traumas caused by small falling objects. Polyamide harness lining has 3 textile bands with 8 fixing points and a foam sweat band. The helmet has 2 possible positions of the headband (top/low) for better comfort. This helmet can be used with accessories."),
      ("BOSCH Drill Machine", "825bcba3-3c6c-4254-bf96-fe2b4e58950d-Drill Machine.jpg", 4, "Imported top-quality drill machine with 100% pure copper winding, 2600 RPM speed, versatile use for various materials, and included accessories.", 20.00, 4, 19, "- Imported Top Quality Drill Machine In Very Reasonable Price.
      - 100% Pure Copper Winding.
      - Super Fast 2600 RPM.
      - 10MM Chuck (Removable).
      - Heat Sink Technology Front Metal Body.
      - For Drilling In Concrete Wall + Wood + Metal.
      - With Auto Switch Mode.
      - 220V Power Input.
      - 5 Feet Long Wire.
      - Comfortable Grip.
      - Blue Color.
      - Complete Box + Guide Book + Drill Key."),
      ("Grinding Wheel", "966dd786-3bb1-4e25-b96f-eccfcca96a38-Grinding Disc.jpg", 6, "The Expert for Metal Grinding Disc offers long-lasting performance and safety for metal grinding, compatible with hand-held angle grinders.", 10.50, 4, 16, "Pieces: 8
      Max rpm: 10200
      The Expert for Metal Grinding Disc delivers an impressively long lifetime on metal with maximum safety. Its premium aluminium oxide abrasive grain, selected functional fillers and additives in a modern phenol resin bond matrix are particularly suited for metal applications. Furthermore, its precision-manufactured fibreglass fabric ensures especially high disc stability and maximum work safety. It is intended for grinding metal. It is suitable for use with hand-held angle grinders.");
      `);

    await db.query(`INSERT INTO order_status (title, description) 
      VALUES ("Pending", "This means that the customer has begun the checkout process without making the necessary payments for the products."),
      ("Awaiting Payment", "The customer may have initiated the payment process but is yet to pay for the product."),
      ("Payment Received", "This means that the customer has completed the payment for the order."),
      ("Order Confirmed", "This means that the customer has completed the payment and the order has been received and acknowledged by the e-commerce site."),
      ("Failed", "This means that the customer could not complete the payment or other verifications required to complete the order."),
      ("Expired", "The customer could not make the payment for the products within the stipulated payment window."),
      ("Awaiting Fulfillment", "This means that the customer has made the required payments for the price of the products, and the products shall now be shipped."),
      ("Awaiting Shipment", "This means that the products bought by the customer are now in a queue ready to be shipped and are waiting to be collected by the shipment service provider."),
      ("On Hold", "This means that the stock inventory is reduced by the number of products the customer has requested. However, other steps need to be completed for order fulfillment."),
      ("Shipped", "This means that the shipment provider has collected the products and the products are on their way to the customer."),
      ("Partially Shipped", "This means that only a part of the order or some products in the order are shipped."),
      ("Awaiting Pickup", "This means that the products have been shipped to either the customer-specified location or the business-specified location and are waiting to be picked up by the customer for delivery."),
      ("Completed", "This means that the product has been shipped and delivered, and the payment for the same has been made. The customer, at this point, can receive an invoice regarding the product they bought."),
      ("Canceled", "This might mean a variety of things. Both the seller and the customer may cancel an order. An order generally shows canceled if the customer fails to make the payment or if the seller has run out of stock of a particular product."),
      ("Declined", "The seller declares that they cannot ship and fulfill the order."),
      ("Refunded", "The seller agrees to refund the amount paid by the customer to buy the product."),
      ("Partially Refunded", "The seller partially refunds the amount paid by the customer while buying the product."),
      ("Refund Rejected", "The seller refuses to process the entire or partial refund of the amount paid by the customer at the time of buying the products."),
      ("Disputed", "The customer has raised an issue with the order fulfillment or the refund procedure. Generally, customers raise disputes when e-commerce websites refuse to refund the amount paid by them.")`);

    await db.query(`INSERT INTO orders (user_id, total_quantity, total_price, status_id) 
      VALUES (3, 5, 21.00, 4), (2, 10, 60.25, 2), (3, 25, 68.75, 1);`);

    await db.query(`INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
      VALUES (1, 1, 2, 6.00), (1, 2, 3, 3.00), (2, 4, 1, 20.00), (2, 5, 2, 10.50), (2, 3, 7, 2.75), (3, 3, 25, 2.75);`);

    console.log("Database and tables are initialized.");
  } catch (err) {
    console.error("Error initializing the database:", err);
  } finally {
    process.exit();
  }
}

initDB();
