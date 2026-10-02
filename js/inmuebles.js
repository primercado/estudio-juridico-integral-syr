/* =====================================================================
   INMUEBLES EN VENTA — Estudio Jurídico Integral SyR & Asociados
   ---------------------------------------------------------------------
   Para publicar un inmueble, copiá el modelo de abajo dentro de la lista
   INMUEBLES (entre los corchetes), quitale las dos barras // del comienzo
   de cada línea y completá los datos. Los más nuevos van arriba.

   - Lo que no sepas, borralo: la ficha muestra solo los datos cargados.
   - "codigo" tiene que ser único: es el número de ficha que el cliente
     menciona al consultar y forma el enlace para compartir
     (por ejemplo: .../#inmueble-001).
   - Las fotos van en assets/inmuebles/<codigo>/ (por ejemplo
     assets/inmuebles/001/1.jpg). La primera es la portada.
   - Si cargás "frente" y "fondo" (en metros), la ficha dibuja el croquis
     del lote. Si no hay fotos, el croquis ocupa el lugar de la portada.
   - estado: "disponible", "reservado" o "vendido".

   Para ver la sección con inmuebles de muestra, abrí index.html?ejemplo
   ===================================================================== */

window.INMUEBLES_CONTACTO = {
  whatsapp: "5493644566732",   // número que recibe las consultas por WhatsApp
  telefono: "543644566732"     // número del botón "Llamar"
};

window.INMUEBLES = [

  // {
  //   codigo: "001",
  //   tipo: "Casa",                  // Casa, Terreno, Departamento, Local, Campo, Galpón...
  //   titulo: "Casa de 3 dormitorios con patio y cochera",
  //   localidad: "Juan José Castelli",
  //   ubicacion: "Zona centro, a tres cuadras de la plaza",
  //   calle: "Calle Sarmiento",      // nombre de la calle del frente, para el croquis
  //   precio: "USD 48.000",          // o "$ 30.000.000", o "Consultar"
  //   estado: "disponible",
  //   terreno: 300,                  // superficie del terreno en m²
  //   hectareas: 0,                  // para campos: superficie en hectáreas
  //   cubierta: 135,                 // superficie cubierta en m²
  //   frente: 10,                    // metros
  //   fondo: 30,                     // metros
  //   dormitorios: 3,
  //   banos: 2,
  //   documentacion: ["Escritura", "Plano de mensura aprobado"],
  //   caracteristicas: ["Cochera techada", "Patio con parrilla", "Agua, luz y cloacas"],
  //   masDatos: { "Antigüedad": "15 años" },
  //   descripcion: "Texto libre que se lee en la ficha completa.",
  //   fotos: ["assets/inmuebles/001/1.jpg", "assets/inmuebles/001/2.jpg"],
  //   mapa: "https://maps.app.goo.gl/..."   // enlace de Google Maps (opcional)
  // },

];
