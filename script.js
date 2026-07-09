// Shared behaviour across all pages: mobile nav, theme switcher, back-to-top
document.addEventListener('DOMContentLoaded', function(){
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      navLinks.classList.toggle('open');
      navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
      });
    });
  }

  document.querySelectorAll('.ts-dot').forEach(function(dot){
    dot.addEventListener('click', function(){
      var theme = dot.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.ts-dot').forEach(function(d){ d.classList.remove('active'); });
      dot.classList.add('active');
      try{ localStorage.setItem('securepk-theme', theme); }catch(e){}
    });
  });
  try{
    var saved = localStorage.getItem('securepk-theme');
    if(saved){
      document.documentElement.setAttribute('data-theme', saved);
      document.querySelectorAll('.ts-dot').forEach(function(d){
        d.classList.toggle('active', d.getAttribute('data-theme') === saved);
      });
    }
  }catch(e){}

  var backToTop = document.getElementById('backToTop');
  if(backToTop){
    window.addEventListener('scroll', function(){
      backToTop.classList.toggle('show', window.scrollY > 600);
    });
  }
});
