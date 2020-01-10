var Campgrounds = require("../models/campgrounds");
var Comment = require("../models/Comment");


var middlewareObj= {};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id , function (err, campground){
            if(err){
                res.redirect("back");;
            }else{
                if(campground.author.id.equals(req.user._id)){
                    return next();
                }else{
                    res.redirect("back");
                }               
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function (err, Comment){
            if(err){
                res.redirect("back");;
            }else{
                if(Comment.author.id.equals(req.user._id)){
                    return next();
                }else{
                    res.redirect("back");
                }               
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports= middlewareObj;