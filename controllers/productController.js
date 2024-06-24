const asyncHandler = require('express-async-handler')
const Products = require('../models/productModel') 
const Users = require('../models/userModel') 
const slugify = require('slugify')
const { json } = require('express')

//Get all Products - All Users can access
getProducts = asyncHandler(async(req,res)=>{ 
    // const products = await Products.find(req.query)
    // if (!products) throw new Error('No Products Present')
    // res.status(200).json(products)
    const qNew = req.query.new
    const qCategory = req.query.category 
    let products
    if(qNew){
        products = await Products.find().sort({createdAt:-1}).limit(2)
    }else if(qCategory){
        products = await Products.find({
            categories: {
                $in: [qCategory]
            }
            })
        }
    else{
        products = await Products.find()
    }
    
    res.status(200).json(products)
})

//Get one Product - All Users can access
getProduct = asyncHandler(async(req,res)=>{
    
    const productAvailable = await Products.findById(req.params.id)
    if (!productAvailable){
        res.status(400)
        throw new Error('No Product Available')
    }
    console.log(productAvailable)
    res.status(200).json(productAvailable)
})



//Create a Product - Only Admin can access
createProduct = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    if (!userId){
        res.status(400)
        throw new Error('No such user Found')
    }
    const { title, price } = req.body
    if (!title | !price){
        throw new Error('All are mandatory')
    }
    if (title) req.body.slug = slugify(title)
    
    const mergedData = {
        ...req.body,
        listedBy: userId
    }
    const product = await Products.create(mergedData)
    res.status(201).json(product)
    

})
//Update a Product - Only Admin can access
updateProduct = asyncHandler(async(req,res)=>{
    if (req.body.title) req.body.slug = slugify(req.body.title)
    const productAvailable = await Products.findById(req.params.id)
    if (!productAvailable){
        res.status(400)
        throw new Error('No Product Available')
    }
    const productUpdated = await Products.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(productUpdated)
    
})

//Delete a Product - Only Admin can access
deleteProduct = asyncHandler(async(req,res)=>{
    const productAvailable = await Products.findById(req.params.id)
    if (!productAvailable){
        res.status(400)
        throw new Error('No Product Available')
    }
    await Products.findByIdAndDelete(req.params.id)
    res.status(200).json(productAvailable)
})




module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct}