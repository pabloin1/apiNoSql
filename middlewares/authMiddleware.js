const jwt = require('jsonwebtoken');
const secretKey = 'clave';

const authMiddleware = (req, res, next) => {
  const token = req.header('x-token'); // Puedes ajustar el encabezado según tu configuración

  if (!token) {
    return res.status(401).json({ msg: 'Token no válido, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded.usuario; // Establece req.usuario con los datos del usuario
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

module.exports = {
    authMiddleware
};
