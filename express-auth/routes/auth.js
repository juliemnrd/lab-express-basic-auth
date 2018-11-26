const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

const count = 7

router.get('/signup', (req,res) => {
    res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
    const {username, password} = req.body
    if(username == '' || password == '') return res.render('auth/signup', {
        message: 'Please fill the fields'
    })
    User.findOne({username})
        .then( response => {
            if(response === null){
                const salt = bcrypt.genSaltSync(count)
                const passwordEnc = bcrypt.hashSync(password, salt)
                User.create({username, password:passwordEnc})
                    .then( user => {
                        res.render('auth/home', user)
                    })
                    .catch( e => next(e))
            }
        })
        .catch( e => next(e))

})

router.get('/login', (req,res,next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (user === null) {
                return res.render('auth/login', {
                    message: 'This username doesnt exist, please sign up first'
                })
            }
            if (bcrypt.compareSync(password, user.password)) {
                res.redirect('/main');
            } else {
                return res.send('incorrecto')
            }
        })
        .catch( e => next(e))
})


module.exports = router
