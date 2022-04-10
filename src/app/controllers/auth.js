const Users = require("../models/users");
const Course = require("../models/Course")
var bcrypt = require("bcrypt");
const { render } = require('express/lib/response');
const CourseController = require('./CourseController');

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
            const user = Users.findOne({
                username: req.body.username
            })
            if(user.length > 0){
                var status = "The username is already exists!"
                res.render('register', {status: status})
            }else{
                bcrypt.hash(req.body.password, 10).then(
                (hash) => {
                    const user = new Users({
                    username: req.body.username,
                    password: hash
                    });
                    user.save().then(
                    () => {
                        var status = 'Register successful! Login now'
                        res.render('login', {status: status})
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
    getChangePass (req, res) {
        res.render('change-password',{auth: req.session.isAuthenticated})
    }
    postChangePass (req, res){

        if(req.body.password1 === req.body.password2){
            bcrypt.hash(req.body.password1, 10).then(
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
        }else{
            var status = "password doesn't match"
            res.render('change-password', {status: status})
        }       
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
        res.render("reset-password", {auth: req.session.isAuthenticated})
    }
    postResetPass (req, res){
        bcrypt.hash(req.body.password, 10).then(
            (hash) => {
                const user = Users.findOneAndUpdate({
                    username: req.body.username
                },{
                    password: hash
                },{
                    new: true
                  }).then(
                    () => {
                        var status = "Change password successful! Login now"
                        console.log(user.password)
                        res.render("login", {status: status, auth: req.session.isAuthenticated})
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
    getMyProducts (req, res){
        const user = Users.find({
            _id: req.session._id
        })
        .lean()
        .populate('courses')
        .then(
            (user)=>{
                console.log(user)
                console.log(user[0].courses)
                res.render('my-products', {
                    auth: req.session.isAuthenticated,
                    courses: user[0].courses
                })
            }
        )
        .catch(err=>{
            console.log(err)
        })
        
    }
}
module.exports=new authController;

