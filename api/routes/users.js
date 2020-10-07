const express = require('express')
const router = express.Router()

const UserCtrl = require('../controller/users')

router.get('/', UserCtrl.getAll)

router.post('/signup', UserCtrl.create)

router.post('/login', UserCtrl.login)

router.delete('/remove', UserCtrl.remove)

module.exports = router