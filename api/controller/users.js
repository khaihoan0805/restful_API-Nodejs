const mongoose = require('mongoose')
const User = require('../model/user')

const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const jwt = require('jsonwebtoken')

module.exports.create = async (req, res, next) => {
    try {
        if (!emailValidator.validate(req.body.email)) {
            return res.status(403).json({
                message: "email " + req.body.email + " is invalid"
            })
        }
        let findingUser = await User.findOne({ email: req.body.email })
        if (findingUser) {
            return res.status(403).json({
                message: "this Email is already registed"
            })
        } else {
            var user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            })
            await user.save()
            return res.status(201).json({
                message: "created user successfully"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            error: err
        })
    }
}

module.exports.getAll = async (req, res, next) => {
    try {
        let findingUsers = await User.find({})
        let response = {
            count: findingUsers.length,
            products: findingUsers
        }
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports.login = async (req, res, next) => {
    let findingUser = await User.findOne({ email: req.body.email })
    if (!findingUser) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
    if (await bcrypt.compareSync(req.body.password, findingUser.password)) {
        const token = await jwt.sign({
            email: findingUser.email,
            userId: findingUser._id
        },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        )
        return res.status(200).json({
            message: "Auth successful",
            token: token
        })
    } else {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        let email = req.body.email
        if (!emailValidator.validate(email)) {
            return res.status(404).json({
                message: "email " + email + " is invalid"
            })
        }
        let findingUser = await User.findOne({email: email})
        if (!findingUser) {
            return res.status.json({
                message: "this email" + email + "is not found"
            })
        } else {
            let foundUser = await User.deleteOne(findingUser)
            return res.status(200).json({
                message: "deleted successfully",
                deletedUser: foundUser
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

