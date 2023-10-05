/** @format */

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const ctrls = require("../controller/productController");
const router = require("express").Router();
router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/:uid", ctrls.getProduct);
router.get("/", ctrls.getProducts);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateProduct);

module.exports = router;
