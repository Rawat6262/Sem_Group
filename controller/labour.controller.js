let Labour = require('../models/labour.model')

exports.addlabour = async (req,res)=>{
try{
    let labour = await Labour.create({
        name:req.body.name,
        phone_number:req.body.phone_number,     
        address:req.body.address
    });
    res.status(201).json({
        message:"Labour added successfully",
        labour:labour
    });                        
}
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}
}

exports.getlabours = async (req,res)=>{ 
try{
    let labours = await Labour.find().populate('exhibition');
    res.status(200).json({  
        message:"Labours fetched successfully",
        labours:labours
    });
}
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}           
}

exports.getlabourbyid = async (req,res)=>{
try{
    let labour = await Labour.findById(req.params.id).populate('exhibition');   
    res.status(200).json({
        message:"Labour fetched successfully",
        labour:labour
    });
}
catch(err){
    res.status(500).json({
        message:"Internal Server Error",    
        error:err.message
    });
}
}
exports.updatelabour = async (req,res)=>{
try{
    let labour = await Labour.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json({
        message:"Labour updated successfully",
        labour:labour
    });
}   
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}
}

exports.deletelabour = async (req,res)=>{
try{
    let labour = await Labour.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message:"Labour deleted successfully",
        labour:labour
    });
}
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}       
}
exports.getlabourbyphone = async (req,res)=>{
try{
    let labour = await Labour.findOne({phone_number:req.params.phone_number}).populate('exhibition');   
    res.status(200).json({
        message:"Labour fetched successfully",
        labour:labour
    });
}   
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}
}
exports.getlabourbyphone = async (req,res)=>{
try{
    let labour = await Labour.findOne({phone_number:req.params.phone_number}).populate('exhibition');
    res.status(200).json({
        message:"Labour fetched successfully",
        labour:labour
    });
}   
catch(err){
    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    });
}
}

exports.getlabourbyphone = async (req,res)=>{
try{
    let labour = await Labour.findOne({phone_number:req.params.phone_number}).populate('exhibition');
    res.status(200).json({
        message:"Labour fetched successfully",
        labour:labour
    });
}
catch(err){
    res.status(500).json({
        message:"Internal Server Error",


        error:err.message
    });
}
}
