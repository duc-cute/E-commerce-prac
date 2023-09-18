/** @format */

const userRouter = require("./user");
const { errorHandler, notFound } = require("../middlewares/erorHandler");
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRouter;
