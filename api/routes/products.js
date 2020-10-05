const express = require('express')
const router = express.Router()

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
const Product = require('./model/product')

router.get('/', (req, res, next) => {
   Product.find()
   .select('_id name price productImage')
   .exec()
   .then(docs => {
       const response = {
           count: docs.length,
           products: docs.map(doc => {
               return {
                   name: doc.name,
                   price: doc.price,
                   _id: doc._id,
                   request: {
                       type: 'GET',
                       url: "http://localhost:3000/products/" + doc._id
                   }
               }
           })
       }
       res.status(200).json(response)
   })
   .catch(err => {
       res.status(500).json({
            error: err
       })
   })
})

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: "successfully created product",
            createdProduct: {
                id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
})

router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId)
    .select('_id name price productImage')
    .exec()
    .then(result => {
        console.log("From database: ", result)
        if (result) {
            let response = {
                message: "successfully found product by ID",
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage
                }
            }
            res.status(201).json(result)
        } else {
            res.status(400).json({
                message: "no valid entry found for provided ID"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Not Found",
            error: err
        })
    })
})  

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (let ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    var updatedProduct;
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: "updated successfully",  
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err 
        })
    })    
})

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: "deleted successfully"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
})
module.exports = router