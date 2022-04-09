
class Auth{
    notLogin (req, res, next) {
        if (req.session.isAuthenticated) {
            next();
        } else {       
        var status = 'You need to login first'
        res.render("login",{status: status});
    }
    };
    isLogin (req, res, next){
        if(req.session.isAuthenticated){
            res.render('home', { auth: req.session.isAuthenticated})
        }else{
            next()   
        }
    }
}

module.exports = new Auth;