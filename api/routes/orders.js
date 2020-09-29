const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Order = require('./model/order')
const Product = require('./model/product')

router.get('/', (req, res, next) => {
    Order.find()
    .populate('product', 'name')
    .exec()
    .then(docs => {
        // const response = {
        //     count: docs.length,
        //     order: docs.map(doc => {
        //         return {
        //             _id: doc._id,
        //             product: doc.product,
        //             quantity: doc.quantity
        //         }
        //     })
        // }
        res.status(200).json({
            message: "successfully got all Orders",
            count: docs.length,
            order: docs
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.post('/', (req, res, next) => {
    // Product.findById(req.body.productId)
    // .exec()
    // .then(product => {
    //     if (!product) {
    //         return res.status(404).json({
    //             message: "product not found"
    //         })
    //     }
    //     const order = new Order({
    //         _id: mongoose.Types.ObjectId(),
    //         product: req.body.productId,
    //         quantity: req.body.quantity 
    //     })
    //     return order.save()
    // })
    // .then(result => {
    //     console.log(result)
    //     res.status(201).json({
    //         message: "created successfully",
    //         createdOrder: result
    //     })
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.status(500).json({
    //         error: err
    //     })
    // })
    let productCheck = Product.findById(req.body.productId).exec()
    console.log(productCheck)
    Product.findById(req.body.productId)
    .exec()
    .then(product => {
        if (!product) {
            res.status(404).json({
                message: "product not found"
            })
        } else {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: product._id,
                quantity: req.body.quantity
            })
            order.save()
            .then(order => {
                console.log(order)
                res.status(201).json({
                    message: "created order successfully",
                    createdOrder: order
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
        }       
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:orderId', (req, res, next) => {
    let id = req.params.orderId
    Order.findById(id)
    .populate('product')
    .exec()
    .then(result => {
        if (result) {
            console.log(result)
            res.json({
            message: "successfully got the order by ID",
            order: result
            })
        } else {
            res.status(500).json({    
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

router.delete("/:orderId", (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "successfully deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router