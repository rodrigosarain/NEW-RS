const express = require("express");
const router = express.Router();

const ProductModel = require("../dao/models/products.model.js");

// Ruta para mostrar todos los productos
router.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find(); // console.log(products);
    res.render("products", { products });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para mostrar los detalles de un producto específico
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await ProductModel.findById(productId);
    // console.log("Producto:", product);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.render("product-details", { product });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
