import express from "express"

import mongoose from "mongoose";
import Product from "../models/product.model.js";

const router = express.Router();


router.post("/", async (req, res) => {
  const product = req.body; // user will send this data

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const newProduct = new Product(product)

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error, message);
    res.status(500).json({ success: false, message: "Sever Error" });
  }
})


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id", id);


  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error in Delete product:", error, message);
    res.status(404).json({ success: false, message: "Product not found" });
  }
})

router.get("/", async (req, res) => {
  try {
    const product = await Product.find({}); // this is get all
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    console.error("Error in fetching product:", error, message);
    res.status(500).json({ success: false, message: "Sever Error" });
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Product Id" });
  }


  try {
    const updateProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    res.status(200).json({ success: true, data: updateProduct })
  } catch (error) {
    console.error("Error in fetching product:", error, message);
    res.status(500).json({ success: false, message: "Sever Error" });
  }
})


export default router;