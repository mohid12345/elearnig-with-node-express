const express = require('express')
const session = require('express-session')

const creatorSessionMiddleware = session({
    secret: 'JWT_SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24*60*60*1000,
        secure:false,
        httpOnly: true,  
    },
})

module.exports = creatorSessionMiddleware