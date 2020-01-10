var express = require("express");
var app = express();
var BodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var mongoose = require("mongoose");
var Campgrounds = require("./models/campgrounds");
var seedDB = require ("./seed");
var Comment = require ("./models/Comment")
var User = require("./models/user");

var commentRoute= require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");
var indexRoute=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(BodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


//  passport authentication 

app.use(require("express-session")({
    secret : "Once upon a time in Mumbai dubara",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    next();
})

app.use(indexRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);



app.listen(4000,function(){
   console.log("serving on port 4000")
});