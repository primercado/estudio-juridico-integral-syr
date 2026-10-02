// scroll reveal
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.15});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('in'); });
  }

  // Mobile navigation
  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('#site-navigation a');
  function closeNav(){
    if(!nav || !navToggle){ return; }
    nav.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Abrir menú');
  }
  if(nav && navToggle){
    navToggle.addEventListener('click', function(){
      var isOpen = nav.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });
    navLinks.forEach(function(link){ link.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ closeNav(); }
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!wasOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  // contact form -> WhatsApp
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var phone = document.getElementById('cf-phone').value.trim();
    var msg = document.getElementById('cf-msg').value.trim();
    var text = 'Hola, soy ' + name + '.';
    if(phone){ text += ' Mi teléfono es ' + phone + '.'; }
    text += ' Consulta: ' + msg;
    window.open('https://wa.me/5493644566732?text=' + encodeURIComponent(text), '_blank');
  });

  // Inmuebles en venta (datos en js/inmuebles.js)
  (function(){
    var grid = document.getElementById('inmGrid');
    var dialog = document.getElementById('fichaDialog');
    if(!grid || !dialog){ return; }
    var filtersEl = document.getElementById('inmFilters');
    var noticeEl = document.getElementById('inmNotice');
    var statusEl = document.getElementById('inmStatus');
    var fichaBody = document.getElementById('fichaBody');
    var contacto = window.INMUEBLES_CONTACTO || {};
    var waNumber = String(contacto.whatsapp || '5493644566732').replace(/\D/g,'');
    var telNumber = String(contacto.telefono || '543644566732').replace(/\D/g,'');
    var ORDEN_ESTADO = {disponible:0, reservado:1, vendido:2};
    var PLURALES = {casa:'Casas', terreno:'Terrenos', departamento:'Departamentos', local:'Locales', campo:'Campos', chacra:'Chacras', quinta:'Quintas', 'galpón':'Galpones', galpon:'Galpones', oficina:'Oficinas', 'dúplex':'Dúplex', duplex:'Dúplex'};
    var items = [];
    var filtro = 'todos';
    var actual = null, fotoIdx = 0, pushed = false, cqSeq = 0;

    function esc(v){
      return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      });
    }
    function num(v){
      if(typeof v === 'number'){ return isFinite(v) && v > 0 ? v : 0; }
      if(!v){ return 0; }
      var s = String(v).trim();
      if(s.indexOf(',') !== -1){ s = s.replace(/\./g,'').replace(',','.'); }
      var n = parseFloat(s);
      return isFinite(n) && n > 0 ? n : 0;
    }
    function fmt(n, dec){
      return n.toLocaleString('es-AR', {minimumFractionDigits: dec || 0, maximumFractionDigits: dec == null ? 2 : dec});
    }
    // medidas de lote con dos decimales (10,00 m); las de campo, enteras (1.500 m)
    function med(n){ return fmt(n, n >= 100 && n % 1 === 0 ? 0 : 2); }
    function superficie(it){
      var ha = num(it.hectareas);
      if(ha){ return fmt(ha) + ' ha'; }
      var m2 = num(it.terreno) || num(it.frente) * num(it.fondo);
      if(!m2){ return ''; }
      return m2 >= 10000 ? fmt(m2 / 10000) + ' ha' : fmt(m2) + ' m²';
    }
    function lista(arr){
      arr = (arr || []).filter(Boolean).map(String);
      if(arr.length < 2){ return arr.join(''); }
      var ultimo = arr[arr.length - 1];
      var y = /^h?i(?![aeiouáéó])/i.test(ultimo) ? ' e ' : ' y ';
      return arr.slice(0, -1).join(', ') + y + ultimo;
    }
    function tipoKey(it){ return String(it.tipo || 'otros').toLowerCase(); }
    function plural(it){ return PLURALES[tipoKey(it)] || (it.tipo ? it.tipo + 's' : 'Otros'); }
    function precio(it){ return !it.precio || /^consultar$/i.test(String(it.precio).trim()) ? 'Precio a consultar' : String(it.precio); }
    function fotosDe(it){ return (it.fotos || []).filter(Boolean); }
    var ENCUADRES = {arriba:'center top', centro:'center', abajo:'center bottom'};
    function encuadre(it){
      var e = String(it.encuadre || '').toLowerCase().trim();
      e = ENCUADRES[e] || e;
      return /^[a-z0-9 .%-]+$/.test(e) ? ' style="object-position:' + e + '"' : '';
    }
    function tipoLugar(it){ return (it.tipo || 'Inmueble') + (it.localidad ? ' en ' + it.localidad : ''); }
    function fichaUrl(it){
      if(!/^https?:$/.test(location.protocol)){ return ''; }
      return location.href.split('#')[0] + '#inmueble-' + it._c;
    }
    function waLink(it){
      var msg = 'Hola, quisiera consultar por el inmueble de la ficha ' + it._c + ': ' + it.titulo + (it.localidad ? ' (' + it.localidad + ')' : '') + '.';
      var url = fichaUrl(it);
      if(url){ msg += ' ' + url; }
      return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
    }
    function datos(it){
      var d = [];
      var sup = superficie(it);
      if(sup){ d.push(['Superficie', sup]); }
      var cub = num(it.cubierta);
      if(cub){ d.push(['Sup. cubierta', fmt(cub) + ' m²']); }
      var dor = num(it.dormitorios);
      if(dor){ d.push(['Dormitorios', fmt(dor)]); }
      var ban = num(it.banos);
      if(ban){ d.push(['Baños', fmt(ban)]); }
      var F = num(it.frente), D = num(it.fondo);
      if(F && D){ d.push(['Medidas', med(F) + ' × ' + med(D) + ' m']); }
      if(it.masDatos){
        Object.keys(it.masDatos).forEach(function(k){ d.push([k, String(it.masDatos[k])]); });
      }
      return d;
    }
    function dlHTML(pares, clase){
      if(!pares.length){ return ''; }
      return '<dl class="' + clase + '">' + pares.map(function(p){
        return '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>';
      }).join('') + '</dl>';
    }
    function sello(it){
      if(it._estado === 'disponible'){ return ''; }
      return '<span class="inm-stamp">' + (it._estado === 'vendido' ? 'Vendido' : 'Reservado') + '</span>';
    }
    function sinFoto(it){
      return '<div class="inm-nofoto"><span>' + esc(it.tipo || 'Inmueble') + '</span><small>Pedinos fotos por WhatsApp</small></div>';
    }

    // Croquis del lote a escala, con cotas de frente y fondo
    function croquis(it){
      var F = num(it.frente), D = num(it.fondo);
      if(!F || !D){ return ''; }
      var id = 'cq' + (++cqSeq);
      var W = 400, H = 300, L = 72, R = 44, T = 50, B = 58;
      var aw = W - L - R, ah = H - T - B;
      var s = Math.min(aw / F, ah / D);
      var w = Math.max(F * s, 12), h = Math.max(D * s, 12);
      var x = L + (aw - w) / 2, y = T + ah - h, x2 = x + w, y2 = y + h;
      var cy = y - 18, cx = x - 20, t = 4;
      var area = it._vacio ? '' : superficie(it);
      var etF = it._vacio ? 'frente' : med(F) + ' m';
      var etD = it._vacio ? 'fondo' : med(D) + ' m';
      var r = function(n){ return Math.round(n * 10) / 10; };
      var svg = '<svg class="croquis" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Croquis del lote: ' + esc(med(F)) + ' m de frente por ' + esc(med(D)) + ' m de fondo">' +
        '<defs>' +
          '<pattern id="' + id + 'g" width="20" height="20" patternUnits="userSpaceOnUse"><path class="cq-grid" d="M20 0H0V20" fill="none"/></pattern>' +
          '<pattern id="' + id + 'h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="cq-hatch" x1="0" y1="0" x2="0" y2="7"/></pattern>' +
        '</defs>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'g)"/>' +
        '<line class="cq-street" x1="14" y1="' + r(y2) + '" x2="' + (W - 14) + '" y2="' + r(y2) + '"/>' +
        '<text class="cq-calle" x="' + (W / 2) + '" y="' + r(y2 + 30) + '" text-anchor="middle">' + esc(it.calle || 'Calle') + '</text>' +
        '<rect class="cq-lot" x="' + r(x) + '" y="' + r(y) + '" width="' + r(w) + '" height="' + r(h) + '" fill="url(#' + id + 'h)"/>' +
        '<path class="cq-dim" d="M' + r(x) + ' ' + r(y - 5) + 'V' + r(cy - 6) + 'M' + r(x2) + ' ' + r(y - 5) + 'V' + r(cy - 6) +
          'M' + r(x) + ' ' + r(cy) + 'H' + r(x2) +
          'M' + r(x - t) + ' ' + r(cy + t) + 'L' + r(x + t) + ' ' + r(cy - t) + 'M' + r(x2 - t) + ' ' + r(cy + t) + 'L' + r(x2 + t) + ' ' + r(cy - t) +
          'M' + r(x - 5) + ' ' + r(y) + 'H' + r(cx - 6) +
          'M' + r(cx) + ' ' + r(y) + 'V' + r(y2) +
          'M' + r(cx - t) + ' ' + r(y + t) + 'L' + r(cx + t) + ' ' + r(y - t) + 'M' + r(cx - t) + ' ' + r(y2 + t) + 'L' + r(cx + t) + ' ' + r(y2 - t) + '"/>' +
        '<text class="cq-text" x="' + r((x + x2) / 2) + '" y="' + r(cy - 7) + '" text-anchor="middle">' + esc(etF) + '</text>' +
        '<text class="cq-text" text-anchor="middle" transform="translate(' + r(cx - 8) + ' ' + r((y + y2) / 2) + ') rotate(-90)">' + esc(etD) + '</text>' +
        (area && w > 84 && h > 40 ? '<text class="cq-area" x="' + r((x + x2) / 2) + '" y="' + r((y + y2) / 2 + 6) + '" text-anchor="middle">' + esc(area) + '</text>' : '') +
        '</svg>';
      return svg;
    }

    function cardHTML(it){
      var fotos = fotosDe(it);
      var media = fotos.length
        ? '<img src="' + esc(fotos[0]) + '" alt="" loading="lazy" decoding="async"' + encuadre(it) + '>' + (fotos.length > 1 ? '<span class="inm-count">' + fotos.length + ' fotos</span>' : '')
        : (croquis(it) || sinFoto(it));
      var docs = (it.documentacion || []).length ? '<p class="inm-docs"><span>Documentación:</span> ' + esc(lista(it.documentacion)) + '</p>' : '';
      var cta = it._estado === 'vendido' ? '' : '<a class="inm-btn inm-btn-solid" href="' + esc(waLink(it)) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>';
      return '<article class="inm-card" data-estado="' + it._estado + '">' +
        '<div class="inm-media" data-abrir="' + esc(it._c) + '">' + media + sello(it) + '</div>' +
        '<div class="inm-body">' +
          '<p class="inm-meta"><span class="inm-code">Ficha ' + esc(it._c) + '</span>' + esc(tipoLugar(it)) + '</p>' +
          '<h3>' + esc(it.titulo) + '</h3>' +
          '<p class="inm-price">' + esc(precio(it)) + '</p>' +
          dlHTML(datos(it).slice(0, 4), 'inm-data') +
          docs +
          '<div class="inm-actions"><button type="button" class="inm-btn" data-abrir="' + esc(it._c) + '">Ver ficha</button>' + cta + '</div>' +
        '</div>' +
      '</article>';
    }

    function vacioHTML(){
      var lote = croquis({frente: 12, fondo: 30, _vacio: true}).replace('class="croquis"', 'class="croquis croquis-vacio" aria-hidden="true"').replace(/ role="img" aria-label="[^"]*"/, '');
      return '<div class="inm-empty">' +
        '<div class="inm-empty-plano">' + lote + '</div>' +
        '<div>' +
          '<h3>Estamos cargando las propiedades</h3>' +
          '<p>Muy pronto vas a ver acá las casas, terrenos y campos que tenemos en venta, cada uno con su ficha. Si buscás algo puntual, contanos qué necesitás.</p>' +
          '<a class="btn btn-solid" href="https://wa.me/' + waNumber + '?text=' + encodeURIComponent('Hola, estoy buscando un inmueble y quisiera saber qué tienen en venta.') + '" target="_blank" rel="noopener">Contanos qué buscás</a>' +
        '</div>' +
      '</div>';
    }

    function render(){
      if(!items.length){
        grid.classList.add('is-empty');
        grid.innerHTML = vacioHTML();
        return;
      }
      grid.classList.remove('is-empty');
      var visibles = items.filter(function(it){ return filtro === 'todos' || tipoKey(it) === filtro; });
      grid.innerHTML = visibles.map(cardHTML).join('');
      if(statusEl){ statusEl.textContent = visibles.length === 1 ? 'Se muestra 1 inmueble' : 'Se muestran ' + visibles.length + ' inmuebles'; }
    }

    function renderFiltros(){
      var tipos = {}, orden = [];
      items.forEach(function(it){
        var k = tipoKey(it);
        if(!tipos[k]){ tipos[k] = {label: plural(it), n: 0}; orden.push(k); }
        tipos[k].n++;
      });
      if(orden.length < 2){ filtersEl.hidden = true; return; }
      var boton = function(k, label, n){
        return '<button type="button" class="inm-filter" data-filtro="' + esc(k) + '" aria-pressed="' + (k === filtro) + '">' + esc(label) + '<span>' + n + '</span></button>';
      };
      filtersEl.innerHTML = boton('todos', 'Todos', items.length) + orden.map(function(k){ return boton(k, tipos[k].label, tipos[k].n); }).join('');
      filtersEl.hidden = false;
    }

    filtersEl.addEventListener('click', function(e){
      var b = e.target.closest('[data-filtro]');
      if(!b){ return; }
      filtro = b.getAttribute('data-filtro');
      filtersEl.querySelectorAll('[data-filtro]').forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });

    grid.addEventListener('click', function(e){
      var a = e.target.closest('[data-abrir]');
      if(a){ abrir(a.getAttribute('data-abrir'), true); }
    });

    // Ficha completa
    function buscar(c){
      for(var i = 0; i < items.length; i++){ if(items[i]._c === c){ return items[i]; } }
      return null;
    }

    function fichaHTML(it){
      var fotos = fotosDe(it);
      var galeria;
      if(fotos.length){
        galeria = '<div class="ficha-stage"><img class="ficha-img" src="' + esc(fotos[0]) + '" alt="">' + sello(it) +
          (fotos.length > 1
            ? '<button type="button" class="ficha-nav ficha-prev" data-paso="-1" aria-label="Foto anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
              '<button type="button" class="ficha-nav ficha-next" data-paso="1" aria-label="Foto siguiente"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
              '<span class="ficha-counter" aria-live="polite"></span>'
            : '') +
          '</div>' +
          (fotos.length > 1 ? '<div class="ficha-thumbs">' + fotos.map(function(f, i){
            return '<button type="button" data-foto="' + i + '" aria-label="Ver foto ' + (i + 1) + ' de ' + fotos.length + '"><img src="' + esc(f) + '" alt="" loading="lazy"></button>';
          }).join('') + '</div>' : '');
      } else {
        galeria = '<div class="ficha-stage ficha-stage-plano">' + (croquis(it) || sinFoto(it)) + sello(it) + '</div>';
      }
      var lugar = [it.ubicacion, it.localidad].filter(Boolean);
      var acciones = it._estado === 'vendido'
        ? '<p class="ficha-vendido">Este inmueble ya se vendió. Escribinos si buscás algo parecido.</p>'
        : '<a class="btn btn-solid" href="' + esc(waLink(it)) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
          '<a class="btn ficha-btn-line" href="tel:+' + telNumber + '">Llamar</a>';
      var detalle = '';
      if(it.descripcion){ detalle += '<h3>Descripción</h3><p>' + esc(it.descripcion) + '</p>'; }
      if((it.caracteristicas || []).length){ detalle += '<h3>Características</h3><ul>' + it.caracteristicas.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>'; }
      var legal = '';
      if((it.documentacion || []).length){ legal += '<h3>Documentación</h3><ul class="ficha-docs">' + it.documentacion.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>'; }
      if(lugar.length || it.mapa){
        legal += '<h3>Ubicación</h3>' + (lugar.length ? '<p>' + esc(lugar.join(', ')) + '</p>' : '') +
          (it.mapa ? '<p><a class="ficha-link" href="' + esc(it.mapa) + '" target="_blank" rel="noopener">Ver en Google Maps</a></p>' : '');
      }
      var plano = fotos.length ? croquis(it) : '';
      if(plano){ legal += '<h3>Croquis del lote</h3><div class="ficha-plano">' + plano + '</div>'; }
      return '<p class="ficha-code">Ficha ' + esc(it._c) + '</p>' +
        '<div class="ficha-top">' +
          '<div class="ficha-gallery">' + galeria + '</div>' +
          '<div class="ficha-summary">' +
            '<p class="inm-meta">' + esc(tipoLugar(it)) + '</p>' +
            '<h2 id="fichaTitle">' + esc(it.titulo) + '</h2>' +
            '<p class="ficha-price">' + esc(precio(it)) + '</p>' +
            '<div class="ficha-actions">' + acciones + '</div>' +
            '<button type="button" class="ficha-share" data-compartir>' + (navigator.share ? 'Compartir esta ficha' : 'Copiar enlace de esta ficha') + '</button>' +
            dlHTML(datos(it), 'ficha-data') +
          '</div>' +
        '</div>' +
        (detalle || legal ? '<div class="ficha-detail"><div>' + detalle + '</div><div>' + legal + '</div></div>' : '');
    }

    function ajustarStage(img){
      var stage = img.closest('.ficha-stage');
      var marcar = function(){ stage.classList.toggle('es-vertical', img.naturalHeight > img.naturalWidth * 1.05); };
      if(img.complete && img.naturalWidth){ marcar(); } else { img.addEventListener('load', marcar, {once: true}); }
    }

    function mostrarFoto(i){
      var fotos = fotosDe(actual);
      if(fotos.length < 2){ return; }
      fotoIdx = (i + fotos.length) % fotos.length;
      var img = fichaBody.querySelector('.ficha-img');
      img.src = fotos[fotoIdx];
      ajustarStage(img);
      img.alt = 'Foto ' + (fotoIdx + 1) + ' de ' + fotos.length + ': ' + actual.titulo;
      fichaBody.querySelector('.ficha-counter').textContent = (fotoIdx + 1) + ' de ' + fotos.length;
      fichaBody.querySelectorAll('[data-foto]').forEach(function(b, j){
        if(j === fotoIdx){ b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
      });
    }

    function abrir(c, push){
      var it = buscar(c);
      if(!it){ return; }
      actual = it;
      fotoIdx = 0;
      fichaBody.innerHTML = fichaHTML(it);
      var img = fichaBody.querySelector('.ficha-img');
      if(img){ img.alt = 'Foto 1 de ' + fotosDe(it).length + ': ' + it.titulo; ajustarStage(img); }
      mostrarFoto(0);
      if(!dialog.open){
        dialog.showModal();
        document.documentElement.classList.add('ficha-abierta');
      }
      dialog.scrollTop = 0;
      if(push){
        history.pushState({ficha: c}, '', '#inmueble-' + c);
        pushed = true;
      }
    }

    dialog.addEventListener('close', function(){
      document.documentElement.classList.remove('ficha-abierta');
      actual = null;
      if(pushed){
        pushed = false;
        history.back();
      } else if(/^#inmueble-/.test(location.hash)){
        history.replaceState(null, '', location.pathname + location.search + '#inmuebles');
      }
    });
    dialog.querySelector('.ficha-close').addEventListener('click', function(){ dialog.close(); });
    dialog.addEventListener('click', function(e){
      if(e.target === dialog){ dialog.close(); return; }
      var paso = e.target.closest('[data-paso]');
      if(paso){ mostrarFoto(fotoIdx + Number(paso.getAttribute('data-paso'))); return; }
      var th = e.target.closest('[data-foto]');
      if(th){ mostrarFoto(Number(th.getAttribute('data-foto'))); return; }
      var sh = e.target.closest('[data-compartir]');
      if(sh && actual){ compartir(sh); }
    });
    dialog.addEventListener('keydown', function(e){
      if(!actual){ return; }
      if(e.key === 'ArrowLeft'){ mostrarFoto(fotoIdx - 1); }
      if(e.key === 'ArrowRight'){ mostrarFoto(fotoIdx + 1); }
    });
    var toqueX = null;
    dialog.addEventListener('touchstart', function(e){
      toqueX = e.target.closest('.ficha-stage') ? e.touches[0].clientX : null;
    }, {passive: true});
    dialog.addEventListener('touchend', function(e){
      if(toqueX === null || !actual){ return; }
      var dx = e.changedTouches[0].clientX - toqueX;
      if(Math.abs(dx) > 40){ mostrarFoto(fotoIdx + (dx < 0 ? 1 : -1)); }
      toqueX = null;
    });

    function compartir(btn){
      var url = fichaUrl(actual) || location.href;
      if(navigator.share){
        navigator.share({title: actual.titulo, text: 'Ficha ' + actual._c + ': ' + actual.titulo, url: url}).catch(function(){});
        return;
      }
      if(navigator.clipboard){
        var texto = btn.textContent;
        navigator.clipboard.writeText(url).then(function(){
          btn.textContent = 'Enlace copiado';
          setTimeout(function(){ btn.textContent = texto; }, 2400);
        });
      }
    }

    window.addEventListener('popstate', function(){
      var m = location.hash.match(/^#inmueble-([A-Za-z0-9-]+)$/);
      if(m && buscar(m[1])){
        abrir(m[1], false);
      } else if(dialog.open){
        pushed = false;
        dialog.close();
      }
    });

    function iniciar(lista, ejemplo){
      items = (lista || []).filter(function(it){ return it && it.titulo; }).map(function(it, i){
        it._c = String(it.codigo || '').replace(/[^A-Za-z0-9-]/g, '') || String(i + 1);
        it._estado = ORDEN_ESTADO.hasOwnProperty(String(it.estado).toLowerCase()) ? String(it.estado).toLowerCase() : 'disponible';
        it._i = i;
        return it;
      }).sort(function(a, b){
        return (ORDEN_ESTADO[a._estado] - ORDEN_ESTADO[b._estado]) || (a._i - b._i);
      });
      if(noticeEl){ noticeEl.hidden = !ejemplo; }
      renderFiltros();
      render();
      var m = location.hash.match(/^#inmueble-([A-Za-z0-9-]+)$/);
      if(m && buscar(m[1])){
        document.getElementById('inmuebles').scrollIntoView();
        abrir(m[1], false);
      }
    }

    if(/[?&]ejemplo\b/.test(location.search)){
      var s = document.createElement('script');
      s.src = 'js/inmuebles-ejemplo.js';
      s.onload = function(){ iniciar(window.INMUEBLES_EJEMPLO, true); };
      s.onerror = function(){ iniciar(window.INMUEBLES, false); };
      document.body.appendChild(s);
    } else {
      iniciar(window.INMUEBLES, false);
    }
  })();
