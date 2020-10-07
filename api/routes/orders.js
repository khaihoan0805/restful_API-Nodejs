const express = require('express')
const router = express.Router()
const checkToken = require('../middleware/checkToken')
const OrderCtrl = require('../controller/orders')

router.get('/', OrderCtrl.getAll)

router.post('/', OrderCtrl.create)

router.get('/:orderId', OrderCtrl.getOne)

router.delete("/:orderId", checkToken, OrderCtrl.remove)

module.exports = router