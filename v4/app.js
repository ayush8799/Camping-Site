var express = require("express");
var app = express();
var BodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campgrounds = require("./models/campgrounds");
var seedDB = require ("./seed");
var Comment = require ("./models/Comment")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(BodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDB();


app.get("/",function(req, res ){
    res.render("landing");
})


app.get("/campgrounds",function( req, res){
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
            res.render("campgrounds/show",{campgrounds : foundcamp });      
        }
    })
})

//----------------------------------------------

// New comment route !! Nested route !

app.get("/campgrounds/:id/comments/new",function(req, res){
     Campgrounds.findById(req.params.id,function(err, campground){
         if(err){
            console.log(err)
        }else{
            res.render("comments/new", {campground : campground})
        }
     })
    
})

app.post("/campgrounds/:id/comments",function(req,res){
   
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


app.listen(4000,function(){
   console.log("serving on port 4000")
});