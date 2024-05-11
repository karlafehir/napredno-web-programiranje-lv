var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), 
    bodyParser = require('body-parser'), 
    methodOverride = require('method-override'); 


router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
  
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    .get(function (req, res, next) {
        const data = {
            "email": "",
            "password": ""
        }

        res.render('login/index', {
            "data": data,
            "title": "Login",
        });
    })
    .post(function (req, res) {
        const email = req.body.email;
        const password = req.body.password;

        const data = {
            "email": email,
            "password": password
        }

        mongoose.model('User').findOne({ email: email, password: password }, function (err, user) {
                if (err) {
                    return console.error(err);
                } else {
                    if (user) {
                        req.session.uid = user.id;
                        res.redirect('/');
                    } else {
                        const error = "Invalid credentials. Try again."
                        res.format({
                            html: function () {
                                res.render('login/index', {
                                    "error": error,
                                    "data": data,
                                    "title": "Login",
                                });
                            }
                        });
                    }
                }
            }
        )
    });

module.exports = router;
