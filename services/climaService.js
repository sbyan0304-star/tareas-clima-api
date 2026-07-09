const axios = require("axios");

async function obtenerClima(ciudad) {
  try {
    const respuesta = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",

      {
        params: {
          q: ciudad,

          appid: process.env.CLIMA_API_KEY,

          units: "metric",

          lang: "es",
        },
      },
    );

    return {
      ciudad: respuesta.data.name,

      temperatura: respuesta.data.main.temp,

      descripcion: respuesta.data.weather[0].description,

      humedad: respuesta.data.main.humidity,
    };
  } catch (error) {
    throw new Error("Servicio climático no disponible");
  }
}

module.exports = {
  obtenerClima,
};
