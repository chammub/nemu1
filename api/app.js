const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const errorMiddleware = require("./middleware/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "api/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
const user = require("./routes/userRoute");
// const product = require("./routes/productRoute");
// const order = require("./routes/orderRoute");
// const payment = require("./routes/paymentRoute");

app.use("/api/v1", user);
// app.use("/api/v1", product);
// app.use("/api/v1", order);
// app.use("/api/v1", payment);

const webAppRoute = require("./routes/webAppRoute")
app.use("/", webAppRoute);

if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use("/", express.static(path.join(__dirname, "../src/admin/webapp")));
} else {
    app.use("/", express.static(path.join(__dirname, "../src/admin/dist")));
}

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;