var express = require("express");
var router =  express.Router({mergeParams : true});
var Campgrounds = require("../models/campgrounds");
var Comment     = require("../models/Comment");





router.get("/new",isLoggedIn ,function(req, res){
    Campgrounds.findById(req.params.id,function(err, campground){
        if(err){
           console.log(err)
       }else{
           res.render("comments/new", {campground : campground})
       }
    })
   
})


router.post("/",isLoggedIn ,function(req,res){
  
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

// Middleware 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports= router;