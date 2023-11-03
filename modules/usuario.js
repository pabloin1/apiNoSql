const { Schema, model } = require("mongoose");

const userSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido "],
  },
  correo: {
    type: String,
    required: [true, "El correo es requerido"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
  },
  etapas: {
    type: String,
  },
  can_estrellas: {
    type: Number,
  },
  nivel: {
    type: Number,
  },
  puntaje: {
    type: Number,
  },
  cuestionarios_compt: {
    type: Number,
  },
  lecciones_compt: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: String,
  },
});

module.exports = model("Usuario", userSchema);
