var express= require("express");
var router= express.Router();
var Campgrounds= require("../models/campgrounds");

router.get("/",function( req, res){
    
    Campgrounds.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{ campgrounds: allCampgrounds});
        }
    })
    
})


router.post("/", isLoggedIn, function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var NewCampground={name : name , image: image , description : description , author : author};
    Campgrounds.create( NewCampground, function(err, allCampgrounds){
        if(err){    
            console.log(err);
        }
        else{
            console.log("New Campground Added to the database");
        }
    })
    res.redirect("/campgrounds");
})


router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new")
})


router.get("/:id",function(req, res){
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show",{campgrounds : foundcamp});      
        }
    })
})

// Middleware 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports= router;