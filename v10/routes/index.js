var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");


// Root Route
//-----------------
router.get("/",function(req, res ){
    res.render("landing");
})



//--------------------------------
// Auth Routes

// Sign up Route
router.get("/register", function(req, res){
    res.render("register");
})

router.post("/register", function(req,res){
    User.register(new User({username : req.body.username}), req.body.password , function(err, user){
        if(err){
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            })
        }
    })
})

// Log in Route

router.get("/login",function(req, res){
    res.render("login");
})

router.post("/login",passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect: "/login"
}) ,function(req,res){
  
})

//logout route

router.get("/logout",function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports= router;
