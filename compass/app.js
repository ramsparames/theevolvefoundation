const QUESTIONS = [
  {
    key:"interests",
    text:"What kinds of things naturally pull you in?",
    hint:"Pick up to 4. There is no better answer.",
    max:4,
    options:["Solving problems","Making or building things","Understanding how things work","Creating or expressing myself","Working with people","Helping others","Organising things","Leading or taking charge","Performing or presenting","Learning something new","Sport or physical activity","Exploring how things work in the real world","Something else"]
  },
  {
    key:"absorption",
    text:"Think of something you did recently where you lost track of time. What pulled you in?",
    hint:"Pick what feels closest.",
    max:1,
    options:["Figuring something out","Creating something","The challenge","Learning something new","Working with other people","Helping someone","Having the freedom to do it my way","Seeing a result","Competition","Being curious about how something works","Something else"],
    followup:"What were you doing?"
  },
  {
    key:"strengths",
    text:"What do people tend to come to you for?",
    hint:"Pick up to 3.",
    max:3,
    options:["Explaining things","Solving problems","Listening","Coming up with ideas","Organising","Bringing people together","Taking charge","Making things work","Writing or communicating","Staying calm when things get difficult","Learning quickly","Something else"],
    followup:"Can you think of one example?"
  },
  {
    key:"meaning",
    text:"When you imagine doing something you're proud of, what would you most like it to involve?",
    hint:"Pick up to 3.",
    max:3,
    options:["Solving something that matters","Creating something people can use","Helping or improving someone's life","Working with people","Having independence","Making a visible difference","Learning and becoming better at something","Building something of my own","Being part of something bigger","Having a challenge that keeps me engaged","Being recognised for doing something well","I'm not sure yet"]
  },
  {
    key:"future",
    text:"When you think about your future, what feels important to you?",
    hint:"Pick up to 4. It is completely okay to be unsure.",
    max:4,
    options:["Keep learning","Have interesting problems to solve","Have freedom and independence","Work with good people","Have stability","Build something","Help people","Have variety","Become really good at something","Have opportunities to grow","Have a life beyond work too","I'm genuinely not sure yet"]
  }
];

const KEY = "evolveCompassSlice1";
const state = {
  step: "welcome",
  index: 0,
  answers: JSON.parse(localStorage.getItem(KEY) || "{}"),
  name: "",
  email: ""
};

const views = {
  welcome: document.getElementById("welcomeView"),
  question: document.getElementById("questionView"),
  reflection: document.getElementById("reflectionView"),
  auth: document.getElementById("authView"),
  continue: document.getElementById("continueView"),
  step2: document.getElementById("step2PreviewView")
};

