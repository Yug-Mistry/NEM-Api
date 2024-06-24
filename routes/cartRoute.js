const {  validateToken } = require('../middlewares/validateTokenHandler')
const router = require('express').Router()
const { addItemToCart, getCart, removeItem, deleteCart ,updateCartItemQuantity} = require('../controllers/cartController')

router.post('/', validateToken, addItemToCart)

router.get('/get-cart', validateToken, getCart)

router.post('/remove-cart-item', validateToken, removeItem)

router.post('/update-cart-item-quantity', validateToken, updateCartItemQuantity)

router.delete('/delete-cart', validateToken, deleteCart)



module.exports = router