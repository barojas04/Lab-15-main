const { z } = require('zod');

const albumSchema = z.object({
  titulo: z.string({
    required_error: "El título es requerido",
    invalid_type_error: "El título debe ser una cadena de texto",
  }).min(1, "El título no puede estar vacío"),
  artista: z.string({
    required_error: "El artista es requerido",
  }).min(1, "El artista no puede estar vacío"),
  genero: z.string({
    required_error: "El género es requerido",
  }).min(1, "El género no puede estar vacío"),
  anio: z.number({
    required_error: "El año es requerido",
    invalid_type_error: "El año debe ser un número",
  }).int().positive("El año debe ser positivo"),
  sello: z.string({
    required_error: "El sello discográfico es requerido",
  }).min(1, "El sello no puede estar vacío"),
  pistas: z.number({
    required_error: "La cantidad de pistas es requerida",
    invalid_type_error: "La cantidad de pistas debe ser un número",
  }).int().positive("La cantidad de pistas debe ser positiva"),
  imagen: z.string({
    required_error: "La imagen es requerida",
  }).min(1, "La imagen no puede estar vacía"),
  resumen: z.string({
    required_error: "El resumen es requerido",
  }).min(1, "El resumen no puede estar vacío"),
  descripcion: z.string({
    required_error: "La descripción es requerida",
  }).min(1, "La descripción no puede estar vacía")
});

module.exports = albumSchema;
