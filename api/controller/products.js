const express = require('express')
const mongoose = require('mongoose')
const Product = require('../model/product')

module.exports.getAll = async (req, res, next) => {
    try {
        let findingProducts = await Product.find({})
        let response = {
            count: findingProducts.length,
            products: findingProducts
        }
        return res.status(200).json(response)
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.create = async (req, res, next) => {
    try {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        });
        await product.save()
        res.status(200).json({
            message: "created product successfully",
            product: product
        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        const productId = req.params.productId
        let findingProduct = await Product.findById(productId).select('_id name price productImage').exec()
        console.log(findingProduct)
        if (findingProduct) {
            let response = {
                message: "successfully found product by ID",
                product: {
                    _id: findingProduct._id,
                    name: findingProduct.name,
                    price: findingProduct.price,
                    productImage: findingProduct.productImage
                }
            }
            res.status(201).json(response)
        } else {
            res.status(400).json({
                message: "no valid entry found for provided ID"
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

module.exports.update = async (req, res, next) => {
    try {
        const id = req.params.productId
        const updateOps = {}
        for (let ops of req.body) {
            updateOps[ops.propName] = ops.value
        }
        var updatedProduct = await Product.updateOne({ _id: id }, updateOps)
        res.status(200).json({
            message: "updated successfully",
            updatedProduct: updatedProduct
        })
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports.remove = (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({_id: id}).exec()
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
}