// public/js/inmuebles.js está escrito para el navegador (asigna en window.*).
// En el Worker no existe window: lo apuntamos al ámbito global antes de importarlo.
globalThis.window = globalThis;
