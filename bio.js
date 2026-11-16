/* Link na bio GenioDesk: monta a página a partir do conteúdo salvo no painel (/admin). */
(function(){
  'use strict';
  var CFG = window.BIO_CONFIG || {};
  var DEF = window.BIO_DEFAULT;
  var CACHE_KEY = 'gd-bio-cache-v1';
  var params = new URLSearchParams(location.search);
  var isPreview = params.get('preview') === '1';
  var app = document.getElementById('app');
  var timers = [];
  var firstRender = true;
  var lastJson = '';
  var current = null, currentMode = null;

  /* ---------- utilidades ---------- */
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function hl(s){return esc(s).replace(/\*([^*]+)\*/g,'<em>$1</em>')}
  function plain(s){return String(s||'').replace(/\*/g,'')}
  function url(u){return esc(u||'')}
  function cssUrl(u){return 'url("'+String(u||'').replace(/"/g,'%22')+'")'}
  function merge(base, over){
    if(Array.isArray(base)) return Array.isArray(over)?over:base;
    if(base && typeof base==='object'){
      var out={}; Object.keys(base).forEach(function(k){out[k]=merge(base[k], over?over[k]:undefined)});
      if(over && typeof over==='object') Object.keys(over).forEach(function(k){if(!(k in out))out[k]=over[k]});
      return out;
    }
    return over===undefined||over===null?base:over;
  }
  function brt(s){ /* data do painel sem fuso = horário de Brasília */
    if(!s) return null;
    if(/[zZ]|[+-]\d\d:?\d\d$/.test(s)) return new Date(s);
    if(s.length===16) s+=':00';
    return new Date(s+'-03:00');
  }
  function ext(href){return /^https?:/i.test(href||'')}
  function tgt(href){return ext(href)?' target="_blank" rel="noopener"':' target="_self"'}

  var I = {
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    down:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4"/></svg>',
    right:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    right14:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    diag:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11L11 5M6 5h5v5"/></svg>',
    chev:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>'
  };
  var ICONS = {
    ticket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4Z"/><path d="M10 6v12" stroke-dasharray="2 2"/></svg>',
    store:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 14a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 11Z"/><path d="M5.5 13.5V20h13v-6.5"/><path d="M10 20v-4h4v4"/></svg>',
    people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.2M18 14.3c1.8.8 3 2.6 3 4.7"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/></svg>',
    gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4.5 7 8 12 8Zm0 0s1.5-4 4-3.5S17 8 12 8Z"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5Z"/></svg>',
    tools:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5 6.5 20.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  var SOCIAL = {
    instagram:['Instagram','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'],
    tiktok:['TikTok','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.2v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.9 5.9 0 1 0 5 5.8V9.1a7.5 7.5 0 0 0 4.4 1.4V7.3a4.3 4.3 0 0 1-3.3-1.5Z"/></svg>'],
    youtube:['YouTube','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"/></svg>'],
    site:['Site','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>']
  };

  function resolveMode(d){
    var q=params.get('modo');
    if(q==='normal'||q==='campanha') return q;
    if(d.mode==='campanha' && d.autoNormalAfterEnd){
      var end=brt(d.campanha.end);
      if(end && new Date()>=end) return 'normal';
    }
    return d.mode==='normal'?'normal':'campanha';
  }

  /* ---------- blocos ---------- */
  function heading(m){
    if(m.headingType==='imagem' && m.headingImage) return '<img class="himg" src="'+url(m.headingImage)+'" alt="'+esc(plain(m.headingText))+'">';
    if(m.headingType==='arte'){ var t=document.getElementById('ng-art'); return t?t.innerHTML:''; }
    if(m.headingText) return '<h1 class="htxt">'+hl(m.headingText)+'</h1>';
    return '';
  }

  function hero(d, mode){
    var m=d[mode], camp=mode==='campanha';
    var slides=(d.hero.slides||[]).filter(function(s){return s&&s.img});
    var h='<section class="hero" aria-label="'+esc(plain(m.headingText)||'GenioDesk')+'">';
    h+='<video id="hvbg" class="bgv" muted loop playsinline autoplay preload="auto" aria-hidden="true" hidden></video>';
    h+='<div class="hv-wrap"><video id="hv" muted loop playsinline autoplay preload="auto" hidden></video>';
    slides.forEach(function(s,i){h+='<div class="slide'+(i===0?' on':'')+'" style="background-image:'+esc(cssUrl(s.img))+'" data-name="'+esc(s.name)+'" data-href="'+url(s.href)+'"></div>'});
    h+='</div>';
    h+='<div class="topbar"><span class="wm" role="img" aria-label="GenioDesk"></span>';
    if(m.pill){
      var ph=camp?'#vip':(m.pillHref||'');
      h+= ph ? '<a class="pill" href="'+url(ph)+'"'+(camp?' target="_self"':tgt(ph))+'><span class="dot" aria-hidden="true"></span>'+esc(m.pill)+'</a>'
             : '<span class="pill"><span class="dot" aria-hidden="true"></span>'+esc(m.pill)+'</span>';
    }
    h+='</div>';
    h+='<button class="tap l" id="prev" aria-label="Anterior"></button><button class="tap r" id="next" aria-label="Próximo"></button>';
    h+='<div class="hcopy">'+heading(m)+'<span class="rastro" aria-hidden="true"></span>';

    var hasTitle=m.titleLine1||m.titleLine2||m.subtitle;
    if(hasTitle || m.buttonText){
      h+='<div class="ticket'+(camp?'':' nt')+'" id="vip" aria-labelledby="vip-h"><div class="tk-top"><div class="tk-main"><div>';
      h+='<h2 id="vip-h" class="big">'+(m.titleLine1?'<span>'+hl(m.titleLine1)+'</span>':'')+(m.titleLine2?'<span>'+hl(m.titleLine2)+'</span>':'')+'</h2>';
      if(m.subtitle) h+='<p class="sub" id="vip-sub">'+hl(m.subtitle)+'</p>';
      h+='</div></div><div class="tk-foot">';
      if(camp && m.showTimer){
        h+='<div class="cd" id="timer"><div class="cd-top"><span id="t-label">Começa em</span><span class="cd-pct" id="t-pct"></span></div>'+
           '<div class="cd-nums" id="t-nums"><span class="cd-u"><b id="t-d">--</b><i>dias</i></span><span class="cd-sep">:</span>'+
           '<span class="cd-u"><b id="t-h">--</b><i>horas</i></span><span class="cd-sep">:</span>'+
           '<span class="cd-u"><b id="t-m">--</b><i>min</i></span></div><div class="cd-bar"><span id="t-bar"></span></div></div>';
      }
      if(m.buttonText){
        if(camp) h+='<a class="btn" href="#cupons" target="_self">'+esc(m.buttonText)+' '+I.down+'</a>';
        else h+='<a class="btn" href="'+url(m.buttonHref)+'"'+tgt(m.buttonHref)+'>'+esc(m.buttonText)+' '+I.right+'</a>';
      }
      h+='</div></div></div>';
    }
    h+='</div>';
    h+='<div class="bars" id="bars">'+slides.map(function(){return '<span><i></i></span>'}).join('')+'</div>';
    h+='</section>';
    return h;
  }

  function cups(d, mode){
    var m=d[mode], h='';
    if(mode==='campanha'){
      var list=(m.cupons||[]).filter(function(c){return c&&(c.codigo||c.categoria)});
      if(!list.length) return '';
      h+='<div class="cups" id="cupons" style="--n:'+Math.min(list.length,4)+'" aria-label="'+esc(m.cuponsTitle||'Cupons')+'">';
      h+='<div class="cups-h"><h3>'+esc(m.cuponsTitle)+'</h3><span>'+esc(m.cuponsHint)+'</span></div>';
      list.forEach(function(c){
        h+='<button class="cup" type="button" data-code="'+esc(c.codigo)+'" data-href="'+url(c.href)+'">';
        h+='<span class="ctx"><span class="ey">'+esc(c.categoria)+'</span><b>'+esc(c.valor)+'</b>';
        if(c.descricao) h+='<small>'+esc(c.descricao)+'</small>';
        if(c.selo) h+='<span class="ship">'+esc(c.selo)+'</span>';
        h+='</span><span class="code">'+esc(c.codigo)+' '+I.copy+'</span></button>';
      });
      return h+'</div>';
    }
    var ds=(m.destaques||[]).filter(function(c){return c&&c.categoria});
    if(!ds.length) return '';
    h+='<div class="cups" id="cupons" style="--n:'+Math.min(ds.length,4)+'" aria-label="'+esc(m.destaquesTitle||'Destaques')+'">';
    h+='<div class="cups-h"><h3>'+esc(m.destaquesTitle)+'</h3><span>'+esc(m.destaquesHint)+'</span></div>';
    ds.forEach(function(c){
      h+='<a class="cup alt" href="'+url(c.href)+'"'+tgt(c.href)+'><span class="ctx"><span class="ey">'+esc(c.categoria)+'</span>';
      if(c.descricao) h+='<small>'+esc(c.descricao)+'</small>';
      h+='</span><span class="code">'+esc(c.cta||'Ver no site')+' '+I.right+'</span></a>';
    });
    return h+'</div>';
  }

  function trust(t){
    if(!t||!t.show) return '';
    return '<a class="trust" href="'+url(t.href)+'"'+tgt(t.href)+'>'+(t.img?'<img src="'+url(t.img)+'" alt="'+esc(t.title)+'">':'')+
      '<span class="tx"><span class="ey">'+esc(t.eyebrow)+'</span><b>'+esc(t.title)+'</b><small>'+esc(t.text)+'</small>'+
      (t.cta?'<span class="go2">'+esc(t.cta)+' '+I.right+'</span>':'')+'</span></a>';
  }
  function seg(s){
    if(!s||!s.show) return '';
    return '<a class="seg" href="'+url(s.href)+'"'+tgt(s.href)+'><span class="si">'+(ICONS[s.icon]||ICONS.ticket)+'</span>'+
      '<span class="tx"><span class="ey">'+esc(s.eyebrow)+'</span><b>'+esc(s.title)+'</b><small>'+esc(s.text)+'</small></span>'+
      (s.cta?'<span class="cta2">'+esc(s.cta)+' '+I.right14+'</span>':'')+'</a>';
  }

  function shop(d){
    var s=d.shop||{}, h='<div class="shop">';
    h+='<div class="sec-h"><div><h3>'+esc(s.title)+'</h3><span class="rastro" aria-hidden="true"></span></div></div>';
    var f=s.feat;
    if(f && f.img){
      h+='<a class="feat" href="'+url(f.href)+'"'+tgt(f.href)+'><img src="'+url(f.img)+'" alt="'+esc(f.alt||f.name)+'">'+
        '<div class="cap"><div>'+(f.badge?'<span class="badge">'+esc(f.badge)+'</span>':'')+'<strong>'+esc(f.name)+'</strong></div><span class="arrow">'+I.diag+'</span></div></a>';
    }
    var cards=(s.cards||[]).filter(function(c){return c&&(c.img||c.name)});
    if(cards.length){
      h+='<div class="grid">';
      cards.forEach(function(c){
        var title = c.logo==='mstand' ? '<span class="mslogo" role="img" aria-label="'+esc(c.name)+'"></span>'
                  : (c.logo ? '<img class="pclogo" src="'+url(c.logo)+'" alt="'+esc(c.name)+'">' : '<b>'+esc(c.name)+'</b>');
        h+='<a class="pcard" href="'+url(c.href)+'"'+tgt(c.href)+'><div class="ph"><img src="'+url(c.img)+'" alt="'+esc(c.alt||c.name)+'" loading="lazy"></div><div class="tx">'+title+(c.small?'<small>'+esc(c.small)+'</small>':'')+'</div></a>';
      });
      h+='</div>';
    }
    return h+'</div>';
  }

  function side(d){
    var h='<div class="side"><div class="links">';
    (d.links||[]).forEach(function(l){
      if(!l||!l.title) return;
      h+='<a class="lk" href="'+url(l.href)+'"'+tgt(l.href)+'><span class="ic">'+(ICONS[l.icon]||ICONS.link)+'</span><span class="tx"><b>'+esc(l.title)+'</b>'+(l.small?'<small>'+esc(l.small)+'</small>':'')+'</span><span class="go">'+I.chev+'</span></a>';
    });
    h+='</div><nav class="social" aria-label="Redes sociais">';
    ['instagram','tiktok','youtube','site'].forEach(function(k){
      var u=(d.social||{})[k]; if(!u) return;
      h+='<a href="'+url(u)+'" target="_blank" rel="noopener" aria-label="'+SOCIAL[k][0]+'">'+SOCIAL[k][1]+'</a>';
    });
    h+='</nav><footer><span class="wm" role="img" aria-label="GenioDesk"></span><span class="sep" aria-hidden="true"></span><p>'+esc(d.footer&&d.footer.text)+'</p></footer></div>';
    return h;
  }

  /* ---------- comportamento ---------- */
  function reveal(){
    var motion=matchMedia('(prefers-reduced-motion:reduce)');
    if(!firstRender || motion.matches || !('IntersectionObserver' in window)) return;
    var cards=[].slice.call(app.querySelectorAll('.ticket,.cup,.trust,.seg,.feat,.pcard,.lk'));
    var observer=new IntersectionObserver(function(entries){
      var order=0;
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        var card=entry.target;
        card.style.setProperty('--card-delay',(order++ * 160)+'ms');
        card.classList.remove('card-pending');
        card.classList.add('card-enter');
        observer.unobserve(card);
      });
    },{threshold:.12,rootMargin:'0px 0px -64px 0px'});
    cards.forEach(function(card){
      card.classList.add('card-pending');
      card.addEventListener('animationend',function(e){if(e.animationName==='card-arrive')card.classList.remove('card-enter')});
      observer.observe(card);
    });
  }

  function heroMedia(d){
    var hv=document.getElementById('hv'), slides=[].slice.call(app.querySelectorAll('.slide'));
    var bars=document.getElementById('bars');
    var wide=matchMedia('(min-width:960px)').matches;
    var vw=d.hero.videoWide, vt=d.hero.videoTall;
    var src = (!wide && d.hero.tallOnMobile && vt) ? vt : (vw || vt);
    if(src){
      hv.src=src; hv.hidden=false; slides.forEach(function(s){s.hidden=true});
      bars.hidden=true; document.getElementById('prev').hidden=true; document.getElementById('next').hidden=true;
      var p=hv.play(); if(p&&p.catch)p.catch(function(){});
      if(!wide){var bg=document.getElementById('hvbg'); bg.src=src; bg.hidden=false; var q=bg.play(); if(q&&q.catch)q.catch(function(){});}
    } else if(slides.length){
      var b=[].slice.call(bars.children), i=0, t, DUR=5500;
      var show=function(n){
        i=(n+slides.length)%slides.length;
        slides.forEach(function(s,k){s.classList.toggle('on',k===i);if(k===i){s.style.animation='none';void s.offsetWidth;s.style.animation='';}});
        b.forEach(function(x,k){x.className=k<i?'done':'';var f=x.firstChild;f.style.animation='none';void f.offsetWidth;f.style.animation='';});
        if(b[i]) b[i].className='run';
        clearTimeout(t); t=setTimeout(function(){show(i+1)},DUR); timers.push({c:function(){clearTimeout(t)}});
      };
      document.getElementById('next').onclick=function(){show(i+1)};
      document.getElementById('prev').onclick=function(){show(i-1)};
      show(0);
    }
  }

  function countdown(m){
    var tl=document.getElementById('t-label'); if(!tl) return;
    var START=brt(m.start), END=brt(m.end);
    var tp=document.getElementById('t-pct'), td=document.getElementById('t-d'), th=document.getElementById('t-h'),
        tm=document.getElementById('t-m'), tnums=document.getElementById('t-nums'), tbar=document.getElementById('t-bar');
    function tick(){
      var now=new Date(), target=null, total=0;
      if(START && now<START){tl.textContent='Começa em';target=START;}
      else if(END && now<END){tl.textContent='Termina em';target=END;total=START?END-START:0;}
      else{
        tl.textContent='Campanha encerrada';tp.textContent='';
        tnums.hidden=true;tbar.style.width='100%';
        var sub=document.getElementById('vip-sub'); if(sub && m.endedSubtitle) sub.textContent=plain(m.endedSubtitle);
        return;
      }
      tnums.hidden=false;
      var s=Math.max(0,Math.floor((target-now)/1000));
      td.textContent=Math.floor(s/86400);
      th.textContent=String(Math.floor(s%86400/3600)).padStart(2,'0');
      tm.textContent=String(Math.floor(s%3600/60)).padStart(2,'0');
      var pct=total?Math.min(100,Math.max(0,(1-(target-now)/total)*100)):0;
      tbar.style.width=pct.toFixed(1)+'%';
      tp.textContent=total?Math.round(pct)+'%':'';
    }
    tick(); var iv=setInterval(tick,1000); timers.push({c:function(){clearInterval(iv)}});
  }

  var toast=document.getElementById('toast'), toastT=null;
  function showToast(msg){
    toast.textContent=msg; toast.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(function(){toast.classList.remove('show')},1800);
  }
  function coupons(){
    [].slice.call(app.querySelectorAll('button.cup')).forEach(function(cup){
      cup.addEventListener('click',function(){
        var code=cup.getAttribute('data-code'), href=cup.getAttribute('data-href');
        function done(){
          cup.classList.add('copied');
          showToast('Cupom '+code+' copiado!');
          setTimeout(function(){cup.classList.remove('copied')},1800);
          if(href)setTimeout(function(){window.open(href,'_blank','noopener')},450);
        }
        if(navigator.clipboard&&navigator.clipboard.writeText){
          navigator.clipboard.writeText(code).then(done,done);
        }else{
          var ta=document.createElement('textarea');ta.value=code;ta.style.position='fixed';ta.style.opacity='0';
          document.body.appendChild(ta);ta.select();
          try{document.execCommand('copy')}catch(e){}
          document.body.removeChild(ta);done();
        }
      });
    });
  }

  function setMeta(m, d){
    document.title = m.pageTitle || 'GenioDesk';
    var md=document.querySelector('meta[name=description]'); if(md && m.pageDescription) md.setAttribute('content', m.pageDescription);
    var fav=document.getElementById('favicon'); if(fav && d.brand.favicon) fav.href=d.brand.favicon;
  }

  /* ---------- render ---------- */
  function render(raw){
    var d=merge(DEF, raw||{});
    var json=JSON.stringify(d)+'|'+params.get('modo');
    if(json===lastJson) return;
    lastJson=json;
    timers.forEach(function(t){t.c()}); timers=[];
    var mode=resolveMode(d), m=d[mode];
    current=raw||{}; currentMode=mode;
    document.documentElement.setAttribute('data-mode', mode);
    var root=document.documentElement;
    root.style.setProperty('--wm', cssUrl(d.brand.logo));
    root.style.setProperty('--ms', cssUrl(d.brand.logoMStand));
    root.style.setProperty('--gb', cssUrl('bio-assets/logo-g-box.png'));
    var firstSlide=(d.hero.slides||[]).filter(function(s){return s&&s.img})[0];
    root.style.setProperty('--h1', firstSlide?cssUrl(firstSlide.img):'none');
    setMeta(m, d);

    app.innerHTML = hero(d,mode) + cups(d,mode) + trust(m.trust) + seg(m.seg) + shop(d) + side(d);

    reveal(); heroMedia(d);
    if(mode==='campanha') countdown(m);
    coupons();
    firstRender=false;
    document.body.classList.remove('loading');
  }

  /* ---------- carregamento ---------- */
  function readCache(){try{var c=localStorage.getItem(CACHE_KEY);return c?JSON.parse(c):null}catch(e){return null}}
  function writeCache(d){try{localStorage.setItem(CACHE_KEY,JSON.stringify(d))}catch(e){}}

  function fetchContent(){
    if(!CFG.supabaseUrl) return Promise.reject();
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var to = setTimeout(function(){ctrl&&ctrl.abort()}, 6000);
    return fetch(CFG.supabaseUrl+'/rest/v1/bio_site?id=eq.'+encodeURIComponent(CFG.siteId)+'&select=data',{
      headers:{apikey:CFG.supabaseKey, Authorization:'Bearer '+CFG.supabaseKey},
      signal: ctrl?ctrl.signal:undefined, cache:'no-store'
    }).then(function(r){clearTimeout(to); if(!r.ok) throw 0; return r.json()})
      .then(function(rows){ if(!rows||!rows[0]) throw 0; return rows[0].data; });
  }

  if(isPreview){
    window.addEventListener('message',function(e){
      if(e.origin!==location.origin) return;
      if(e.data && e.data.type==='bio-preview'){ lastJson=''; render(e.data.data); }
    });
    try{ parent.postMessage({type:'bio-preview-ready'}, location.origin); }catch(e){}
  }

  var cached = readCache();
  if(cached && !isPreview) render(cached);
  var fallback = setTimeout(function(){ if(document.body.classList.contains('loading')) render(cached||{}); }, 2500);
  fetchContent().then(function(data){
    clearTimeout(fallback);
    if(!isPreview) writeCache(data);
    if(!isPreview || document.body.classList.contains('loading')) render(data);
  }).catch(function(){
    clearTimeout(fallback);
    if(document.body.classList.contains('loading')) render(cached||{});
  });

  /* muda sozinho para o modo Normal quando a campanha acaba, sem precisar recarregar */
  setInterval(function(){
    if(!current) return;
    if(resolveMode(merge(DEF,current))!==currentMode){ lastJson=''; render(current); }
  }, 60000);
})();
