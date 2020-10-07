const express = require('express')
const router = express.Router()
const checkToken = require('../middleware/checkToken')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jqeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({ 
    storage: storage,
})

const mongoose = require('mongoose')
const Product = require('../model/product')
const ProductCtrl = require('../controller/products')

router.get('/', ProductCtrl.getAll)

router.post('/', checkToken, upload.single('productImage'), ProductCtrl.create)

router.get('/:productId', ProductCtrl.getOne)

router.patch('/:productId', checkToken, ProductCtrl.update)

router.delete("/:productId", checkToken, ProductCtrl.remove)

module.exports = router