const libroHistorias = require("../modules/librosHistoria");

// Controlador para obtener todos los libros de vocabulario
const obtenerLibros = async (req, res) => {
  try {
    const libros = await libroHistorias.find({ deleted: false });
    res.status(200).json({
      libros,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener los libros de historias",
    });
  }
};

// Controlador para crear un nuevo libro de vocabulario
const crearLibro = async (req, res) => {
  const { titulo, contenido } = req.body;

  try {
    const nuevoLibro = new libroHistorias({
      titulo,
      contenido,
      createdBy: req.usuario.id, // Establece el usuario creador
    });

    await nuevoLibro.save();

    res.status(201).json({
      libro: nuevoLibro,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al crear el libro de historias",
    });
  }
};

// Controlador para actualizar un libro de vocabulario por su ID
const actualizarLibro = async (req, res) => {
  const id = req.params.id;
  const { titulo, contenido } = req.body;

  try {
    const libro = await libroHistorias.findById(id);

    if (!libro) {
      return res.status(404).json({
        msg: "Libro de historias no encontrado",
      });
    }

    libro.titulo = titulo;
    libro.contenido = contenido;
    libro.updatedAt = new Date();
    libro.updatedBy = req.usuario.id; // Establece el usuario que realiza la actualización

    await libro.save();

    res.status(200).json({
      msg: "Libro de historias actualizado correctamente",
      libro,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el libro de historias",
    });
  }
};

// Controlador para eliminar lógicamente un libro de historias por su ID
const eliminarLibroLog = async (req, res) => {
  const id = req.params.id;

  try {
    const libro = await libroHistorias.findById(id);

    if (!libro) {
      return res.status(404).json({
        msg: "Libro de historias no encontrado",
      });
    }

    libro.deleted = true;
    libro.deletedAt = new Date();
    libro.deletedBy = req.usuario.id; // Establece el usuario que realiza la eliminación

    await libro.save();

    res.status(200).json({
      msg: "Libro de historias eliminado lógicamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar lógicamente el libro de historias",
    });
  }
};

// Controlador para eliminar físicamente un libro de historias
const eliminarLibroFis = async (req, res) => {
  const id = req.params.id;

  try {
    const libro = await libroHistorias.findById(id);

    if (!libro) {
      return res.status(404).json({
        msg: "Libro de historias no encontrado",
      });
    }

    // Eliminación física (borrado permanente)
    await libro.deleteOne({ _id: id });

    return res.status(200).json({
      msg: "Libro de historias eliminado físicamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar el libro de historias",
    });
  }
};


module.exports = {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro:eliminarLibroLog,
};
