var Campgrounds = require("../models/campgrounds");
var Comment = require("../models/Comment");


var middlewareObj= {};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id , function (err, campground){
            if(err){
                req.flash("error","Campground not found :(")
                res.redirect("back");;
            }else{
                if(campground.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error","You dont have permission to do that ! :| ")
                    res.redirect("back");
                }               
            }
        })
    }else{
        req.flash("error", "Please Login First ! ")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id , function (err, Comment){
            if(err){
                req.flash("error","Something went wrong ! :(")
                res.redirect("back");;
            }else{
                if(Comment.author.id.equals(req.user._id)){
                    return next();
                }else{
                    req.flash("error","You dont have permission to do that ! :| ")
                    res.redirect("back");
                }               
            }
        })
    }else{
        req.flash("error", "Please Login First ! ")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First !! ")
    res.redirect("/login");
}

module.exports= middlewareObj;