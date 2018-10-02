const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/eac', { useNewUrlParser: true, useCreateIndex: true })

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/actions', require('./routes/actions'))
app.use('/actors', require('./routes/actors'))
app.use('/domains', require('./routes/domains'))
app.use('/schools', require('./routes/schools'))
app.use('/auth', require('./routes/auth'))

module.exports = app