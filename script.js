const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
const shade=(h,a)=>{
  const n=parseInt(h.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(c*(1+a))));
  return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('');
};
let uid=0,pT;

/* ===== Efeitos ===== */
(function stars(){
  const bg=$('#bg');
  for(let i=0;i<46;i++){
    const s=document.createElement('i'),z=1+Math.random()*2.4;
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;animation-delay:${Math.random()*5}s;animation-duration:${2+Math.random()*4}s`;
    bg.append(s);
  }
})();
function confetti(n=46){
  const fx=$('#fx');
  for(let i=0;i<n;i++){
    const p=document.createElement('i');
    p.style.cssText=`left:${Math.random()*100}%;background:${rnd(['#00e5ff','#ff2bd6','#7dff6a','#ffe45c','#ff8a1e'])};`+
      `--dx:${(Math.random()-.5)*220}px;--rot:${Math.random()*720}deg;animation-delay:${Math.random()*.35}s;animation-duration:${1.7+Math.random()*1.3}s`;
    fx.append(p);setTimeout(()=>p.remove(),3600);
  }
}

/* ===== Navegação ===== */
function show(id){
  clearInterval(pT);
  $$('.screen').forEach(e=>e.classList.toggle('active',e.id===id));
  ({pairs:pairsInit,cakes:cakesInit,shop:shopInit,hub:crewInit}[id]||(()=>{}))();
  window.scrollTo(0,0);
}
$$('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
$$('.home').forEach(b=>b.onclick=()=>show('hub'));

/* =====================================================
   PURBLE PERSONAGEM (usado no Shop e no Hub)
   ===================================================== */
const OL='stroke="rgba(0,0,0,.38)" stroke-width="2" stroke-linejoin="round"';
const FEAT=['eyes','shoes','mouth','hair','hat','shirt','nose','pants','glasses','mustache','bowtie','gloves'];
const FNAME={hat:'Chapéu',eyes:'Olhos',shirt:'Blusa',shoes:'Sapatos',nose:'Nariz',mouth:'Boca',pants:'Calça',hair:'Cabelo',glasses:'Óculos',mustache:'Bigode',bowtie:'Gravata',gloves:'Luvas'};
const FICON={hat:'🎩',eyes:'👀',shirt:'👕',shoes:'👟',nose:'👃',mouth:'👄',pants:'👖',hair:'💇',glasses:'👓',mustache:'🧔',bowtie:'🎀',gloves:'🧤'};
const COLS=['#ff3fa4','#9b30ff','#ffd400','#1e90ff','#22c722','#ff8a1e','#e8322b'];
const CNAME=['rosa','roxo','amarelo','azul','verde','laranja','vermelho'];
/* viewBox de cada peça (recorte usado nas prateleiras) */
const VB={hat:'34 4 132 68',eyes:'52 62 96 50',shirt:'16 140 168 84',shoes:'42 254 116 36',nose:'80 94 40 34',mouth:'68 122 64 34',pants:'50 200 100 68',hair:'10 6 180 122',glasses:'38 60 124 56',mustache:'66 114 68 28',bowtie:'68 146 64 34',gloves:'2 194 36 40'};
function hairPath(){
  const f=v=>v.toFixed(1),p=[];
  for(let i=0;i<=8;i++){const a=Math.PI+i*Math.PI/8;p.push([100+76*Math.cos(a),88+60*Math.sin(a)])}
  return 'M'+f(p[0][0])+' '+f(p[0][1])+p.slice(1).map(q=>`A14.5 14.5 0 0 1 ${f(q[0])} ${f(q[1])}`).join('')+'Q100 132 '+f(p[0][0])+' '+f(p[0][1])+'Z';
}
const HAIR=hairPath();
const PART={
  hat:c=>`<rect x="66" y="12" width="68" height="46" rx="8" fill="${c}" ${OL}/>
    <rect x="66" y="38" width="68" height="12" fill="#000" opacity=".3"/>
    <rect x="95" y="38" width="10" height="12" rx="2" fill="#ffe45c" ${OL}/>
    <ellipse cx="100" cy="58" rx="62" ry="11" fill="${c}" ${OL}/>
    <ellipse cx="100" cy="12" rx="34" ry="7" fill="${c}" ${OL}/>
    <ellipse cx="100" cy="11" rx="26" ry="3.5" fill="#fff" opacity=".3" class="hl"/>
    <rect x="73" y="20" width="9" height="17" rx="4" fill="#fff" opacity=".28" class="hl"/>
    <ellipse cx="78" cy="56" rx="22" ry="3" fill="#fff" opacity=".22" class="hl"/>`,
  eyes:c=>[74,126].map(x=>`<ellipse cx="${x}" cy="86" rx="17" ry="21" fill="#fff" stroke="rgba(0,0,0,.4)" stroke-width="2"/>
    <circle cx="${x}" cy="90" r="11.5" fill="${c}"/><circle cx="${x}" cy="90" r="5.5" fill="#111"/>
    <circle cx="${x-4}" cy="85" r="3.4" fill="#fff" class="hl"/><circle cx="${x+4}" cy="94" r="1.6" fill="#fff" class="hl"/>`).join(''),
  shirt:c=>`<g fill="${c}" ${OL}>
      <path d="M56 144Q100 158 144 144L148 218Q100 230 52 218Z"/>
      <path d="M58 146L34 156Q24 160 22 184L20 196L44 202L50 184L60 176Z"/>
      <path d="M142 146L166 156Q176 160 178 184L180 196L156 202L150 184L140 176Z"/></g>
    <path d="M80 146Q100 168 120 146" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 192L46 198M154 198L176 192" stroke="#000" stroke-opacity=".28" stroke-width="4"/>
    <path d="M54 210Q100 222 146 210" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="3"/>
    <ellipse cx="78" cy="176" rx="9" ry="22" fill="#fff" opacity=".22" class="hl"/>
    <circle cx="100" cy="190" r="5" fill="#fff" opacity=".3" class="hl"/>`,
  shoes:c=>[74,126].map(x=>`<ellipse cx="${x}" cy="270" rx="26" ry="13" fill="${c}" ${OL}/>
    <path d="M${x-25} 274Q${x} 290 ${x+25} 274" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    <path d="M${x-7} 262h14M${x-7} 267h14" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="${x-9}" cy="265" rx="8" ry="3" fill="#fff" opacity=".3" class="hl"/>`).join(''),
  nose:c=>`<path d="M100 98Q115 114 111 121Q100 126 89 121Q85 114 100 98Z" fill="${c}" ${OL}/>
    <ellipse cx="96" cy="113" rx="3.4" ry="5.5" fill="#fff" opacity=".4" class="hl"/>`,
  mouth:c=>`<path d="M74 127H126Q122 151 100 151Q78 151 74 127Z" fill="${c}" ${OL}/>
    <path d="M78 127H122Q121 134 118 136H82Q79 134 78 127Z" fill="#fff"/>
    <ellipse cx="100" cy="146" rx="9" ry="3" fill="#000" opacity=".22"/>`,
  hair:c=>`<path d="${HAIR}" fill="${c}" ${OL}/>
    <path d="M44 62Q58 44 80 38M120 36Q142 42 156 62M30 88Q32 76 38 68M170 88Q168 76 162 68" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="62" cy="40" rx="14" ry="5" fill="#fff" opacity=".3" transform="rotate(-28 62 40)" class="hl"/>`,
  glasses:c=>`<g fill="#fff" fill-opacity=".14" stroke="${c}" stroke-width="5">
    <circle cx="74" cy="88" r="25"/><circle cx="126" cy="88" r="25"/></g>
    <path d="M99 86Q100 82 101 86M49 84L38 80M151 84L162 80" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
    <path d="M58 76Q64 68 74 66" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5" class="hl"/>`,
  mustache:c=>`<path d="M100 127C92 119 80 119 74 125C69 130 72 137 78 134C84 131 92 133 100 131C108 133 116 131 122 134C128 137 131 130 126 125C120 119 108 119 100 127Z" fill="${c}" ${OL}/>
    <path d="M84 125Q90 123 95 127" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".35" class="hl"/>`,
  bowtie:c=>`<g fill="${c}" ${OL}><path d="M100 163L74 150Q70 163 74 176Z"/><path d="M100 163L126 150Q130 163 126 176Z"/>
    <rect x="93" y="155" width="14" height="16" rx="4"/></g>
    <path d="M80 157L92 162M120 157L108 162" stroke="#000" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="82" cy="158" rx="5" ry="2.5" fill="#fff" opacity=".35" class="hl"/>`,
  gloves:c=>[[21,14],[179,-14]].map(([x,r])=>`<g fill="${c}" ${OL}>
    <ellipse cx="${x}" cy="215" rx="14" ry="16" transform="rotate(${r} ${x} 215)"/>
    <ellipse cx="${x+(r>0?13:-13)}" cy="209" rx="5.5" ry="9" transform="rotate(${r*2} ${x} 215)"/>
    <rect x="${x-13}" y="198" width="26" height="10" rx="4" transform="rotate(${r} ${x} 203)"/></g>
    <path d="M${x-4} 216v8M${x+3} 216v8" stroke="#000" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="${x-5}" cy="210" rx="4" ry="6" fill="#fff" opacity=".3" class="hl"/>`).join(''),
  pants:c=>`<g fill="${c}" ${OL}><rect x="54" y="204" width="92" height="34" rx="14"/>
      <rect x="66" y="222" width="28" height="42" rx="9"/><rect x="106" y="222" width="28" height="42" rx="9"/></g>
    <rect x="55" y="205" width="90" height="8" rx="4" fill="#000" opacity=".3"/>
    <rect x="94" y="204" width="12" height="9" rx="2" fill="#ffe45c" ${OL}/>
    <rect x="70" y="228" width="7" height="26" rx="3" fill="#fff" opacity=".22" class="hl"/>
    <path d="M100 222V240" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`
};
function purble({parts={},ghost=[],body='#4fd8d0',cls='',cheek=true}={}){
  const id='pg'+(++uid);
  const P=f=>parts[f]?PART[f](parts[f]):(ghost.includes(f)?`<g class="ghost">${PART[f]('#fff')}</g>`:'');
  const base=`stroke="rgba(0,0,0,.35)" stroke-width="2"`;
  return `<svg viewBox="0 0 200 300" class="${cls}" role="img" aria-label="Purble"><defs>
    <radialGradient id="${id}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${shade(body,.45)}"/><stop offset=".55" stop-color="${body}"/><stop offset="1" stop-color="${shade(body,-.38)}"/></radialGradient></defs>
    <ellipse cx="100" cy="285" rx="74" ry="10" fill="#000" opacity=".4"/>
    <g fill="url(#${id})" ${base}>
      <rect x="70" y="214" width="22" height="52" rx="11"/><rect x="108" y="214" width="22" height="52" rx="11"/>
      <ellipse cx="74" cy="268" rx="21" ry="10"/><ellipse cx="126" cy="268" rx="21" ry="10"/>
      <rect x="24" y="152" width="20" height="68" rx="10" transform="rotate(14 34 152)"/>
      <rect x="156" y="152" width="20" height="68" rx="10" transform="rotate(-14 166 152)"/>
      <rect x="52" y="138" width="96" height="88" rx="38"/>
    </g>
    ${P('pants')}${P('shirt')}${P('bowtie')}${P('gloves')}${P('shoes')}
    ${P('hair')}
    <g fill="url(#${id})" ${base}><ellipse cx="38" cy="94" rx="9" ry="14"/><ellipse cx="162" cy="94" rx="9" ry="14"/><ellipse cx="100" cy="95" rx="64" ry="58"/></g>
    <ellipse cx="78" cy="62" rx="24" ry="9" fill="#fff" opacity=".2"/>
    ${cheek?'<circle cx="50" cy="112" r="9" fill="#ff7aa8" opacity=".5"/><circle cx="150" cy="112" r="9" fill="#ff7aa8" opacity=".5"/>':''}
    ${P('eyes')}${P('glasses')}${P('nose')}${P('mouth')}${P('mustache')}${P('hat')}
  </svg>`;
}

/* ===== Hub: turma de Purbles ===== */
const BODIES=['#4fd8d0','#b58cff','#ff9ccf','#ffd36b','#8ef0a0','#ff9f6b'];
function randomPurble(){
  const parts={},pick=()=>rnd(COLS);
  const OPT={hair:.75,glasses:.45,mustache:.4,bowtie:.4,gloves:.4};
  FEAT.forEach(f=>{if(!(f in OPT)||Math.random()<OPT[f])parts[f]=pick()});
  return purble({parts,body:rnd(BODIES)});
}
function crewInit(){
  const box=$('#crew');box.innerHTML='';
  for(let i=0;i<3;i++){
    const b=document.createElement('button');b.className='mate';b.style.animationDelay=(i*.5)+'s';
    b.setAttribute('aria-label','Trocar roupa do Purble');
    b.innerHTML=randomPurble();
    b.onclick=()=>{b.classList.remove('jump');void b.offsetWidth;b.classList.add('jump');b.innerHTML=randomPurble()};
    box.append(b);
  }
}

/* =====================================================
   PURBLE PAIRS
   ===================================================== */
const SYM=['🐾','👵','🍰','🎁','🎩','⭐','🍀','🎈','🧁','🔔','🐟','🌙','🦄','🍉','🚀','🐙','🌈','🎸'];
const PL={easy:{cols:4,pairs:6,empty:false},normal:{cols:5,pairs:12,empty:true},hard:{cols:6,pairs:18,empty:false}};
let pFirst,pLock,pMoves,pSec,pLeft,pTotal;
function pairsInit(){
  clearInterval(pT);
  const lv=$('#pLevel').value,cfg=PL[lv];
  pMoves=0;pSec=0;pFirst=null;pLock=false;pLeft=pTotal=cfg.pairs;
  const deck=shuf([...shuf(SYM).slice(0,cfg.pairs).flatMap(s=>[s,s])]);
  if(cfg.empty)deck.splice(Math.floor(deck.length/2),0,null);
  const g=$('#pGrid');g.innerHTML='';g.style.setProperty('--cols',cfg.cols);
  deck.forEach(s=>{
    const t=document.createElement('button');
    t.className='tile'+(s?'':' empty');t.dataset.s=s||'';
    if(s){
      t.innerHTML=`<span class="in"><span class="face back"></span><span class="face front">${s}</span></span>`;
      t.setAttribute('aria-label','Carta virada');
      t.onclick=()=>flip(t);
    }else t.disabled=true;
    g.append(t);
  });
  $('#pMsg').textContent='';pUpd();
  pT=setInterval(()=>{pSec++;pUpd()},1000);
}
function pUpd(){
  $('#pTime').textContent='⏱ '+pSec+'s';
  $('#pMoves').textContent='Jogadas: '+pMoves;
  const b=store.get('pp_best_'+$('#pLevel').value,null);
  $('#pBest').textContent=b?`🏆 ${b.sec}s`:'';
  $('#pFill').style.width=((pTotal-pLeft)/pTotal*100)+'%';
}
function flip(t){
  if(pLock||t.classList.contains('open')||t.classList.contains('done'))return;
  t.classList.add('open');
  if(!pFirst){pFirst=t;return}
  const a=pFirst;pFirst=null;pMoves++;pUpd();
  if(a.dataset.s===t.dataset.s){
    pLeft--;
    setTimeout(()=>{[a,t].forEach(x=>{x.classList.remove('open');x.classList.add('done')});pUpd()},350);
    if(!pLeft){
      clearInterval(pT);
      setTimeout(()=>{
        const k='pp_best_'+$('#pLevel').value,old=store.get(k,null);
        let extra='';
        if(!old||pSec<old.sec){store.set(k,{sec:pSec,moves:pMoves});extra=' 🏆 Novo recorde!'}
        $('#pMsg').textContent=`🎉 Você venceu em ${pSec}s e ${pMoves} jogadas!${extra}`;
        pUpd();confetti();
      },700);
    }
  }else{
    pLock=true;
    setTimeout(()=>{
      [a,t].forEach(x=>x.classList.add('bad'));
      setTimeout(()=>{[a,t].forEach(x=>x.classList.remove('open','bad'));pLock=false},520);
    },450);
  }
}
$('#pNew').onclick=pairsInit;
$('#pLevel').onchange=pairsInit;

/* =====================================================
   COMFY CAKES
   ===================================================== */
function starPath(){
  const R=48,r=25,cx=50,cy=53,p=[];
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;p.push((cx+q*Math.cos(a)).toFixed(1)+' '+(cy+q*Math.sin(a)).toFixed(1))}
  return 'M'+p.join('L')+'Z';
}
function flowerPath(){
  const n=8,R=35,pts=[];
  for(let i=0;i<n;i++){const a=i*2*Math.PI/n-Math.PI/2;pts.push([50+R*Math.cos(a),50+R*Math.sin(a)])}
  const f=v=>v.toFixed(1);
  return 'M'+f(pts[0][0])+' '+f(pts[0][1])+pts.slice(1).concat([pts[0]]).map(p=>`A17 17 0 0 1 ${f(p[0])} ${f(p[1])}`).join('')+'Z';
}
const SH={
  round:'M4 50a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z',
  square:'M20 6H80Q94 6 94 20V80Q94 94 80 94H20Q6 94 6 80V20Q6 6 20 6Z',
  heart:'M50 92C8 62 0 36 18 18C32 6 46 14 50 30C54 14 68 6 82 18C100 36 92 62 50 92Z',
  star:starPath(),
  flower:flowerPath()
};
const FLAV={chocolate:'#6b3a1e',baunilha:'#f3d27a',morango:'#f58ab0',limao:'#d3e857',veludo:'#a3152b'};
const ICE={branca:'#ffffff',rosa:'#ff9ccf',chocolate:'#5a2d14',azul:'#8fd3ff',menta:'#9ff0c6'};
const TOP={confete:'🌈',coracao:'❤️',trevo:'🍀',sorriso:'😊',cereja:'🍒',estrela:'⭐',flor:'🌸',morango:'🍓'};
const mini=k=>`<svg class="mi" viewBox="0 0 100 100"><path d="${SH[k]}" fill="currentColor" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>`;
const dot=c=>`<i style="background:${c}"></i>`;
const CK=[
  {f:'shape',label:'Forma',items:[['round','Redonda'],['square','Quadrada'],['heart','Coração'],['star','Estrela'],['flower','Flor']].map(([k,n])=>({k,n,ic:mini(k)}))},
  {f:'flavor',label:'Massa',items:[['chocolate','Chocolate'],['baunilha','Baunilha'],['morango','Morango'],['limao','Limão'],['veludo','Veludo']].map(([k,n])=>({k,n,ic:dot(FLAV[k])}))},
  {f:'icing',label:'Cobertura',items:[['branca','Branca'],['rosa','Rosa'],['chocolate','Chocolate'],['azul','Azul'],['menta','Menta']].map(([k,n])=>({k,n,ic:dot(ICE[k])}))},
  {f:'border',label:'Borda',items:[['nenhuma','Lisa','∅'],['perolas','Pérolas','⚪'],['chantilly','Chantilly','☁️'],['dourada','Dourada','✨']].map(([k,n,ic])=>({k,n,ic}))},
  {f:'candles',label:'Velas',items:[['0','Sem velas','∅'],['1','1 vela','🕯️'],['3','3 velas','🕯️']].map(([k,n,ic])=>({k,n,ic}))},
  {f:'top',label:'Enfeite',items:[['confete','Confete'],['coracao','Coração'],['trevo','Trevo'],['sorriso','Sorriso'],['cereja','Cereja'],['estrela','Estrela'],['flor','Flor'],['morango','Morango']].map(([k,n])=>({k,n,ic:TOP[k]}))}
];
const CUST=['👩‍🦰','🧔','👴','👧','🧑‍🎤','🦸','🐻','🐰','🦊'];
function layer(k,fill,sc,dx=0,dy=0,extra=''){
  return `<path d="${SH[k]}" fill="${fill}" ${extra} transform="translate(${50+dx} ${50+dy}) scale(${sc}) translate(-50 -50)"/>`;
}
function candle(x,y,col){
  return `<rect x="${x-2}" y="${y}" width="4" height="16" rx="1.5" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width=".7"/>
    <path d="M${x} ${y-10}Q${x+4.5} ${y-3} ${x} ${y}Q${x-4.5} ${y-3} ${x} ${y-10}Z" fill="#ffb300"/>
    <path d="M${x} ${y-6}Q${x+2.2} ${y-3} ${x} ${y-1}Q${x-2.2} ${y-3} ${x} ${y-6}Z" fill="#fff59d"/>`;
}
function cake(o){
  const id='ck'+(++uid);
  let s=`<svg viewBox="0 0 100 100"><defs>
    <radialGradient id="${id}p" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#aebbd6"/></radialGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <circle cx="50" cy="50" r="49" fill="url(#${id}p)" stroke="#6fe3ff" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="42" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1"/>
    <circle cx="50" cy="50" r="45.5" fill="none" stroke="#6fe3ff" stroke-opacity=".55" stroke-width=".9" stroke-dasharray="1.2 2.6"/>`;
  if(!o.shape)return s+`<text x="50" y="62" font-size="34" text-anchor="middle" fill="#6b7ca3" font-weight="700">?</text></svg>`;
  const k=o.shape;
  s+=layer(k,'rgba(0,0,0,.28)',.88,1.5,3.5);
  if(o.flavor){
    s+=layer(k,shade(FLAV[o.flavor],-.4),.86,0,2.5);
    s+=layer(k,FLAV[o.flavor],.86,0,0,'stroke="rgba(0,0,0,.25)" stroke-width="1"');
  }else s+=layer(k,'rgba(255,255,255,.18)',.86,0,0,'stroke="#6fe3ff" stroke-width="1.2" stroke-dasharray="4 3"');
  if(o.icing){
    s+=layer(k,ICE[o.icing],.72,0,0,'stroke="rgba(0,0,0,.2)" stroke-width="1.2"');
    s+=layer(k,`url(#${id}s)`,.72);
  }
  if(o.border&&o.border!=='nenhuma'){
    const d=SH[k],T='transform="translate(50 50) scale(.7) translate(-50 -50)"';
    const ring=(w,c,da)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${da}" stroke-linecap="round" stroke-linejoin="round" ${T}/>`;
    if(o.border==='perolas')s+=ring(10.5,'rgba(0,0,0,.28)','0 12')+ring(8,'#fff7e6','0 12');
    if(o.border==='chantilly')s+=ring(12,'rgba(0,0,0,.2)','9 5')+ring(9.5,'#ffffff','9 5');
    if(o.border==='dourada')s+=ring(6.5,'rgba(0,0,0,.3)','14 6')+ring(4.5,'#ffd23f','14 6');
  }
  if(o.top==='confete')s+=[[38,52,'#f33'],[60,50,'#39f'],[50,64,'#fc0'],[36,68,'#3c3'],[64,68,'#c3f'],[47,42,'#f90'],[56,57,'#0cc']].map(d=>`<circle cx="${d[0]}" cy="${d[1]}" r="3.4" fill="${d[2]}" stroke="rgba(0,0,0,.25)" stroke-width=".6"/>`).join('');
  else if(o.top)s+=`<text x="50" y="66" font-size="${o.candles&&o.candles!=='0'?26:32}" text-anchor="middle">${TOP[o.top]}</text>`;
  const cc=['#ff5d9e','#4dd0ff','#ffe45c'];
  if(o.candles==='1')s+=candle(50,34,cc[0]);
  if(o.candles==='3')s+=[[34,38],[50,32],[66,38]].map((p,i)=>candle(p[0],p[1],cc[i])).join('');
  return s+'</svg>';
}
let cN,cScore,cTarget,cMine,cDone,cWho;
function cakesInit(){cN=0;cScore=0;cNew()}
function cNew(){
  cTarget={};CK.forEach(r=>cTarget[r.f]=rnd(r.items).k);
  cMine={};cDone=false;cWho=rnd(CUST);
  $('#cBtn').textContent='Entregar ✔';$('#cMsg').textContent='';
  cInfo();custSay('Quero um bolo igual a este!');
  $('#cOrder').innerHTML=cake(cTarget);
  const box=$('#cOpts');box.innerHTML='';
  CK.forEach(({f,label,items})=>{
    const r=document.createElement('div');r.className='orow';r.innerHTML=`<span>${label}</span>`;
    const w=document.createElement('div');w.className='obtns';
    items.forEach(({k,n,ic})=>{
      const b=document.createElement('button');b.className='opt';
      b.innerHTML=`<span class="ic">${ic}</span><span>${n}</span>`;
      b.onclick=()=>{if(cDone)return;cMine[f]=k;[...w.querySelectorAll('.opt')].forEach(x=>x.classList.remove('sel'));b.classList.add('sel');$('#cMine').innerHTML=cake(cMine)};
      w.append(b);
    });
    r.append(w);box.append(r);
  });
  $('#cMine').innerHTML=cake({});
}
function cInfo(){$('#cInfo').textContent=`Pedido ${Math.min(cN+(cDone?0:1),5)}/5 · Acertos: ${cScore} ${'⭐'.repeat(cScore)}`}
function custSay(t,mood){$('#cCust').innerHTML=`<span class="av ${mood||''}">${cWho}</span><span class="bubble">${t}</span>`}
$('#cBtn').onclick=()=>{
  if(cDone){if(cN>=5){cakesInit();return}cNew();return}
  const miss=CK.filter(r=>!cMine[r.f]);
  if(miss.length){$('#cMsg').textContent='Faltou escolher: '+miss.map(r=>r.label.toLowerCase()).join(', ');return}
  const wrong=CK.filter(r=>cMine[r.f]!==cTarget[r.f]).map(r=>r.label.toLowerCase());
  cDone=true;cN++;
  if(!wrong.length){cScore++;$('#cMsg').textContent='🎉 Perfeito! O cliente adorou!';custSay('Perfeito! Muito obrigado! 😍','happy');confetti(30)}
  else{$('#cMsg').textContent='😕 Errou: '+wrong.join(', ');custSay('Hmm... não era bem isso. 😕','sad')}
  cInfo();
  $('#cBtn').textContent=cN>=5?'Jogar de novo':'Próximo pedido ▶';
  if(cN>=5)$('#cMsg').textContent+=` — Fim! Você acertou ${cScore} de 5.`;
};

/* =====================================================
   PURBLE SHOP
   ===================================================== */
const SL=[{n:4,k:4},{n:6,k:5},{n:8,k:6},{n:10,k:7},{n:12,k:7}];
let sN,sK,sSecret,sGuess,sMarks,sTries,sDone;
function shopInit(){
  const L=SL[+$('#sLevel').value]||SL[0];sN=L.n;sK=L.k;
  sSecret=sK===sN?shuf([...Array(sN).keys()]):Array.from({length:sN},()=>Math.floor(Math.random()*sK));
  sGuess=Array(sN).fill(null);sMarks=Array(sN).fill(0);sTries=0;sDone=false;
  $('#sMsg').textContent='Descubra o Purble misterioso! 🎩';$('#sHist').innerHTML='';
  $('#sBtn').textContent='Testar ✔';$('#sChar').classList.remove('win');shopDraw();
}
$('#sLevel').onchange=shopInit;
function shopDraw(){
  const feats=FEAT.slice(0,sN),parts={},ghost=[];
  feats.forEach((f,i)=>{if(sGuess[i]==null)ghost.push(f);else parts[f]=COLS[sGuess[i]]});
  $('#sChar').innerHTML=purble({parts,ghost});
  $('#sTry').textContent=`Tentativas: ${sTries} · ${sN} itens · ${sK} cores`;
  const box=$('#sShelf');box.innerHTML='';box.style.setProperty('--n',sK);box.classList.toggle('dense',sN>8);
  feats.forEach((f,i)=>{
    const r=document.createElement('div');r.className='row';
    r.innerHTML=`<span class="fi" title="${FNAME[f]}">${FICON[f]}</span>`;
    for(let c=0;c<sK;c++){
      const b=document.createElement('button');b.className='cell'+(sGuess[i]===c?' sel':'');
      b.setAttribute('aria-label',`${FNAME[f]} ${CNAME[c]}`);
      b.innerHTML=`<svg viewBox="${VB[f]}" width="100%" height="100%">${PART[f](COLS[c])}</svg>`;
      b.onclick=()=>{if(sDone)return;sGuess[i]=c;sMarks[i]=0;shopDraw()};
      r.append(b);
    }
    const m=document.createElement('span');m.className='mk '+(sMarks[i]===1?'ok':'no');
    m.textContent=['','✔','✖'][sMarks[i]];r.append(m);
    box.append(r);
  });
}
$('#sBtn').onclick=()=>{
  if(sDone){shopInit();return}
  if(sGuess.includes(null)){$('#sMsg').textContent='Escolha uma cor para cada item!';return}
  const left={};
  sMarks=sGuess.map((g,i)=>{if(g===sSecret[i])return 1;left[sSecret[i]]=(left[sSecret[i]]||0)+1;return 0});
  sGuess.forEach((g,i)=>{if(sMarks[i]!==1&&left[g]>0){sMarks[i]=2;left[g]--}});
  sTries++;
  const a=sMarks.filter(m=>m===1).length,b=sMarks.filter(m=>m===2).length;
  $('#sHist').insertAdjacentHTML('afterbegin',`<div class="h"><span class="n">#${sTries}</span>${sGuess.map(g=>`<i style="background:${COLS[g]}"></i>`).join('')}<span class="sc"><b class="ok">✔${a}</b> <b class="no">✖${b}</b></span></div>`);
  if(a===sN){
    sDone=true;$('#sMsg').textContent=`🎉 Você acertou em ${sTries} tentativa(s)!`;$('#sBtn').textContent='Novo jogo';
    $('#sChar').classList.add('win');confetti();
  }else $('#sMsg').textContent='Quase! Ajuste as cores e teste de novo.';
  shopDraw();
};

crewInit();
