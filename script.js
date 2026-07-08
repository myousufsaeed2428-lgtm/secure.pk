// Shared behaviour across all pages: mobile nav, theme switcher, back-to-top, cyber background
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

// ---------- Interactive cyber-network background ----------
(function(){
  var canvas = document.getElementById('cyberBg');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W, H, nodes = [];
  var mouse = {x:null, y:null};
  var NODE_COUNT_BASE = 70;

  function themeColor(){
    var styles = getComputedStyle(document.documentElement);
    return {
      line: styles.getPropertyValue('--a2').trim() || '7,128,154',
      dot: styles.getPropertyValue('--a1').trim() || '29,78,216'
    };
  }

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    var count = Math.max(30, Math.min(NODE_COUNT_BASE, Math.round((W*H)/22000)));
    nodes = [];
    for(var i=0;i<count;i++){
      nodes.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.28,
        vy: (Math.random()-0.5)*0.28,
        r: Math.random()*1.6+0.8
      });
    }
  }

  function step(){
    var colors = themeColor();
    ctx.clearRect(0,0,W,H);
    var linkDist = 130;

    for(var i=0;i<nodes.length;i++){
      var n = nodes[i];
      if(!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > W) n.vx *= -1;
        if(n.y < 0 || n.y > H) n.vy *= -1;
      }
      if(mouse.x !== null){
        var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        var mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        if(mdist < 140 && !reduceMotion){
          n.x += (mdx/mdist) * 0.35;
          n.y += (mdy/mdist) * 0.35;
        }
      }
    }

    for(var a=0; a<nodes.length; a++){
      for(var b=a+1; b<nodes.length; b++){
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < linkDist){
          var op = (1 - dist/linkDist) * 0.5;
          ctx.strokeStyle = 'rgba(' + colors.line + ',' + op.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }
    for(var j=0;j<nodes.length;j++){
      var nd = nodes[j];
      ctx.fillStyle = 'rgba(' + colors.dot + ',0.75)';
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI*2);
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', function(){ mouse.x = null; mouse.y = null; });

  resize();
  step();
})();
