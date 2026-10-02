/* Inmuebles FICTICIOS para previsualizar la sección (index.html?ejemplo).
   No se muestran en el sitio normal. Los inmuebles reales van en js/inmuebles.js */

window.INMUEBLES_EJEMPLO = [
  {
    codigo: "001",
    tipo: "Casa",
    titulo: "Casa de 3 dormitorios con patio y cochera",
    localidad: "Juan José Castelli",
    ubicacion: "Zona centro",
    calle: "Calle de ejemplo",
    precio: "USD 48.000",
    estado: "disponible",
    terreno: 300,
    cubierta: 135,
    frente: 10,
    fondo: 30,
    dormitorios: 3,
    banos: 2,
    documentacion: ["Escritura", "Plano de mensura aprobado"],
    caracteristicas: ["Cochera techada", "Patio con parrilla", "Agua, luz y cloacas"],
    masDatos: { "Antigüedad": "15 años" },
    descripcion: "Casa de material en lote propio. Living comedor, cocina separada, tres dormitorios y dos baños. Patio al fondo con parrilla y espacio para pileta."
  },
  {
    codigo: "002",
    tipo: "Terreno",
    titulo: "Lote en esquina listo para construir",
    localidad: "Juan José Castelli",
    ubicacion: "Barrio residencial, con todos los servicios",
    calle: "Esquina",
    precio: "USD 15.000",
    estado: "disponible",
    frente: 12,
    fondo: 25,
    documentacion: ["Escritura", "Libre deuda municipal"],
    caracteristicas: ["Agua y luz en el frente", "Calle enripiada"]
  },
  {
    codigo: "003",
    tipo: "Campo",
    titulo: "Campo de 120 hectáreas apto agrícola-ganadero",
    localidad: "Juan José Castelli (zona rural)",
    ubicacion: "A 18 km de la ciudad por camino vecinal",
    calle: "Camino vecinal",
    precio: "Consultar",
    estado: "disponible",
    frente: 800,
    fondo: 1500,
    documentacion: ["Escritura", "Plano de mensura aprobado"],
    caracteristicas: ["Alambrado perimetral", "Represa", "Monte nativo en el fondo"]
  },
  {
    codigo: "004",
    tipo: "Local",
    titulo: "Local comercial sobre avenida",
    localidad: "Juan José Castelli",
    ubicacion: "Avenida principal, zona comercial",
    calle: "Avenida",
    precio: "$ 38.000.000",
    estado: "reservado",
    terreno: 108,
    cubierta: 60,
    frente: 6,
    fondo: 18,
    banos: 1,
    documentacion: ["Escritura"],
    caracteristicas: ["Vidriera al frente", "Depósito al fondo"]
  },
  {
    codigo: "005",
    tipo: "Terreno",
    titulo: "Terreno de 10 × 40 m",
    localidad: "Juan José Castelli",
    precio: "USD 11.000",
    estado: "vendido",
    frente: 10,
    fondo: 40,
    documentacion: ["Boleto de compraventa"]
  }
];
