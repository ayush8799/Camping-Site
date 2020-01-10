var express= require("express");
var router= express.Router();
var Campgrounds= require("../models/campgrounds");
var middleware = require("../middleware");


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


router.post("/", middleware.isLoggedIn, function(req, res){
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


router.get("/new", middleware.isLoggedIn, function(req, res){
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

// Edit Route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){   
    Campgrounds.findById(req.params.id , function (err, campground){            
                res.render("campgrounds/edit", { campground : campground })
    }) 
})

// Update Route

router.put("/:id",middleware.checkCampgroundOwnership ,function(req,res){
    Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ updatedCampground._id );
        }
    })
})

// delete campground

router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campgrounds.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})


module.exports= router;