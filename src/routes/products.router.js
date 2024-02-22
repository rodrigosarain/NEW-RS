const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort =
      req.query.sort === "asc"
        ? "asc"
        : req.query.sort === "desc"
        ? "desc"
        : null;
    const query = req.query.query || null;

    let productos = await productManager.getProducts();

    // Aplicar el filtro según el query
    if (query) {
      productos = productos.filter((producto) => producto.category === query);
    }

    // Ordenar los productos si se proporciona sort
    if (sort) {
      productos.sort((a, b) => {
        if (sort === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    // Calcular el índice de inicio y final según la página y el límite
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Obtener los productos de la página actual
    const pageProductos = productos.slice(startIndex, endIndex);

    const totalPages = Math.ceil(productos.length / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    const prevLink = hasPrevPage
      ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    res.json({
      status: "success",
      payload: pageProductos,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productManager.getProductById(id);
    if (!producto) {
      return res.json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.post("/", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({
      message: "Producto agregado exitosamente",
    });
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(id, productoActualizado);
    res.json({
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
