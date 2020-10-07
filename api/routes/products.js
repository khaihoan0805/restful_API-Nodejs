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
// (req, res, next) => {
//     const id = req.params.productId
//     const updateOps = {}
//     for (let ops of req.body) {
//         updateOps[ops.propName] = ops.value
//     }
//     var updatedProduct;
//     Product.update({_id: id}, {$set: updateOps})
//     .exec()
//     .then(result => {
//         console.log(result)
//         res.status(200).json({
//             message: "updated successfully",  
//         })
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({
//             error: err 
//         })
//     })    
// })

router.delete("/:productId", checkToken, ProductCtrl.remove)

module.exports = router