const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const User = require('../routes/model/user')

const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const jwt = require('jsonwebtoken')

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            res.status(200).json({
                message: "find all user successfully",
                users: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/signup', async (req, res, next) => {
    try {
        if (!emailValidator.validate(req.body.email)) {
            return res.status(403).json({
                message: "email " + req.body.email + " is invalid"
            })
        }
        let findingUser = await User.findOne({ email: req.body.email }).exec()
        console.log(findingUser)
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
})
//     User.find({email: req.body.email})
//     .exec()
//     .then(matching => {
//         if (matching.length >= 1) {
//             return res.status(422).json({
//                 message: "This email is aldready registed"
//             })
//         } else {
//             bcrypt.hash(req.body.password, 10, (err, hash) => {
//                 if (err) {
//                     return res.status(500).json({
//                         error: err
//                     })
//                 } else {
//                     const user = new User({
//                         _id: mongoose.Schema.Types.ObjectId(),
//                         email: req.body.email,
//                         password: hash
//                     })
//                     user.save()
//                     .then(result => {
//                         console.log(result)
//                         res.status(200).json({
//                             message: "created user successfully",
//                             created: result
//                         })
//                     })
//                     .catch(err => {
//                         res.status(500).json({
//                             error: err
//                         })
//                     })
//                 }
//             })
//         }
//     })
// })

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            checkingPassword = bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
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
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result)
            return res.status(200).json({
                message: 'deleted user successfully'
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
})

module.exports = router