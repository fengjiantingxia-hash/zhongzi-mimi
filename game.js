(()=>{
const A='assets/';
const L=[
 {id:1,t:'种子找到长大的家',i:'🌻',d:'把四颗种子送到它长成的植物下面，再提交。',bg:'bg-field.webp',r:match,c:checkMatch},
 {id:2,t:'萌发能量站',i:'💧',d:'选出种子萌发需要的三个条件，再提交。',bg:'bg-germinate.webp',r:conditions,c:checkConditions},
 {id:3,t:'绿豆观察员',i:'🔍',d:'找出已经冒出短白芽的绿豆，全部选好再提交。',bg:'bg-observe.webp',r:mung,c:checkMung},
 {id:4,t:'播种小能手',i:'🪴',d:'把四个种植步骤放进正确的位置，再提交。',bg:'bg-plant.webp',r:order,c:checkOrder},
 {id:5,t:'爱惜小达人',i:'🥣',d:'选出珍惜粮食、爱护植物的做法，再提交。',bg:'bg-story.webp',r:behavior,c:checkBehavior}
];
const $=s=>document.querySelector(s),menu=$('#menu'),game=$('#game'),grid=$('#levels'),play=$('#play'),fb=$('#feedback'),modal=$('#modal');
let cur=1,sel=null,sound=true,audio;
const done=new Set(JSON.parse(localStorage.getItem('seedSecretDone')||'[]'));

function init(){menuCards();stars();$('#home').style.visibility='hidden';$('#home').onclick=showMenu;$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'🔊':'🔇';tone('click')};$('#reset').onclick=()=>open(cur);$('#submit').onclick=()=>L[cur-1].c();$('#choose').onclick=()=>{modal.classList.add('hidden');showMenu()};$('#again').onclick=()=>{modal.classList.add('hidden');open(cur)};$('#next').onclick=()=>{modal.classList.add('hidden');open(cur===5?1:cur+1)}}
function menuCards(){grid.innerHTML=L.map(x=>`<button class="level-card ${done.has(x.id)?'done':''}" data-id="${x.id}"><span class="tick">✓</span><span class="num">${x.id}</span><span class="emo">${x.i}</span><h3>${x.t}</h3><p>${x.d}</p></button>`).join('');grid.querySelectorAll('button').forEach(b=>b.onclick=()=>{tone('click');open(+b.dataset.id)})}
function stars(){$('#stars').innerHTML=L.map(x=>`<span class="star ${done.has(x.id)?'on':''}">★</span>`).join('')}
function showMenu(){tone('click');menu.classList.remove('hidden');game.classList.add('hidden');$('#home').style.visibility='hidden';menuCards();stars()}
function open(id){cur=id;sel=null;const x=L[id-1];menu.classList.add('hidden');game.classList.remove('hidden');game.style.backgroundImage=`linear-gradient(#20392b44,#20392b55),url("${A+x.bg}")`;$('#home').style.visibility='visible';$('#levelIcon').textContent=x.i;$('#levelTitle').textContent=`第${id}关  ${x.t}`;$('#instruction').textContent=x.d;feedback('完成后点击提交答案','');x.r()}
function feedback(t,k){fb.textContent=t;fb.className='feedback '+(k||'')}
function success(t){done.add(cur);localStorage.setItem('seedSecretDone',JSON.stringify([...done]));stars();tone('success');burst();$('#modalText').textContent=t;$('#next').textContent=cur===5?'回到第一关':'下一关';setTimeout(()=>modal.classList.remove('hidden'),400)}
function fail(t){tone('error');feedback(t,'bad')}

function P(k,img,label){return `<button class="piece" draggable="true" data-key="${k}" aria-label="${label}"><img src="${A+img}" alt=""><span>${label}</span></button>`}
function wire(homeId,slotSel){const home=document.getElementById(homeId);play.querySelectorAll('.piece').forEach(p=>{p.dataset.home=homeId;p.ondragstart=e=>{sel=p;e.dataTransfer.setData('text/plain',p.dataset.key)};p.onclick=e=>{e.stopPropagation();select(p)}});play.querySelectorAll(slotSel).forEach(s=>{s.tabIndex=0;s.ondragover=e=>e.preventDefault();s.ondrop=e=>{e.preventDefault();if(sel)place(sel,s)};s.onclick=()=>{if(sel)place(sel,s)};s.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&sel)place(sel,s)}});home.onclick=()=>{if(sel){back(sel);clear()}}}
function select(p){play.querySelectorAll('.piece.sel').forEach(x=>x.classList.remove('sel'));sel=p;p.classList.add('sel');tone('click')}
function place(p,s){const old=s.querySelector('.piece');if(old&&old!==p)back(old);s.appendChild(p);p.classList.add('placed');clear();tone('place')}
function back(p){const h=document.getElementById(p.dataset.home);if(h){h.appendChild(p);p.classList.remove('placed')}}
function clear(){play.querySelectorAll('.piece.sel').forEach(x=>x.classList.remove('sel'));sel=null}

