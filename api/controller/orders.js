const mongoose = require('mongoose')
const Order = require('../model/order')
const Product = require('../model/product')

module.exports.getAll = async (req, res, next) => {
    try {
        let orders = await Order.find({}).populate('product', 'name')
        return res.status(200).json({
            message: "file all orders successfully",
            orders: orders
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports.create = async (req, res, next) => {
    try {
        let productId = req.body.productId
        let findingProduct = await Product.findById(productId).exec()
        console.log(findingProduct)
        if (!findingProduct) {
            return res.status(404).json({
                message: "product not found"
            })
        } else {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: findingProduct._id,
                quantity: req.body.quantity
            })
            let savedOrder = await order.save()
            return res.status(200).json({
                message: "created order successfully",
                savedOrder: savedOrder
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        let id = req.params.orderId
        let findingOrder = await Order.findById(id).populate('product')
        console.log(findingOrder)
        if (!findingOrder) {
            return res.status(500).json({
                message: "no valid entry found for provided ID"
            })
        } else {
            return res.status(200).json({
                message: "successfully got the order by ID",
                order: findingOrder
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Not Found",
            error: err
        })
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        let findingOrder = await Order.findByIdAndDelete(req.params.orderId)
        if (!findingOrder) {
            return res.status(500).json({
                message: "no valid entry found for provided ID"
            })
        } else {
            return res.status(200).json({
                message: "successfully deleted the order by ID",
                order: findingOrder
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Not Found",
            error: err
        })
    }
}