/** @format */

const express = require("express");
const dbConnect = require("./config/dbconnect");
const initRouter = require("./routes/index");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dbConnect();
initRouter(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
