require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/myWordDB", {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    
});
const User = mongoose.model("User",userSchema);
const wordsSchema =new mongoose.Schema({
    word: String,
    meaning: String
});
const Word = mongoose.model("Word",wordsSchema);

app.get("/",function(req,res){
    res.render("index");
});

app.get("/home",function(req,res){
    res.render("home");
});

app.get("/words",function(req,res){
   Word.find({},function(err,foundWords){
       res.render("words",{
           foundWords: foundWords
        });
   });
    
});

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/logout",function(req,res){
    res.redirect("/")
});

app.post("/",function(req,res){
    const signInUsername = req.body.username;
    const signInPassword = req.body.password;
    User.findOne({username: signInUsername},function(err,foundUser){
        if(foundUser){
            bcrypt.compare(signInPassword,foundUser.password , function(err, result) {
               if( result === true ){
                res.redirect("/home");
            } 
            });
            
        }else{
            res.send(err);
        }
    });

});
app.post("/words",function(req,res){
    
    const newWord = new Word({
        word: req.body.word,
        meaning: req.body.meaning
    });
   newWord.save();
   res.redirect("/words");
    
});
app.post("/register",function(req,res){
    
    const registeredUsername = req.body.username;
    const registeredPassword = req.body.password;
    bcrypt.hash(registeredPassword, saltRounds, function(err, hash) {
        const newUser = new User({
            username:registeredUsername,
            password:hash
        }) ;
        newUser.save(function(err){
            if(!err){
                res.redirect("/home");
            }else{
                res.send(err);
            }
        });   
    });

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("Server is running successfully.");
})