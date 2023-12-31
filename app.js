//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "The emergence of digital content consumption has led to a growing demand for versatile and efficient blog platforms. Our project seeks to address this demand by delivering a web application that offers both authors and readers an exceptional experience. With user registration and authentication, content management, comment systems, and more, this website aims to cater to a diverse audience.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
//const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/posts/delete/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOneAndDelete({_id: requestedPostId} ) 
    .then(
      res.redirect("/")
    )
    .catch( err => {
      console.log(err);
    });
  
   
  
  });


app.get("/", function(req, res){

  Post.find({}).then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
    })
  .catch(err => {
    console.log(err);
  });
  
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch(err => {
    console.log(err);
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId} ) .then(post => {
    res.render("post", {
      title: post.title,
      content: post.content
  })
  .catch( err => {
    console.log(err);
  });

 

});
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});


 



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
