
class Auth{
    emailVerify (req, res, next) {
        console.log(req.session.auth)
        if (req.session.auth) {
            next();
        }else{
            res.render('verify-email', {message: "You need to verify your email"})
        }
    };
    notLogin(req, res, next){
        if(req.session.isAuthenticated){
            next();
        }else{
            var status = "You need to login first"
            res.render('login', {status: status})
        }
    }
    isLogin (req, res, next){
        if(req.session.isAuthenticated){
            res.render('home', { auth: req.session.isAuthenticated})
        }else{
            next()   
        }
    }
}

module.exports = new Auth;