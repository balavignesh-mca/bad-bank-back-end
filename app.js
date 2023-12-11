const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandeler = require("./middleware/errorHandler");


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bankRoute = require("./routes/bankRoute");
app.use("/", bankRoute);

module.exports = app;
