const express = require('express');

const router = express.Router();

const controller = require("../controllers/products")


// First
// router.get("/", controller.root);
// router.get('/lol', controller.lol);
// router.get("/product/:id",controller.getProduct);
// router.get("/products/query", controller.prodQuery);
// router.post("/home", controller.home);

// ==================================================================
// Second
router.route('/').get(controller.root);
router.route('/lol').get(controller.lol);
router.route('/product/:id').get(controller.getProduct);
router.route('/products/query').get(controller.prodQuery);
router.route('/home').post(controller.home);





module.exports = router;