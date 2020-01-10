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
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Welcome to YelpCamp "+ user.username)
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
    req.flash("success","Successfully logged Out");
    res.redirect("/campgrounds");
})



module.exports= router;