function persist(){ localStorage.setItem(KEY, JSON.stringify(state.answers)); }
function show(view){
  Object.values(views).forEach(v=>v.classList.remove("active"));
  views[view].classList.add("active");
  window.scrollTo({top:0,behavior:"instant"});
  state.step=view;
}
function selectedFor(q){
  return Array.isArray(state.answers[q.key]) ? state.answers[q.key] : [];
}
function renderQuestion(){
  const q=QUESTIONS[state.index];
  document.getElementById("sectionLabel").textContent="01 KNOW ME";
  document.getElementById("progressText").textContent=`Question ${state.index+1} of ${QUESTIONS.length}`;
  document.getElementById("progressBar").style.width=`${((state.index+1)/QUESTIONS.length)*100}%`;
  document.getElementById("questionText").textContent=q.text;
  document.getElementById("questionHint").textContent=q.hint;
  const list=document.getElementById("optionList"); list.innerHTML="";
  const chosen=selectedFor(q);
  q.options.forEach((label,i)=>{
    const b=document.createElement("button");
    b.type="button"; b.className="option";
    b.innerHTML=`<span class="option-key">${String.fromCharCode(65+i)}</span><span class="option-text"></span>`;
    b.querySelector(".option-text").textContent=label;
    if(chosen.includes(i)) b.classList.add("selected");
    b.addEventListener("click",()=>{
      let current=selectedFor(q).slice();
      if(q.max===1){ current=[i]; }
      else if(current.includes(i)){ current=current.filter(x=>x!==i); }
      else if(current.length<q.max){ current.push(i); }
      else { current.shift(); current.push(i); }
      state.answers[q.key]=current; persist(); renderQuestion();
    });
    list.appendChild(b);
  });
  const follow=document.getElementById("textFollowup");
  const input=document.getElementById("followupInput");
  if(q.followup){ follow.classList.remove("hidden"); document.getElementById("followupLabel").textContent=q.followup; input.value=state.answers[q.key+"_example"]||""; }
  else { follow.classList.add("hidden"); input.value=""; }
  document.getElementById("backBtn").hidden=state.index===0;
  document.getElementById("nextBtn").textContent=state.index===QUESTIONS.length-1?"See my reflection →":"Next →";
  document.getElementById("questionError").textContent="";
}
function validQuestion(){
  const q=QUESTIONS[state.index];
  return selectedFor(q).length>0;
}
function buildReflection(){
  const a=state.answers;
  const interests=(a.interests||[]).map(i=>QUESTIONS[0].options[i]);
  const absorption=(a.absorption||[]).map(i=>QUESTIONS[1].options[i]);
  const strengths=(a.strengths||[]).map(i=>QUESTIONS[2].options[i]);
  const meaning=(a.meaning||[]).map(i=>QUESTIONS[3].options[i]);
  const future=(a.future||[]).map(i=>QUESTIONS[4].options[i]);

  const energy = interests.length ? interests.slice(0,3).join(", ") : "curiosity and exploration";
  const bring = strengths.length ? strengths.slice(0,2).join(" and ") : "different strengths";
  const matters = [...meaning.slice(0,2), ...future.slice(0,2)].filter(Boolean).slice(0,3);
  const matterText = matters.length ? matters.join(", ") : "what feels meaningful and worthwhile";

  document.getElementById("energyTitle").textContent=energy;
  document.getElementById("energyCopy").textContent="You seem to be drawn towards activities that give you something to solve, make, understand or experience.";
  document.getElementById("bringTitle").textContent=bring;
  document.getElementById("bringCopy").textContent="These are the things people may already notice in you. The examples you gave are more useful than a label.";
  document.getElementById("matterTitle").textContent=matterText;
  document.getElementById("matterCopy").textContent="These signals give you something to pay attention to when you start thinking about courses and colleges.";

  let notice="You do not need to turn an interest into a career decision yet. When you compare colleges, look for experiences that let you test what matters to you.";
  if(future.includes("Have freedom and independence") && strengths.includes("Working with people")) notice="You seem to value both independence and working with people. When you evaluate colleges, it may be worth looking for an environment that gives you both.";
  else if(meaning.includes("Keep learning") || future.includes("Keep learning")) notice="Learning seems to matter to you. When you compare courses, look beyond the course title and ask how much room there is to explore, build and keep learning.";
  else if(future.includes("Have stability")) notice="Stability seems important to you. As you explore options, it may be useful to separate what you know from what you have simply heard about a course or college.";
  document.getElementById("noticeCopy").textContent=notice;
}
function start(){
  state.index=0;
  show("question");
  renderQuestion();
}
document.getElementById("startBtn").addEventListener("click",start);
document.getElementById("resumeBtn").addEventListener("click",()=>{
  const has=Object.keys(state.answers).length>0;
  if(has){ state.index=0; show("question"); renderQuestion(); } else start();
});
document.getElementById("backBtn").addEventListener("click",()=>{
  if(state.index>0){ state.index--; renderQuestion(); }
});
document.getElementById("nextBtn").addEventListener("click",()=>{
  const q=QUESTIONS[state.index];
  if(!validQuestion()){ document.getElementById("questionError").textContent="Choose at least one response to continue."; return; }
  if(q.followup){ state.answers[q.key+"_example"]=document.getElementById("followupInput").value.trim(); persist(); }
  if(state.index<QUESTIONS.length-1){ state.index++; renderQuestion(); }
  else { buildReflection(); show("reflection"); }
});
document.getElementById("continueBtn").addEventListener("click",()=>show("auth"));
document.getElementById("backToReflection").addEventListener("click",()=>show("reflection"));
document.getElementById("authForm").addEventListener("submit",async(e)=>{
  e.preventDefault();
  const btn=e.currentTarget.querySelector("button");
  const status=document.getElementById("authStatus");
  state.name=document.getElementById("nameInput").value.trim();
  state.email=document.getElementById("emailInput").value.trim();
  btn.disabled=true; status.textContent="Saving your Compass…";
  try{
    const r=await fetch("../api/compass/request-link",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      email:state.email,name:state.name,answers:state.answers
    })});
    const payload=await r.json();
    if(!r.ok||!payload.ok) throw new Error(payload.message||"We could not save your Compass just now.");
    document.getElementById("continueMessage").textContent=`We sent a secure link to ${state.email}. You can close this page and come back whenever you're ready.`;
    show("continue");
  }catch(err){
    status.textContent=err.message||"We could not save your Compass just now.";
  }finally{btn.disabled=false;}
});
function init(){
  // If a saved session exists locally, offer a resume path. The authenticated
  // server-backed resume is completed by the magic-link endpoint in V1.
  if(Object.keys(state.answers).length){ document.getElementById("resumeBtn").textContent="Continue my Compass"; }
}
init();