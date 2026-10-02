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
   - "encuadre" elige qué parte de la portada se ve en la tarjeta:
     "arriba", "centro" o "abajo" (por defecto, centro). En la ficha
     completa la foto se ve siempre entera.
   - estado: "disponible", "reservado" o "vendido".

   Para ver la sección con inmuebles de muestra, abrí index.html?ejemplo
   ===================================================================== */

window.INMUEBLES_CONTACTO = {
  whatsapp: "5493644566732",   // número que recibe las consultas por WhatsApp
  telefono: "543644566732"     // número del botón "Llamar"
};

window.INMUEBLES = [

  {
    codigo: "001",
    tipo: "Casa",
    titulo: "Casa con garage a 2 cuadras del centro",
    localidad: "Juan José Castelli",
    ubicacion: "A 2 cuadras del centro",
    precio: "Consultar",
    estado: "disponible",
    terreno: 400,
    frente: 8,
    fondo: 50,
    dormitorios: 2,
    banos: 1,
    caracteristicas: ["Living-comedor", "Cocina independiente", "Garage", "Baño (sin grifería)", "Terreno amplio al fondo"],
    descripcion: "Casa amplia y con muchísimo potencial, ideal para tu futura vivienda o para un proyecto comercial. Tiene dos habitaciones, living-comedor, cocina independiente, garage y baño (sin grifería), sobre un terreno de 8 × 50 m (400 m²).",
    fotos: ["assets/inmuebles/001/1.jpg"],
    encuadre: "arriba"
  },

  {
    codigo: "002",
    tipo: "Campo",
    titulo: "Campo ganadero de 1.460 hectáreas",
    localidad: "Departamento General Güemes, Chaco",
    ubicacion: "A 30 km de Pampa del Indio, a 50 km de Juan José Castelli y a 50 km de Tres Isletas",
    precio: "Consultar",
    estado: "disponible",
    hectareas: 1460,
    caracteristicas: [
      "Campo totalmente ganadero, apto para la actividad que se desee",
      "Montes, esteros y pasturas naturales",
      "Corral completo, con mangas y alojamientos",
      "Alambrado perimetral completo: 7 km de alambre totalmente nuevo",
      "Campo dividido en piquetes",
      "Casa",
      "Perforaciones",
      "Luz eléctrica e inmenso caudal de agua a pocos metros",
      "Laguna La Victoria dentro del campo, de 10 ha aprox."
    ],
    masDatos: { "Parcelas": "2" },
    descripcion: "Una propiedad con excelentes condiciones para la producción ganadera y una gran variedad de recursos naturales: montes, esteros y pasturas naturales. Cuenta con corral completo, alambrado perimetral nuevo, casa, perforaciones, luz eléctrica y agua en abundancia.",
    fotos: ["assets/inmuebles/002/1.jpg"],
    encuadre: "arriba"
  },

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
