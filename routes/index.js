/** @format */

const userRouter = require("./user");
const productRouter = require("./product");
const { errorHandler, notFound } = require("../middlewares/erorHandler");
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRouter;
