require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const { body, validationResult } = require("express-validator");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================

app.use(express.json());

app.use(helmet());
// Helmet agrega cabeceras HTTP
// para reducir ataques como XSS,
// clickjacking y MIME sniffing.

app.use(morgan("dev"));

// ===============================
// RUTAS PROPIAS
// ===============================

const verificarToken = require('./middleware/auth');

const tareasRouter = require('./routes/tareas');
app.use('/api/tareas', verificarToken, tareasRouter);  // protegida

const climaRouter = require('./routes/clima');
app.use('/api/clima', verificarToken, climaRouter);    // protegida

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);           // pública: registro y login


// ===============================
// ENDPOINT SALUD
// ===============================

app.get("/api/salud", (req, res) => {
  res.json({
    status: "Servidor funcionando",
    seguridad: true,
  });
});

// ===============================
// ENDPOINT ECHO
// ===============================

app.post(
  "/api/echo",

  body("mensaje")
    .isString()
    .trim()
    .isLength({
      min: 1,
      max: 200,
    })
    .escape(),

  (req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }

    res.json({
      recibido: req.body.mensaje,
    });
  },
);

// ===============================
// RETO
// REGISTRO DE USUARIO
// ===============================

app.post(
  "/api/registro",

  [
    body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),

    body("correo").trim().isEmail().withMessage("Correo inválido"),
  ],

  (req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        errores: errores.array(),
      });
    }

    /*
    PRINCIPIO DE CODIFICACIÓN SEGURA:

    Nunca confiar en la entrada del usuario.

    La validación evita que datos
    incorrectos o maliciosos lleguen
    a la lógica del sistema.
    */

    res.json({
      mensaje: "Registro válido",

      usuario: req.body,
    });
  },
);



module.exports = app;
