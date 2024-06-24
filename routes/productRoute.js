const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { validateToken, validateTokenAndAuth, AdminAuth } = require('../middlewares/validateTokenHandler')
const router = require('express').Router()

router.get('/', getProducts)

router.get('/get/:id', getProduct)


router.post('/', AdminAuth, createProduct)


router.put('/:id', AdminAuth, updateProduct)

router.delete('/:id', AdminAuth, deleteProduct)



module.exports = router