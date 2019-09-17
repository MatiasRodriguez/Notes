const express = require("express");
const router = express.Router();
const User = require('../models/Users');
const passport = require('passport');

router.get ('/users/signin', (req,res)=>{
    res.render("users/signin")
});
router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash:true
}))

router.get("/users/signup" , (req,res)=>{
    res.render("users/signup")
});

router.post("/users/signup", async (req,res)=>{
    const {name,email,password,confirm_password} = req.body;
    const errors=[];
    if(name.length<=0){
        errors.push({text:"porfavor ingrese un nombre"});
    }
    if(password!=confirm_password){
        errors.push({text:"las contrasenas no considen"});
    }
    if(password.length <4){
        errors.push({text:"la contrasena tiene menos de cuatro caracteres"})
    }
    if(errors.length > 0 ){
        res.render("../views/users/signup",{
            errors,name,email,password,confirm_password
        });
    }else{
        
        const emailUser= await User.findOne({email: email});
        if(emailUser){
            req.flash('sucess_msg','el email se encuentra en uso');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password });
        newUser.password= await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','te registrate correctamente');
        res.redirect('/users/signin');
    }

router.get('/users/logout', (req,res)=>{
     req.logout();
     req.flash('success_msg', 'You are logged out now.');
     res.redirect('/users/signin');
})
    
});
module.exports = router;