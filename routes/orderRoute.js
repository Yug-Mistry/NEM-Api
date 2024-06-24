const { createOrder,  getUserOrders, deleteOrder, updateOrderStatus } = require('../controllers/orderController')
const { validateToken } = require('../middlewares/validateTokenHandler')
const router = require('express').Router()

router.post('/', validateToken, createOrder)

router.get('/user-orders', validateToken, getUserOrders)


module.exports = router