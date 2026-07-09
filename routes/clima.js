const express = require("express");
const router = express.Router();

const { param, validationResult } = require("express-validator");

const climaService = require("../services/climaService");

function validar(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  next();
}

// GET /api/clima/ sin ciudad

router.get("/", (req, res) => {

    res.status(400).json({

        errores: [
            {
                msg: "La ciudad es obligatoria"
            }
        ]

    });

});

// GET /api/clima/:ciudad

router.get(
  "/:ciudad",

  param("ciudad")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("La ciudad contiene caracteres inválidos"),

  validar,

  async (req, res) => {
    try {
      const clima = await climaService.obtenerClima(req.params.ciudad);

      res.status(200).json(clima);
    } catch (error) {
      res.status(502).json({
        error: "Error al consultar el servicio externo del clima",
      });
    }
  },
);

module.exports = router;
