/* Métricas do link na bio GenioDesk: visitas, cliques, aparelho, região e mapa de calor.
   Tudo anônimo: não guarda IP nem cookie. Lido no painel (/admin, abas Cliques e Mapa de calor). */
(function(){
  'use strict';
  var CFG=window.BIO_CONFIG||{};
  var app=document.getElementById('app'); if(!app) return;
  var params=new URLSearchParams(location.search);
  var isPreview=params.get('preview')==='1';
  var isAdmin=false; try{isAdmin=localStorage.getItem('gd-bio-admin')==='1'}catch(e){}
  var noTrack=isPreview||isAdmin||params.get('notrack')==='1'||!CFG.supabaseUrl||!window.fetch;

  /* ---------- marca cada bloco da página com uma chave estável ---------- */
  function slug(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'item'}
  function txt(n,sel){var x=sel?n.querySelector(sel):n;return x?(x.getAttribute('aria-label')||x.getAttribute('alt')||x.textContent||'').replace(/\s+/g,' ').trim():''}
  function tag(n,key,label,clickable){if(!n)return;n.setAttribute('data-hm',key);if(clickable!==false){n.setAttribute('data-lid',key);n.setAttribute('data-label',(label||key).slice(0,120))}}
  function tagAll(){
    var hero=app.querySelector('.hero'); if(hero){hero.setAttribute('data-hm','topo')}
    var btn=app.querySelector('.hero .btn'); if(btn){btn.setAttribute('data-lid','topo:botao');btn.setAttribute('data-label','Botão do topo · '+txt(btn))}
    var pill=app.querySelector('.hero a.pill'); if(pill){pill.setAttribute('data-lid','topo:selo');pill.setAttribute('data-label','Selo do topo · '+txt(pill))}
    [].forEach.call(app.querySelectorAll('.cup'),function(c){
      var code=c.getAttribute('data-code');
      if(code) tag(c,'cupom:'+slug(code),'Cupom '+code);
      else tag(c,'atalho:'+slug(txt(c,'.ey')),'Atalho · '+txt(c,'.ey'));
    });
    tag(app.querySelector('a.trust'),'garantia','Card de garantia · '+txt(app.querySelector('a.trust'),'b'));
    tag(app.querySelector('a.seg'),'card-escuro','Card escuro · '+txt(app.querySelector('a.seg'),'b'));
    var f=app.querySelector('a.feat'); if(f) tag(f,'produto:'+slug(txt(f,'strong')),'Destaque · '+txt(f,'strong'));
    [].forEach.call(app.querySelectorAll('a.pcard'),function(p){var nm=txt(p,'.tx b')||txt(p,'.mslogo')||txt(p,'.pclogo')||txt(p,'img');tag(p,'produto:'+slug(nm),'Produto · '+nm)});
    [].forEach.call(app.querySelectorAll('a.lk'),function(l){var nm=txt(l,'b');tag(l,'link:'+slug(nm),nm)});
    [].forEach.call(app.querySelectorAll('.social a'),function(s){var nm=s.getAttribute('aria-label')||'rede';tag(s,'social:'+slug(nm),nm)});
    var foot=app.querySelector('.side footer'); if(foot) foot.setAttribute('data-hm','rodape');
  }
  var mo=new MutationObserver(function(){
    mo.disconnect(); tagAll(); mo.observe(app,{childList:true});
    if(isPreview){try{parent.postMessage({type:'bio-rendered'},location.origin)}catch(e){}}
  });
  mo.observe(app,{childList:true});
  if(app.children.length) tagAll();
  if(params.get('hm')==='1'){var st=document.createElement('style');st.textContent='.card-pending{opacity:1!important;transform:none!important}';document.head.appendChild(st)}

  if(noTrack) return;

  /* ---------- envio ---------- */
  var DEVICE=Math.min(innerWidth,screen.width||innerWidth)<700?'mobile':'desktop';
  function mode(){return document.documentElement.getAttribute('data-mode')||null}
  function hdr(){return{apikey:CFG.supabaseKey,Authorization:'Bearer '+CFG.supabaseKey,'Content-Type':'application/json',Prefer:'return=minimal'}}
  function refOf(){
    var ref=params.get('utm_source')||params.get('ref')||'';
    if(!ref&&document.referrer){try{var h=new URL(document.referrer).hostname.replace(/^www\.|^l\.|^m\./,'');if(h&&h!==location.hostname)ref=h}catch(e){}}
    return ref.slice(0,200);
  }
  function post(table,obj){try{fetch(CFG.supabaseUrl+'/rest/v1/'+table,{method:'POST',keepalive:true,headers:hdr(),body:JSON.stringify(obj)}).catch(function(){})}catch(e){}}

  /* região aproximada (estado e cidade) a partir da conexão; o IP não é guardado */
  var GEO=null; try{GEO=JSON.parse(sessionStorage.getItem('gd-bio-geo')||'null')}catch(e){}
  var geoReady=GEO?Promise.resolve(GEO):new Promise(function(res){
    var done=false; setTimeout(function(){if(!done){done=true;res(null)}},2500);
    fetch('https://get.geojs.io/v1/ip/geo.json').then(function(r){return r.json()}).then(function(g){
      GEO={country:(g.country||'').slice(0,60)||null,region:(g.region||'').slice(0,80)||null,city:(g.city||'').slice(0,80)||null};
      try{sessionStorage.setItem('gd-bio-geo',JSON.stringify(GEO))}catch(e){}
      if(!done){done=true;res(GEO)}
    }).catch(function(){if(!done){done=true;res(null)}});
  });
  function base(o){o.site_id=CFG.siteId;o.device=DEVICE;o.mode=mode();o.ref=refOf()||null;if(GEO){o.country=GEO.country;o.region=GEO.region;o.city=GEO.city}return o}

  /* visita: uma por sessão do navegador */
  var rendered=new Promise(function(res){var n=0;(function w(){if(mode()||n++>40)res();else setTimeout(w,100)})()});
  function sendView(){Promise.all([geoReady,rendered]).then(function(){post('bio_events',base({type:'view'}))})}
  try{if(!sessionStorage.getItem('gd-bio-v')){sessionStorage.setItem('gd-bio-v','1');sendView()}}catch(e){sendView()}

  /* cliques em links, cupons, produtos e redes */
  app.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-lid]'); if(!a) return;
    post('bio_events',base({type:'click',link_id:a.getAttribute('data-lid'),label:a.getAttribute('data-label')}));
  });

  /* ---------- mapa de calor: posição dos cliques, tempo em cada bloco e rolagem ---------- */
  var vid=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,function(){return(Math.random()*16|0).toString(16)});
  var part=0, B=nb(), last=Date.now(), recent=[];
  function nb(){return{ms:0,max:0,seen:{},dwell:{},clicks:[]}}
  function r3(n){return Math.round(n*1000)/1000}
  function tick(){
    var now=Date.now(),dt=Math.min(now-last,2000);last=now;
    if(document.visibilityState!=='visible')return;
    B.ms+=dt;
    var docH=Math.max(document.documentElement.scrollHeight,1),vh=innerHeight;
    var pct=Math.min(100,Math.round((scrollY+vh)/docH*100)); if(pct>B.max)B.max=pct;
    var els=app.querySelectorAll('[data-hm]');
    for(var i=0;i<els.length;i++){
      var k=els[i].getAttribute('data-hm'); if(k.indexOf('social:')===0) continue;
      var r=els[i].getBoundingClientRect(),vis=Math.min(r.bottom,vh)-Math.max(r.top,0);
      if(vis<=0||r.width===0)continue;
      if(vis>=Math.min(r.height,vh)*0.5){B.seen[k]=1;B.dwell[k]=(B.dwell[k]||0)+dt}
    }
  }
  setInterval(tick,500);
  document.addEventListener('click',function(e){
    if(B.clicks.length>=150)return;
    var t=e.target.closest?e.target.closest('[data-hm]'):null,k='pagina',box;
    if(t&&app.contains(t)){
      /* dentro do topo, se o clique foi num elemento menor marcado, usa ele */
      k=t.getAttribute('data-hm');box=t.getBoundingClientRect();
    }else{box=app.getBoundingClientRect()}
    var c={k:k,x:r3((e.clientX-box.left)/(box.width||1)),y:r3((e.clientY-box.top)/(box.height||1))};
    if(!(e.target.closest&&e.target.closest('a,button')))c.d=1;
    var now=Date.now(); recent=recent.filter(function(p){return now-p.t<900&&Math.abs(p.cx-e.clientX)<32&&Math.abs(p.cy-e.clientY)<32});
    recent.push({t:now,cx:e.clientX,cy:e.clientY}); if(recent.length>=3)c.r=1;
    B.clicks.push(c);
  },true);
  function flush(){
    tick();
    if(B.ms<400&&!B.clicks.length)return;
    var o=base({id:vid,part:part,vw:innerWidth,dur_ms:Math.min(B.ms,3600000),max_pct:B.max,seen:Object.keys(B.seen).slice(0,80),dwell:B.dwell,clicks:B.clicks});
    part++; B=nb(); if(part>50)return;
    post('bio_visits',o);
  }
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flush();else last=Date.now()});
  addEventListener('pagehide',flush);
})();
