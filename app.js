const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cookieParser());
app.use(addCsrfTokenMiddleware);

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;
app.listen(PORT);
