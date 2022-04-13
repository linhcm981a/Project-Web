const Users = require("../models/users");
const Course = require("../models/Course")
var bcrypt = require("bcrypt");
const { render } = require('express/lib/response');
const CourseController = require('./CourseController');
const nodemailer = require("nodemailer");
var randomstring = require("randomstring");

class authController{
    getLogin (req, res){
        res.render('login')
    }
    
    postLogin (req, res){
        const user = Users.findOne({
            username: req.body.username
        })
        .then(
            user => {
                if(!user){           
                    var status = "The username is not found"         
                    return res.render('login', {status: status})
                }
                bcrypt.compare(req.body.password, user.password).then(
                    valid =>{
                        if(!valid){
                            var status = "The password is wrong"
                            return res.render('login', {status: status})
                        }
                        var sess = req.session; 
                            sess.isAuthenticated = true;
                            sess._id = user._id;
                            sess.auth = user.auth;
                            req.session.save((err) => {
                                console.log(err);
                            })
                            res.render('home', {auth: sess.isAuthenticated})
                    }
                ).catch(err=>{
                    res.status(500).send(err)
                })
            }
        ).catch(err=>{
            res.status(500).send(err)
        })
        
    }
    
    getLogout (req, res){
        req.session.destroy();
        res.render("home")
    }
        
    getSignUp (req, res){
        res.render('register')
    }

    postSignUp (req, res){
            const user = Users.findOne({ $or:[
                 {'username':req.body.username}, 
                 {'email':req.body.email}
            ]}).then(
                (user)=>{
                    if(user){
                        var status = "The username or email is already exists!"
                        res.render('register', {status: status})
                    }else{
                        bcrypt.hash(req.body.password, 10).then(
                            (hash) => {
                                const user = new Users({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash
                                });
                                user.save().then(
                                () => {
                                    var sess = req.session; 
                                        sess.isAuthenticated = true;
                                        sess._id = user._id;
                                        sess.auth = user.auth;
                                        req.session.save((err) => {
                                            console.log(err);
                                        })
                                    var status = 'Register successful! Login now'
                                    res.redirect('verify-email')
                                }
                                ).catch(
                                (error) => {
                                    res.status(500).json({
                                    error: error
                                    });
                                }
                                );
                            }
                            );
                        }
                }
            )
    }
    getVerifyEmail (req, res, next) {
        var transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
            user: "info.haihuynh@gmail.com",
            pass: "sgraajknpklqknwk"
            }
        });
        Users.findOne({ _id: req.session._id })
        .then(user => {
            var verification_token = randomstring.generate({
            length: 10
            });
            var mainOptions = {
            from: "Website",
            to: user.email,
            subject: "Test",
            text: "text ne",
            html:
                "<p>Cảm ơn đã đăng kí tài khoản của Website. Mã kích hoạt của bạn là:</p>" +
                verification_token
            };
            transporter.sendMail(mainOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Sent:" + info.response);
            }
            });
            user.verify_token = verification_token;
            user.save();
            let email = user.email
            res.render('verify-email', {email: email})
        });
        
    }
    postVerifyEmail (req, res) {
        const token = req.body.token;
        Users.findOne({ _id: req.session._id }, (err, user) => {
            if (token == user.verify_token) {
            user.auth = true;
            user.save();
            req.session.auth = user.auth;
            return res.render("home",{auth: req.session.isAuthenticated});
            } else if (token != user.verify_token) {
            return res.render("verify-email", {message: "The token is wrong, pleasure check the mail again."});
            }
        });
    }
    getChangePass (req, res) {
        res.render('change-password',{auth: req.session.isAuthenticated})
    }
    postChangePass (req, res){
        Users.findOne({_id: req.session._id}).then(
            user=>{
                bcrypt.compare(req.body.password1, user.password).then(
                    valid =>{
                        if(!valid){
                            var status = "The password is wrong"
                            return res.render('change-password', {status: status})
                        }
                        bcrypt.hash(req.body.password2, 10).then(
                            (hash) => {
                                const user = Users.findOneAndUpdate({
                                    _id: req.session._id
                                },{
                                    password: hash
                                },{
                                    new: true
                                  }).then(
                                    () => {   
                                        res.render("home", {auth: req.session.isAuthenticated})
                                    }
                                  ).catch(
                                    (error) => {
                                        console.log(error)
                                        res.status(500).json({
                                        error: error
                                        });
                                    }
                                    )
                            }).catch(
                                    (error) => {
                                        console.log(error)
                                        res.status(500).json({
                                        error: error
                                        });
                                    }
                                )
                    }
                )
            }
        )    
    }
    getUpdate (req, res){
        res.render("update-info", {auth: req.session.isAuthenticated})
    }
    postUpdate (req, res){
        const user = Users.findOneAndUpdate({
            _id: req.session._id
        },{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            description: req.body.description,
            email: req.body.email
        },{
            new: true
          }).then(
            () => {   
                res.render("home", {auth: req.session.isAuthenticated})
            }
          ).catch(
            (error) => {
                console.log(error)
                res.status(500).json({
                error: error
                });
            }
            )
    }
    getResetPass (req, res){
        res.render("forgot-password")
    }
    postResetPass (req, res){
        const email = req.body.email;
        Users.findOne({ email: email }, (err, user) => {
            if (!user) {
            return res.redirect("/forgot-password");
            } else {
            var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                user: "info.haihuynh@gmail.com",
                pass: "sgraajknpklqknwk"
                }
            });
            var tpass = randomstring.generate({
                length: 6
            });
            var mainOptions = {
                from: "Crepp so gud",
                to: email,
                subject: "Test",
                text: "text ne",
                html: "<p>Mật khẩu mới của bạn là:</p>" + tpass
            };
            transporter.sendMail(mainOptions, (err, info) => {
                if (err) {
                console.log(err);
                } else {
                console.log("Sent:" + info.response);
                }
            });
            bcrypt.hash(tpass, 10).then(hashPassword => {
                user.password = hashPassword;
                user.save();
            });
            res.render("login", {status: "Reset password success! Login now"});
            }
        });
    }
    getMyProducts (req, res){
        const user = Users.findOne({
            _id: req.session._id
        })
        .lean()
        .populate('courses')
        .then(
            (user)=>{
                res.render('my-products', {
                    auth: req.session.isAuthenticated,
                    courses: user.courses
                })
            }
        )
        .catch(err=>{
            console.log(err)
        })
        
    }
}
module.exports=new authController;

