const intro = document.querySelector('#intro');
const game = document.querySelector('#game');
const caption = document.querySelector('#intro-caption');
const roomTitle = document.querySelector('#room-title');
const scene = document.querySelector('#scene');
const hotspots = document.querySelector('#hotspots');
const dialogue = document.querySelector('#dialogue-text');
const introPrevious = document.querySelector('#intro-previous');
const introNext = document.querySelector('#intro-next');
const cupboardPuzzle = document.querySelector('#cupboard-puzzle');
const cupboardCode = document.querySelector('#cupboard-code');
const codeFeedback = document.querySelector('#code-feedback');
const cupboardDoor = document.querySelector('#cupboard-door');
const mobileCupboardDoor = document.querySelector('#mobile-cupboard-door');
const bedroomDoor = document.querySelector('#bedroom-door');
const kitchenBedroomDoor = document.querySelector('#kitchen-bedroom-door');
const CUPBOARD_CODE = 'GENUSS';
const INITIAL_DIALOGUE = '„Hmm? Was war das für ein Lärm?“';

const rooms = {
  bedroom: { title: 'Schlafzimmer', actions: [{ id:'finale', label:'Einladung öffnen', x:'35%', y:'40%', text:'„Die Einladung ist da! Der Tag des Koalas kann beginnen!“', finale:true }] },
  kitchen: { title: 'Küche', actions: [] },
  cupboard: { title: 'Im Schrank', actions: [{ id:'back', label:'← Küche', x:'7%', y:'8%', text:'„Zurück in die Küche.“', room:'kitchen' }] },
  cellar: { title: 'Keller', actions: [{ id:'crate', label:'Kisten durchsuchen', x:'20%', y:'53%', text:'Konfetti, Lampions … aber die Einladung fehlt. Ein Pfeil zeigt nach draußen.', clue:'cellar', unlock:'doorstep' }, { id:'back', label:'← Küche', x:'70%', y:'65%', text:'„Zurück in die Küche.“', room:'kitchen' }] },
  doorstep: { title: 'Vor der Tür', actions: [{ id:'mail', label:'Postfach öffnen', x:'23%', y:'43%', text:'Da ist sie: die Einladung! „Trefft euch im Schlafzimmer.“ Schnell zurück!', clue:'doorstep', unlock:'bedroom' }, { id:'back', label:'← Keller', x:'73%', y:'62%', text:'„Zurück in den Keller.“', room:'cellar' }] }
};
let state = JSON.parse(localStorage.getItem('koala-party-state') || '{"intro":false,"room":"bedroom","clues":[]}');
let currentRoom = state.room || 'bedroom';
let introStep = 0;
const introStory = [
  'Koala schlummert gemütlich in ihrem Bett.',
  'RUMMS! Ein lautes Geräusch kommt aus der Küche.',
  'Koala reckt sich, lauscht und blinzelt verschlafen.',
  '„Was war das denn? Ich muss sofort nachsehen!“'
];
const save = () => localStorage.setItem('koala-party-state', JSON.stringify(state));
function showIntro() {
  intro.hidden=false;
  intro.classList.remove('wake', 'fade-out');
  game.hidden=true;
  introStep = 0;
  renderIntroStep();
}
function renderIntroStep(){
  caption.textContent = introStory[introStep];
  intro.classList.toggle('wake', introStep >= 1);
  introPrevious.disabled = introStep === 0;
  introNext.textContent = 'Weiter →';
}
function startGame(){
  intro.hidden=true;
  game.hidden=false;
  state.intro=true;
  state.room='bedroom';
  currentRoom='bedroom';
  dialogue.textContent=INITIAL_DIALOGUE;
  save();
  render();
}
function render(){
  const room=rooms[currentRoom]; scene.className=`scene ${currentRoom}${state.finished ? ' celebration' : ''}${state.cupboardUnlocked ? ' letter-found' : ''}`; scene.setAttribute('aria-label',`${room.title}-Szene`); roomTitle.textContent=currentRoom === 'cupboard' && state.cupboardUnlocked ? 'Der Brief' : room.title;
  hotspots.innerHTML=''; room.actions.forEach(action=>{ if((state.finished && !action.alwaysAvailable) || (!action.alwaysAvailable && (state.clues.includes(action.id) || state.completedActions?.includes(action.id))) || (action.finale && state.clues.length < 3))return; const b=document.createElement('button'); b.className=`hotspot${action.id === 'cupboard' ? ' hotspot-cupboard' : ''}`; b.dataset.action=action.id; b.textContent=action.label; b.style.left=action.x;b.style.top=action.y;b.addEventListener('click',()=>interact(action)); hotspots.appendChild(b); });
  cupboardPuzzle.hidden = currentRoom !== 'cupboard' || Boolean(state.cupboardUnlocked);
  if (!cupboardPuzzle.hidden) { cupboardCode.value=''; codeFeedback.textContent=''; }
  if (currentRoom === 'bedroom' && state.clues.length === 0 && !state.cupboardUnlocked && !state.finished) dialogue.textContent=INITIAL_DIALOGUE;
}
function interact(action){
 dialogue.textContent=action.text;
 if(action.finale){ state.finished=true; save(); window.location.assign('finale/'); return; }
 if(action.clue && !state.clues.includes(action.clue)){state.clues.push(action.clue);}
 if(action.complete){ state.completedActions ??= []; if(!state.completedActions.includes(action.complete)) state.completedActions.push(action.complete); }
 if(action.unlock){
   const target=action.unlock;
   currentRoom=target;
   state.room=target;
   save();
   render();
   if(target === 'kitchen') dialogue.textContent='„Huch! Kleine Pfotenabdrücke führen direkt zum Schrank.“';
   else if(target === 'cupboard') dialogue.textContent='„Zwischen den Vorräten duckt sich eine kleine Kiste. Ihr Schloss blinzelt mich geheimnisvoll an.“';
   else if(target === 'bedroom' && state.clues.length===3) dialogue.textContent='Die Party kann beginnen! Die Küche klappert vor Vorfreude …';
 }
 else if(action.room){currentRoom=action.room;state.room=action.room;save();render();}
 else {save();render();}
}
function openCupboard(){
  if(currentRoom !== 'kitchen') return;
  state.completedActions ??= [];
  if(!state.completedActions.includes('cupboard')) state.completedActions.push('cupboard');
  if(!state.clues.includes('kitchen')) state.clues.push('kitchen');
  currentRoom='cupboard';
  state.room='cupboard';
  save();
  render();
  dialogue.textContent='„Zwischen den Vorräten duckt sich eine kleine Kiste. Ihr Schloss blinzelt mich geheimnisvoll an.“';
}
function enterKitchen(){
  if(currentRoom !== 'bedroom') return;
  currentRoom='kitchen';
  state.room='kitchen';
  save();
  render();
  dialogue.textContent='„Huch! Kleine Pfotenabdrücke führen direkt zum Schrank.“';
}
function enterBedroom(){
  if(currentRoom !== 'kitchen') return;
  currentRoom='bedroom';
  state.room='bedroom';
  save();
  render();
  dialogue.textContent='„Zurück im Schlafzimmer.“';
}
introPrevious.addEventListener('click',()=>{ if(introStep > 0){ introStep--; renderIntroStep(); } });
introNext.addEventListener('click',()=>{ if(introStep === introStory.length - 1) startGame(); else { introStep++; renderIntroStep(); } });
cupboardPuzzle.addEventListener('submit',(event)=>{
  event.preventDefault();
  if(cupboardCode.value.trim().toLocaleUpperCase('de-DE') === CUPBOARD_CODE){
    state.cupboardUnlocked=true;
    save();
    render();
    dialogue.textContent='„Ein Brief! Er spricht von Träumen und einem Schatten …“';
  } else {
    codeFeedback.textContent='Das Schloss bleibt zu.';
    cupboardCode.select();
  }
});
cupboardDoor.addEventListener('click',openCupboard);
mobileCupboardDoor.addEventListener('click',openCupboard);
bedroomDoor.addEventListener('click',enterKitchen);
kitchenBedroomDoor.addEventListener('click',enterBedroom);
document.querySelector('#restart').addEventListener('click',()=>{
  state={intro:false,room:'bedroom',clues:[],completedActions:[],cupboardUnlocked:false,finished:false};
  currentRoom='bedroom';
  dialogue.textContent=INITIAL_DIALOGUE;
  save();
  intro.classList.remove('wake');
  showIntro();
});
state.intro ? (intro.hidden=true,game.hidden=false,render()) : showIntro();
