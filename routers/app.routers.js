const express = require('express');
const { webAuth, homeAuth } = require('../middlewares/auth');
const router = express.Router();
const authRoutes = require('./auth/auth.routes')
const productsRoutes = require('./products/products.routes')
const randomRoutes = require("./random/random.routes")
const infoRoutes = require("./info/info.routes")
const logger = require("../logger/logger")
const requestLogger = require("../middlewares/requestLogger")

const path = require('path');
const Products = require('../models/products.mongo');

const ProductsModel = new Products()

router.use("/auth", authRoutes)
router.use("/random", randomRoutes)
router.use("/info", infoRoutes)


router.get('/', webAuth, requestLogger, async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/login.html'));
});

router.get('/home', homeAuth, async (req, res) => {
    res.render(path.resolve(__dirname, '../public/index.ejs'), { products: ProductsModel.getAll(), user: req.user });
});

router.get('/register', webAuth, requestLogger, async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/signup.html'));
});

router.get('/loginError', requestLogger, (req, res) => {
    res.render(path.join(process.cwd(), 'Public/views/pages/loginError.ejs'))
})
router.get('/signupError', requestLogger, (req, res) => {
    res.render(path.join(process.cwd(), 'Public/views/pages/signupError.ejs'))
})
router.post('/products', requestLogger, productsRoutes)

router.get('*', (req, res) => {
    logger.warn({ msg: `${req.url} method:${req.method} not found` })
    res.status(404).send('Página no encontrada')
})


module.exports = router;