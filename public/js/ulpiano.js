// Ulpiano: asistente virtual del estudio.
// Los botones de preguntas frecuentes responden acá mismo, sin IA.
// Lo que la persona escribe se responde con IA en /api/ulpiano (worker/index.js).
(function(){
  var WA_NUMERO = '5493644566732';
  var CONTACTO = '+54 9 364 456-6732';
  var API = '/api/ulpiano';
  var MAX_LARGO = 500;
  var MAX_PREGUNTAS = 12;

  // Ulpiano: jurista romano, con corona de laurel y toga, en los colores del estudio
  var AVATAR = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
    '<circle cx="32" cy="32" r="32" fill="#0c0b09"/>' +
    '<path d="M12 56c3.5-7.5 10.5-11.5 20-11.5s16.5 4 20 11.5A32 32 0 0 1 12 56z" fill="#f4efe2"/>' +
    '<path d="M20.5 47.6c6.6 2.6 12.6 7.2 17 13.4l-5.3 2.8c-3.9-5.5-8.9-9.4-14.6-11.6z" fill="#b8933f"/>' +
    '<path d="M27.4 39.5h9.2v6.2c0 2-2 3.2-4.6 3.2s-4.6-1.2-4.6-3.2z" fill="#d6a97e"/>' +
    '<ellipse cx="32" cy="29.5" rx="11" ry="12.6" fill="#ecc8a0"/>' +
    '<path d="M21.1 31c.6 8.6 5 13.6 10.9 13.6s10.3-5 10.9-13.6c-1.6 2.6-3.8 3.9-6 4.3-1.4-1-3-1.5-4.9-1.5s-3.5.5-4.9 1.5c-2.2-.4-4.4-1.7-6-4.3z" fill="#5b4a30"/>' +
    '<path d="M28.9 38.4q3.1 2.1 6.2 0" fill="none" stroke="#f4efe2" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M31.5 28.8q-.9 3.4.3 4q1 .4 1.6-.3" fill="none" stroke="#c4936a" stroke-width="1.1" stroke-linecap="round"/>' +
    '<path d="M20.6 28.5c-.8-8.9 4.4-14.6 11.4-14.6s12.2 5.7 11.4 14.6c-.9-1.9-1.9-3.4-3.1-4.6-.6 1.2-1.6 1.6-2.6 1.4-2-1.8-3.7-2.8-5.7-2.8s-3.7 1-5.7 2.8c-1 .2-2-.2-2.6-1.4-1.2 1.2-2.2 2.7-3.1 4.6z" fill="#5b4a30"/>' +
    '<circle cx="27.6" cy="28.4" r="1.6" fill="#1c1912"/><circle cx="36.4" cy="28.4" r="1.6" fill="#1c1912"/>' +
    '<path d="M25.2 25.6q2.4-1.4 4.8 0M34 25.6q2.4-1.4 4.8 0" fill="none" stroke="#3d311f" stroke-width="1.3" stroke-linecap="round"/>' +
    '<g fill="#e0b968">' +
    '<ellipse cx="20.2" cy="25.2" rx="3.1" ry="1.35" transform="rotate(-72 20.2 25.2)"/>' +
    '<ellipse cx="21.1" cy="20.6" rx="3.1" ry="1.35" transform="rotate(-52 21.1 20.6)"/>' +
    '<ellipse cx="23.9" cy="16.8" rx="3.1" ry="1.35" transform="rotate(-32 23.9 16.8)"/>' +
    '<ellipse cx="27.9" cy="14.4" rx="3.1" ry="1.35" transform="rotate(-12 27.9 14.4)"/>' +
    '<ellipse cx="43.8" cy="25.2" rx="3.1" ry="1.35" transform="rotate(72 43.8 25.2)"/>' +
    '<ellipse cx="42.9" cy="20.6" rx="3.1" ry="1.35" transform="rotate(52 42.9 20.6)"/>' +
    '<ellipse cx="40.1" cy="16.8" rx="3.1" ry="1.35" transform="rotate(32 40.1 16.8)"/>' +
    '<ellipse cx="36.1" cy="14.4" rx="3.1" ry="1.35" transform="rotate(12 36.1 14.4)"/>' +
    '</g>' +
    '<circle cx="32" cy="32" r="31" fill="none" stroke="#b8933f" stroke-width="2"/>' +
  '</svg>';

  var RAPIDAS = [
    {id: 'ubicacion', pregunta: 'Dirección y horarios', texto: 'Estamos en Dr. H. Vázquez N.º 665, Juan José Castelli (Chaco). Atendemos con turno previo y tenemos guardia de urgencias las 24 horas. También podemos coordinar la consulta por teléfono, WhatsApp o videollamada.'},
    {id: 'turno', pregunta: 'Cómo pido un turno', texto: 'Escribinos por WhatsApp al ' + CONTACTO + ' o mandá un correo a juridicointegralsyr@gmail.com y coordinamos día y horario. Para la consulta, traé tu DNI y la documentación relacionada con tu caso.', whatsapp: true},
    {id: 'areas', pregunta: 'Qué casos atienden', texto: 'Atendemos causas penales, civiles y comerciales, derecho administrativo, laboral y de familia, y asesoramiento inmobiliario. Contame en pocas palabras qué tema te preocupa y te oriento.'},
    {id: 'inmuebles', pregunta: 'Inmuebles en venta'},
    {id: 'urgencia', pregunta: 'Tengo una urgencia', texto: 'Si es una urgencia, comunicate ya mismo: tenemos guardia las 24 horas al ' + CONTACTO + '. Podés llamar o escribir por WhatsApp.', whatsapp: true, llamar: true}
  ];

  var historial = [];      // {rol: 'usuario'|'ulpiano', texto}
  var preguntasIA = 0;
  var ultimaConsulta = '';
  var esperando = false;

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function inmuebles(){
    return (window.INMUEBLES || []).filter(function(i){ return i && i.titulo; });
  }
  function codigos(){
    var c = {};
    inmuebles().forEach(function(i){ c[String(i.codigo)] = true; });
    return c;
  }
  function waLink(){
    var msg = ultimaConsulta
      ? 'Hola, vengo del asistente Ulpiano de la página. Mi consulta: ' + ultimaConsulta.slice(0, 300)
      : 'Hola, vengo del asistente Ulpiano de la página y quisiera hacer una consulta.';
    return 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(msg);
  }
  // texto plano -> HTML seguro, con "ficha 001" convertido en enlace a la ficha
  function formatear(texto){
    var hay = codigos();
    return esc(texto).replace(/\n/g, '<br>').replace(/\b(ficha\s*(?:n\.?\s*º?\s*)?)(\d{3})\b/gi, function(todo, pre, cod){
      return hay[cod] ? '<a href="#inmueble-' + cod + '" class="ulp-ficha">' + todo + '</a>' : todo;
    });
  }

  // ---------- DOM ----------
  var lanzador = document.createElement('button');
  lanzador.type = 'button';
  lanzador.className = 'ulp-lanzador';
  lanzador.setAttribute('aria-label', 'Abrir el chat con Ulpiano, el asistente virtual');
  lanzador.setAttribute('aria-expanded', 'false');
  lanzador.setAttribute('aria-controls', 'ulpPanel');
  lanzador.innerHTML = AVATAR;

  var nube = document.createElement('div');
  nube.className = 'ulp-nube';
  nube.hidden = true;
  nube.innerHTML = '<button type="button" class="ulp-nube-abrir">¿Te ayudo? Soy <b>Ulpiano</b>, el asistente del estudio.</button>' +
    '<button type="button" class="ulp-nube-cerrar" aria-label="Ocultar mensaje">×</button>';

  var panel = document.createElement('section');
  panel.className = 'ulp-panel';
  panel.id = 'ulpPanel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'ulpTitulo');
  panel.innerHTML =
    '<header class="ulp-cab">' +
      '<span class="ulp-av">' + AVATAR + '</span>' +
      '<div><b id="ulpTitulo">Ulpiano</b><small>Asistente virtual del estudio, con IA</small></div>' +
      '<button type="button" class="ulp-cerrar" aria-label="Cerrar el chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '</header>' +
    '<div class="ulp-log" role="log" aria-live="polite"></div>' +
    '<form class="ulp-form">' +
      '<label class="sr-only" for="ulpTexto">Escribí tu consulta</label>' +
      '<input id="ulpTexto" type="text" maxlength="' + MAX_LARGO + '" autocomplete="off" placeholder="Escribí tu consulta…">' +
      '<button type="submit" class="ulp-enviar" aria-label="Enviar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6"/></svg></button>' +
    '</form>' +
    '<div class="ulp-pie">' +
      '<a class="ulp-wa ulp-wa-pie" target="_blank" rel="noopener">Hablar con un abogado por WhatsApp</a>' +
      '<p>Ulpiano usa inteligencia artificial y puede equivocarse: orienta, pero no reemplaza a un abogado. No compartas datos personales ni detalles sensibles por acá.</p>' +
    '</div>';

  document.body.appendChild(nube);
  document.body.appendChild(panel);
  document.body.appendChild(lanzador);

  var log = panel.querySelector('.ulp-log');
  var form = panel.querySelector('.ulp-form');
  var input = panel.querySelector('#ulpTexto');
  var waPie = panel.querySelector('.ulp-wa-pie');

  function actualizarWa(){ waPie.href = waLink(); }

  function burbuja(rol, html){
    var div = document.createElement('div');
    div.className = 'ulp-msg ulp-msg-' + rol;
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }
  function acciones(op){
    var html = '';
    if(op.whatsapp){ html += '<a class="ulp-wa" target="_blank" rel="noopener" href="' + esc(waLink()) + '">Escribir por WhatsApp</a>'; }
    if(op.llamar){ html += '<a class="ulp-llamar" href="tel:+543644566732">Llamar ahora</a>'; }
    return html ? '<div class="ulp-acciones">' + html + '</div>' : '';
  }
  function decir(texto, op){
    op = op || {};
    burbuja('ulpiano', formatear(texto) + acciones(op));
    if(op.guardar !== false){ historial.push({rol: 'ulpiano', texto: texto}); }
    actualizarWa();
  }
  function chips(){
    var div = document.createElement('div');
    div.className = 'ulp-chips';
    div.innerHTML = RAPIDAS.map(function(r){
      return '<button type="button" class="ulp-chip" data-rapida="' + r.id + '">' + esc(r.pregunta) + '</button>';
    }).join('');
    log.appendChild(div);
  }

  function respuestaInmuebles(){
    var lista = inmuebles();
    if(!lista.length){
      return {texto: 'Por ahora no hay inmuebles publicados en la página. Contanos qué estás buscando y te avisamos.', whatsapp: true};
    }
    return {
      texto: 'Estos son los inmuebles que tenemos publicados:\n' + lista.map(function(i){
        return 'Ficha ' + i.codigo + ': ' + i.titulo + (i.localidad ? ' (' + i.localidad + ')' : '');
      }).join('\n') + '\nTocá una ficha para verla completa, o preguntame lo que quieras saber.'
    };
  }

  function rapida(id){
    var r = RAPIDAS.filter(function(x){ return x.id === id; })[0];
    if(!r || esperando){ return; }
    burbuja('usuario', esc(r.pregunta));
    historial.push({rol: 'usuario', texto: r.pregunta});
    var resp = id === 'inmuebles' ? respuestaInmuebles() : r;
    decir(resp.texto, {whatsapp: resp.whatsapp, llamar: resp.llamar});
  }

  function escribiendo(mostrar){
    var e = log.querySelector('.ulp-escribiendo');
    if(mostrar && !e){
      e = burbuja('ulpiano', '<span></span><span></span><span></span><span class="sr-only">Ulpiano está escribiendo</span>');
      e.classList.add('ulp-escribiendo');
    } else if(!mostrar && e){
      e.remove();
    }
  }

  function preguntar(texto){
    texto = texto.trim().slice(0, MAX_LARGO);
    if(!texto || esperando){ return; }
    burbuja('usuario', esc(texto));
    historial.push({rol: 'usuario', texto: texto});
    ultimaConsulta = texto;
    actualizarWa();
    if(preguntasIA >= MAX_PREGUNTAS){
      decir('Para seguir con tu consulta, lo mejor es que hables directamente con un abogado del estudio.', {whatsapp: true, guardar: false});
      return;
    }
    preguntasIA++;
    esperando = true;
    input.disabled = true;
    escribiendo(true);
    var ctrl = window.AbortController ? new AbortController() : null;
    var corte = setTimeout(function(){ if(ctrl){ ctrl.abort(); } }, 30000);
    fetch(API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({mensajes: historial.slice(-16)}),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function(r){
      return r.json().catch(function(){ return {}; }).then(function(d){ d._estado = r.status; return d; });
    }).then(function(d){
      if(d && d.texto){
        decir(d.texto, {whatsapp: d.derivar});
      } else if(d && d._estado === 429){
        decir('Estás escribiendo muy rápido. Esperá un minuto y volvé a intentar, o escribinos por WhatsApp.', {whatsapp: true, guardar: false});
      } else {
        throw new Error('sin respuesta');
      }
    }).catch(function(){
      decir('En este momento no puedo responder por acá. Escribinos por WhatsApp y te contesta un abogado del estudio.', {whatsapp: true, guardar: false});
    }).then(function(){
      clearTimeout(corte);
      escribiendo(false);
      esperando = false;
      input.disabled = false;
      if(!panel.hidden){ input.focus(); }
    });
  }

  // ---------- abrir / cerrar ----------
  var iniciado = false;
  function abrir(){
    ocultarNube();
    panel.hidden = false;
    lanzador.setAttribute('aria-expanded', 'true');
    lanzador.setAttribute('aria-label', 'Cerrar el chat con Ulpiano');
    document.documentElement.classList.add('ulp-abierto');
    if(!iniciado){
      iniciado = true;
      decir('¡Hola! Soy Ulpiano, el asistente virtual del estudio. Puedo orientarte con dudas sencillas o pasarte con un abogado por WhatsApp. ¿En qué te ayudo?', {guardar: false});
      chips();
    }
    setTimeout(function(){ input.focus(); }, 50);
  }
  function cerrar(){
    panel.hidden = true;
    lanzador.setAttribute('aria-expanded', 'false');
    lanzador.setAttribute('aria-label', 'Abrir el chat con Ulpiano, el asistente virtual');
    document.documentElement.classList.remove('ulp-abierto');
    lanzador.focus();
  }

  lanzador.addEventListener('click', function(){ if(panel.hidden){ abrir(); } else { cerrar(); } });
  panel.querySelector('.ulp-cerrar').addEventListener('click', cerrar);
  panel.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ cerrar(); } });
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var t = input.value;
    input.value = '';
    preguntar(t);
  });
  log.addEventListener('click', function(e){
    var b = e.target.closest('[data-rapida]');
    if(b){ rapida(b.getAttribute('data-rapida')); return; }
    // en el celular el chat ocupa la pantalla: al abrir una ficha, se cierra
    if(e.target.closest('.ulp-ficha') && window.matchMedia('(max-width: 640px)').matches){ cerrar(); }
  });

  // mensaje de bienvenida, una sola vez por visita
  function ocultarNube(){
    nube.hidden = true;
    try { sessionStorage.setItem('ulp-nube', '1'); } catch(e){}
  }
  nube.querySelector('.ulp-nube-abrir').addEventListener('click', abrir);
  nube.querySelector('.ulp-nube-cerrar').addEventListener('click', ocultarNube);
  var vista = false;
  try { vista = sessionStorage.getItem('ulp-nube') === '1'; } catch(e){}
  if(!vista){
    setTimeout(function(){
      if(panel.hidden){ nube.hidden = false; }
      setTimeout(function(){ if(!nube.hidden){ ocultarNube(); } }, 9000);
    }, 3500);
  }
  actualizarWa();
})();
