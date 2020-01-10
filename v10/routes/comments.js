var express = require("express");
var router =  express.Router({mergeParams : true});
var Campgrounds = require("../models/campgrounds");
var Comment     = require("../models/Comment");
var middleware = require("../middleware");




// comment Get Route ... To get the New Comment Form !! 
router.get("/new",middleware.isLoggedIn ,function(req, res){
    Campgrounds.findById(req.params.id,function(err, campground){
        if(err){
           console.log(err)
       }else{
           res.render("comments/new", {campground : campground})
       }
    })
   
})

// comment Post Route
router.post("/",middleware.isLoggedIn ,function(req,res){
  
   Campgrounds.findById(req.params.id,function(err,campground){
     if(err){
       console.log(err);
       res.redirect("/campgrounds");
     }else{
       Comment.create(req.body.comment,function(err,comment){
           if(err){
               console.log(err)
           }else{
               
               comment.author.id        = req.user._id;
               comment.author.username  = req.user.username; 

               //console.log("New Comments username will be : " + req.user.username);
               comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);                
           }
       })
     }
   })
    
})

// edit Comment Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    // console.log(req.params.id)
    // console.log(req.params.comment_id)
    Comment.findById(req.params.comment_id , function(err,foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id , comment : foundComment});
        }
    })
})

// update Comment Route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// delete Comment Route 
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
})



module.exports= router;