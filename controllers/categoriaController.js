const categoriaRepository = require('../repositories/categoriaRepository');

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await categoriaRepository.obtenerCategorias();
    res.json(categorias);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};