function T(k,img,l){return `<div class="target"><img src="${A+img}" alt=""><h4>${l}</h4><div class="slot" data-key="${k}">把种子放这里</div></div>`}
function match(){const s=shuffle([['sunflower','seed-sunflower.webp','葵花籽'],['pea','seed-pea.webp','豌豆'],['peanut','seed-peanut.webp','花生'],['corn','seed-corn.webp','玉米粒']]);play.innerHTML=`<div class="title">先选择或拖动一颗种子</div><div class="bank" id="seedBank">${s.map(x=>P(...x)).join('')}</div><div class="match">${T('pea','plant-pea.webp','豌豆藤')}${T('corn','plant-corn.webp','玉米')}${T('sunflower','plant-sunflower.webp','向日葵')}${T('peanut','plant-peanut.webp','花生植株')}</div>`;wire('seedBank','.slot')}
function checkMatch(){const s=[...play.querySelectorAll('.slot')];if(s.some(x=>!x.querySelector('.piece')))return fail('还有植物没有找到种子哦！');let ok=true;s.forEach(x=>{const r=x.querySelector('.piece').dataset.key===x.dataset.key;x.classList.toggle('right',r);if(!r){ok=false;x.classList.add('wrong');setTimeout(()=>{const p=x.querySelector('.piece');if(p)back(p);x.classList.remove('wrong')},600)}});ok?success('四颗种子都找到了长大后的植物！'):fail('有种子走错家了，再观察植物的果实。')}

function C(k,img,l){return `<button class="choice" data-key="${k}"><span class="dot">✓</span><img src="${A+img}" alt=""><h3>${l}</h3></button>`}
function bind(q){play.querySelectorAll(q).forEach(x=>x.onclick=()=>{x.classList.toggle('selected');tone('click')})}
function exact(q,a){const p=[...play.querySelectorAll(q+'.selected')].map(x=>x.dataset.key);return p.length===a.length&&a.every(x=>p.includes(x))}
function conditions(){const d=shuffle([['water','condition-water.webp','水'],['air','condition-air.webp','空气'],['warm','condition-warm.webp','适宜的温暖'],['soil','condition-soil.webp','泥土']]);play.innerHTML=`<p class="note">种子萌发需要水、空气和适宜的温度。请选出三个。</p><div class="choices">${d.map(x=>C(...x)).join('')}</div>`;bind('.choice')}
function checkConditions(){exact('.choice',['water','air','warm'])?success('你找到了种子萌发的三个必要条件！'):fail('再想想：水、空气，还有适宜的温度。')}

function mung(){const a=shuffle(['sprout','dry','sprout','dry','sprout','dry']);play.innerHTML=`<p class="note">仔细看：短短的白芽从绿豆里钻出来了。</p><div class="mungs">${a.map((k,i)=>`<button class="mung" data-key="${k}"><img src="${A+(k==='sprout'?'mung-sprout.webp':'mung-dry.webp')}" alt="" style="transform:rotate(${(i-2)*2}deg)"></button>`).join('')}</div>`;bind('.mung')}
function checkMung(){const s=[...play.querySelectorAll('.mung.selected')],all=[...play.querySelectorAll('.mung[data-key="sprout"]')];s.length===all.length&&s.every(x=>x.dataset.key==='sprout')?success('你找到了所有冒出短白芽的绿豆！'):fail('要选“已经长出短白芽”的绿豆，再观察一次。')}

function order(){const a=shuffle([['pot','step-pot.webp','准备花盆和松土'],['hole','step-hole.webp','挖一个浅洞'],['seed','step-seed.webp','轻轻放入种子'],['water','step-water.webp','浇少量水']]);play.innerHTML=`<div class="title">把步骤放进下面四个位置</div><div class="bank" id="stepBank">${a.map(x=>P(...x)).join('')}</div><div class="order">${['pot','hole','seed','water'].map((k,i)=>`<div class="order-slot" data-key="${k}" data-icon="${['🪴','🥄','🌰','💧'][i]}"></div>`).join('')}</div>`;wire('stepBank','.order-slot')}
function checkOrder(){const s=[...play.querySelectorAll('.order-slot')];if(s.some(x=>!x.querySelector('.piece')))return fail('还有步骤没有放好哦！');let ok=true;s.forEach(x=>{if(x.querySelector('.piece').dataset.key!==x.dataset.key){ok=false;x.classList.add('wrong');setTimeout(()=>{const p=x.querySelector('.piece');if(p)back(p);x.classList.remove('wrong')},600)}});ok?success('准备花盆、挖浅洞、放种子、少量浇水，顺序正确！'):fail('顺序需要调整，再想想播种时先做什么。')}

function behavior(){const a=[['finish','🥣','吃多少盛多少','把碗里的食物认真吃完'],['care','🪴','轻轻照料幼苗','只浇适量的水'],['waste','🍚','盛很多却剩下','食物没有被珍惜'],['flood','🌊','一次浇很多水','花盆里积了太多水']];play.innerHTML=`<p class="note">请选择两个值得学习的做法。</p><div class="behaviors">${a.map(x=>`<button class="behavior" data-key="${x[0]}"><div class="art">${x[1]}</div><h3>${x[2]}</h3><p>${x[3]}</p></button>`).join('')}</div>`;bind('.behavior')}
function checkBehavior(){exact('.behavior',['finish','care'])?success('你会珍惜粮食，也会轻轻爱护小幼苗！'):fail('再看看：食物要珍惜，幼苗要适量浇水。')}

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function tone(k){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const n=audio.currentTime,notes=k==='success'?[523,659,784]:k==='error'?[260,190]:k==='place'?[420]:[330];notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=k==='error'?'sawtooth':'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,n+i*.11);g.gain.exponentialRampToValueAtTime(k==='success'?.16:.08,n+i*.11+.02);g.gain.exponentialRampToValueAtTime(.0001,n+i*.11+.18);o.connect(g).connect(audio.destination);o.start(n+i*.11);o.stop(n+i*.11+.2)})}catch(e){}}
function burst(){const c=$('#confetti'),colors=['#f6c34f','#78aa61','#ed805c','#75a9d1','#fff1a5'];c.innerHTML='';for(let i=0;i<55;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=colors[i%colors.length];p.style.animationDelay=Math.random()*.45+'s';c.appendChild(p)}setTimeout(()=>c.innerHTML='',2400)}
init();
})();
