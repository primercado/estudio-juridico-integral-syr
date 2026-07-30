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
    window.open('https://wa.me/5493644401819?text=' + encodeURIComponent(text), '_blank');
  });
