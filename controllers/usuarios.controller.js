const { response, request } = require("express");
const jwt = require('jsonwebtoken');
const Usuario = require("../modules/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'asc';

    const skip = (page - 1) * perPage;
    
    const sortOption = { [sortBy]: sortOrder };
    
    const usuarios = await Usuario.find({ deleted: false })
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.json({
      usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener los usuarios',
    });
  }
};


const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { nombre, correo, password, rol } = req.body;

  try {
    // Verificar si el usuario con el ID proporcionado existe
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    // Actualiza los campos del usuario con los valores proporcionados
    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.rol = rol;

    // Encripta y actualiza la contraseña
    if (password) {
      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync(password, salt);
    }

    // Guarda los cambios en la base de datos
    await usuario.save();

    res.json({
      msg: "Usuario actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al actualizar el usuario",
    });
  }
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar contraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  //guardar en db
  await usuario.save();

  res.status(201).json({
    usuario,
  });

  console.log(usuario);
};

const loginUsuario = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Busca el usuario por correo
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario no encontrado. Verifica tus credenciales.',
      });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Contraseña incorrecta. Verifica tus credenciales.',
      });
    }

    // Si el inicio de sesión es exitoso, genera un token JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // Clave secreta para firmar el token
    const privateKey = 'clave';

    jwt.sign(payload, privateKey, { expiresIn: '1h' }, (error, token) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          msg: 'Error al generar el token JWT',
        });
      }

      // Devuelve el token JWT en la respuesta
      res.json({
        msg: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuario.id,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error en el inicio de sesión',
    });
  }
};

const usuariosDelete = async (req, res = response) => {
  const id = req.params.id;
  const deletedBy = req.usuario.id; // Obtén el ID del usuario que realiza la eliminación

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    usuario.deleted = true;
    usuario.deletedAt = new Date();
    usuario.deletedBy = deletedBy;

    await usuario.save();

    res.json({
      msg: "Usuario eliminado lógicamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al eliminar lógicamente el usuario",
    });
  }
};


const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API",
  });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
  usuariosPost,
  loginUsuario,
};
