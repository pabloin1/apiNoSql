const { Schema, model } = require("mongoose");

const libroHistoriaSchema = Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es requerido "],
  },
  contenido: {
    type: String,
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

module.exports = model("libroHistorias", libroHistoriaSchema);