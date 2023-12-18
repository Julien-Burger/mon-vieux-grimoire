const express = require("express");

const bookCtrl = require("../controllers/book");
const authMdw = require("../middlewares/auth");
const multerConfig = require("../middlewares/mutler-config");
const sharp = require("../middlewares/sharp");

const router = express.Router();

router.get("/bestrating", bookCtrl.bestRating);
router.post("/", authMdw, multerConfig, sharp, bookCtrl.createBook);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getBook);
router.delete("/:id", authMdw, bookCtrl.deleteBook);
router.post("/:id/rating", authMdw, bookCtrl.rateBook);
router.put("/:id", authMdw, multerConfig, sharp, bookCtrl.updateBook);

module.exports = router;
