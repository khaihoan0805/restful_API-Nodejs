const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

const morgan = require('morgan')
app.use(morgan('dev'))

const productRoute = require('./api/routes/products')
const orderRoute = require('./api/routes/orders')
const userRoute = require('./api/routes/users')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const mongoDB = process.env.MONGO_DB || "nodejs_API"
try {
    mongoose.connect('mongodb://localhost:27017/'+ mongoDB +'serverSelectionTimeoutMS=5000&connectTimeoutMS=10000', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true}, 
    () => console.log("connected successfully with " + mongoDB));    
}
catch (error) { 
    console.log("could not connect");    
}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/uploads',express.static('uploads'))
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoute)
app.use('/orders', orderRoute)
app.use('/users', userRoute)

app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(PORT, () => {
    console.log("server is listenning on port 3000")
})