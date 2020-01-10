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

app.get("/",function(req, res ){
    res.render("landing");
})


app.get("/campgrounds",function( req, res){
    console.log(req.user);
    Campgrounds.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{ campgrounds: allCampgrounds});
        }
    })
    
})


app.post("/campgrounds",function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var NewCampground={name : name , image: image , description : description};
    Campgrounds.create( NewCampground, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            console.log("New Campground Added to the database")
        }
    })
    res.redirect("/campgrounds");
})


app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new")
})


app.get("/campgrounds/:id",function(req, res){
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show",{campgrounds : foundcamp});      
        }
    })
})

//----------------------------------------------

// New comment route !! Nested route !

app.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req, res){
     Campgrounds.findById(req.params.id,function(err, campground){
         if(err){
            console.log(err)
        }else{
            res.render("comments/new", {campground : campground})
        }
     })
    
})

app.post("/campgrounds/:id/comments",isLoggedIn ,function(req,res){
   
    Campgrounds.findById(req.params.id,function(err,campground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      }else{
        Comment.create(req.body.comment,function(err,comment){
            if(err){
                console.log(err)
            }else{
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);                
            }
        })
      }
    })
     
})

//--------------------------------
// Auth Routes

// Sign up Route
app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req,res){
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

app.get("/login",function(req, res){
    res.render("login");
})

app.post("/login",passport.authenticate("local", {
    successRedirect : "/campgrounds",
    failureRedirect: "/login"
}) ,function(req,res){
  
})

//logout route

app.get("/logout",function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(4000,function(){
   console.log("serving on port 4000")
});