const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.crearCart();
    res.json(newCart);
    res.json({
      message: "carrito creado",
    });
  } catch (error) {
    console.error("Error al crear un carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCartById(cartId);
    if (!carrito) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    res.json(carrito.products);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    await cartManager.removeProductFromCart(cartId, productId);
    res.json({ message: "Producto eliminado del carrito correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const newProducts = req.body.products;

  try {
    const updatedCart = await cartManager.updateCart(cartId, newProducts);
    res.json(updatedCart.products);
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
    res.json(updatedCart.products);
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await cartManager.removeAllProductsFromCart(cartId);

    res.json({
      message:
        "Todos los productos han sido eliminados del carrito correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar todos los productos del carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
