const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passport = require('passport')
let User = require('../models/user')

router.get('/register', (req, res)=>{
    res.render('register')
})

router.post('/register', (req, res)=>{
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const cpassword = req.body.cpassword

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Use a valid email').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('cpassword',"Passwords doesn't match").equals(req.body.password);

    let errors = req.validationErrors();
    if(errors) {
        res.render('register', {
        errors: errors
    })} else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        })
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) console.log(err)
                newUser.password = hash
                newUser.save((err)=>{
                    if(err) res.status(500).send(err)
                    req.flash('success', 'You are registred now and you can login')
                    res.redirect('login')
                });
            })
        })
    }

})
router.get('/login', (req, res)=>{
    res.render('login')
})
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
module.exports= router