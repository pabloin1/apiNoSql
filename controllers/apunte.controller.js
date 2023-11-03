const Apunte = require("../modules/apunte");

// Controlador para obtener todos los apuntes con paginación y ordenamiento
const obtenerApuntes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'asc';

    const skip = (page - 1) * perPage;

    const sortOption = { [sortBy]: sortOrder };

    const apuntes = await Apunte.find({ deleted: false })
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      apuntes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener los apuntes",
    });
  }
};

// Controlador para crear un nuevo apunte 
const crearApunte = async (req, res) => {
  const { titulo, contenido } = req.body;

  try {
    const nuevoApunte = new Apunte({
      titulo,
      contenido,
      createdBy: req.usuario.id, // Establece el usuario creador
    });

    await nuevoApunte.save();

    res.status(201).json({
      apunte: nuevoApunte,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al crear el apunte",
    });
  }
};

// Controlador para actualizar un apunte 
const actualizarApunte = async (req, res) => {
  const id = req.params.id;
  const { titulo, contenido } = req.body;

  try {
    const apunte = await Apunte.findById(id);

    if (!apunte) {
      return res.status(404).json({
        msg: "Apunte no encontrado",
      });
    }

    apunte.titulo = titulo;
    apunte.contenido = contenido;
    apunte.updatedAt = new Date();
    apunte.updatedBy = req.usuario.id; // Establece el usuario que realiza la actualización

    await apunte.save();

    res.status(200).json({
      msg: "Apunte actualizado correctamente",
      apunte,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el apunte",
    });
  }
};

// Controlador para eliminar lógicamente un apunte
const eliminarApunteLogico = async (req, res) => {
    const id = req.params.id;
  
    try {
      const apunte = await Apunte.findById(id);
  
      if (!apunte) {
        return res.status(404).json({
          msg: "Apunte no encontrado",
        });
      }
  
      // Eliminación lógica
      apunte.deleted = true;
      apunte.deletedAt = new Date();
      apunte.deletedBy = req.usuario.id; // Establece el usuario que realiza la eliminación lógica
  
      await apunte.save();
  
      return res.status(200).json({
        msg: "Apunte eliminado lógicamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Error al eliminar el apunte lógicamente",
      });
    }
  };
  
  // Controlador para eliminar físicamente un apunte
  const eliminarApunteFisico = async (req, res) => {
    const id = req.params.id;
  
    try {
      const apunte = await Apunte.findById(id);
  
      if (!apunte) {
        return res.status(404).json({
          msg: "Apunte no encontrado",
        });
      }
  
      // Eliminación física (borrado permanente)
      await Apunte.deleteOne({ _id: id });
  
      return res.status(200).json({
        msg: "Apunte eliminado físicamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Error al eliminar el apunte físicamente",
      });
    }
  };
  

module.exports = {
  obtenerApuntes,
  crearApunte,
  actualizarApunte,
  eliminarApunte:eliminarApunteLogico,
};
