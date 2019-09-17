const express = require("express");
const router = express.Router();
const {isAuthenticated}=require('../helpers/auth');

const Note = require('../models/Note')


router.get("/notas", (req,res)=>{
    res.send("notas de la bd")
});

router.get("/notas/add",isAuthenticated,(req,res)=>{
    res.render('notas/newNotes')
});

router.post("/notas/newNotes", async (req,res)=>{
   const {title,description} = req.body;
   const errors=[];
   if(!title){
       errors.push({text:'porfavor agregre un titulo'})
   }
   if(!description){
    errors.push({text:'porfavor agregre una descipcion'})
   }
   if(errors.length > 0){
    res.render('notas/newNotes',{
        errors,
        title,
        description
    })
   }else{
        const newNote = new Note({title , description});
        await newNote.save();
        req.flash('success_msg','nota agregrada correctamente');
        res.redirect('/notes');
   }
    console.log(req.body);

   
});

router.get("/notes" ,isAuthenticated, async(req,res)=>{
    const notas= await Note.find();
     res.render("../views/notas/allNotes" , {notas})
});

router.get("/notas/edit/:id", async(req,res)=>{
        const edit=  await Note.findById(req.params.id);
        res.render('../views/notas/editNotes', {edit})
});
router.put('/notas/editNotes/:id',async(req,res)=>{ 
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','nota editada correctamente');
    res.redirect('/notes')
});
router.delete('/notas/delete/:id', async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','nota eliminada correctamente');
    res.redirect('/notes')
    
});

module.exports = router;