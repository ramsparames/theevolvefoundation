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

function persist(){
  localStorage.setItem(KEY, JSON.stringify(state.answers));
}

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

  const list=document.getElementById("optionList");
  list.innerHTML="";

  const chosen=selectedFor(q);

  q.options.forEach((label,i)=>{
    const b=document.createElement("button");

    b.type="button";
    b.className="option";

    b.innerHTML=`<span class="option-key">${String.fromCharCode(65+i)}</span><span class="option-text"></span>`;

    b.querySelector(".option-text").textContent=label;

    if(chosen.includes(i)){
      b.classList.add("selected");
    }

    b.addEventListener("click",()=>{
      let current=selectedFor(q).slice();

      if(q.max===1){
        current=[i];
      }
      else if(current.includes(i)){
        current=current.filter(x=>x!==i);
      }
      else if(current.length<q.max){
        current.push(i);
      }
      else{
        current.shift();
        current.push(i);
      }

      state.answers[q.key]=current;
      persist();
      renderQuestion();
    });

    list.appendChild(b);
  });

  const follow=document.getElementById("textFollowup");
  const input=document.getElementById("followupInput");

  if(q.followup){
    follow.classList.remove("hidden");
    document.getElementById("followupLabel").textContent=q.followup;
    input.value=state.answers[q.key+"_example"]||"";
  }
  else{
    follow.classList.add("hidden");
    input.value="";
  }

  document.getElementById("backBtn").hidden=state.index===0;

  document.getElementById("nextBtn").textContent=
    state.index===QUESTIONS.length-1
      ?"See my reflection →"
      :"Next →";

  document.getElementById("questionError").textContent="";
}


/* -------------------------------------------------------
   COMPASS REFLECTION PATTERN LIBRARY
   ------------------------------------------------------- */

const REFLECTION_PATTERNS = {

  energy: [

    {
      id:"figuring",
      signals:[
        "Solving problems",
        "Understanding how things work",
        "Figuring something out",
        "Being curious about how something works"
      ],
      title:"Figuring things out",
      templates:[
        "You seem to enjoy figuring things out. There is something about working through a question and getting to the answer that pulls you in.",
        "You seem to enjoy having something to work out. The process of understanding how something works appears to be part of the fun for you.",
        "A lot of your answers come back to curiosity and problem solving. You seem to enjoy getting stuck into something and working it out."
      ]
    },

    {
      id:"creating",
      signals:[
        "Making or building things",
        "Creating or expressing myself",
        "Creating something",
        "Creating something people can use",
        "Build something",
        "Building something of my own"
      ],
      title:"Creating and making",
      templates:[
        "You seem to enjoy creating things and seeing an idea take shape.",
        "There is a clear interest in making things. It seems to matter to you that an idea can become something real.",
        "You seem to get something out of creating rather than just thinking about an idea."
      ]
    },

    {
      id:"people",
      signals:[
        "Working with people",
        "Helping others",
        "Working with other people",
        "Listening",
        "Bringing people together"
      ],
      title:"People and connection",
      templates:[
        "People seem to be an important part of what draws you in. You seem to enjoy doing things with others rather than always working on your own.",
        "Several of your answers involve people. You seem to get energy from working with others and being useful to them.",
        "You seem to enjoy the human side of things. Working with people, helping and being part of something together all show up in your answers."
      ]
    },

    {
      id:"challenge",
      signals:[
        "The challenge",
        "Competition",
        "Seeing a result",
        "Having a challenge that keeps me engaged",
        "Being recognised for doing something well"
      ],
      title:"Challenge and achievement",
      templates:[
        "You seem to enjoy having something to work towards. A challenge and a visible result both seem to keep you interested.",
        "You seem to like a challenge when there is something meaningful to work towards.",
        "Doing something well seems to matter to you. You appear to enjoy situations where you can stretch yourself and see the result."
      ]
    },

    {
      id:"learning",
      signals:[
        "Learning something new",
        "Being curious about how something works",
        "Exploring how things work in the real world",
        "Keep learning",
        "Have opportunities to grow"
      ],
      title:"Learning and exploring",
      templates:[
        "You seem to enjoy learning simply because there is something new to discover.",
        "Curiosity comes through in several of your answers. You seem to want room to keep learning rather than feel like you have everything figured out.",
        "Learning and exploring seem to be important parts of what keeps you interested."
      ]
    },

    {
      id:"independence",
      signals:[
        "Having the freedom to do it my way",
        "Having independence",
        "Freedom and independence"
      ],
      title:"Freedom to find your own way",
      templates:[
        "Having some freedom to do things your own way seems important to you.",
        "You seem to value having room to make your own choices and find your own way of doing things.",
        "Independence comes through in your answers. You seem to want enough freedom to make the experience your own."
      ]
    }

  ],

  bring: {

    "Explaining things":[
      "People seem to come to you when they need something explained clearly. That is a useful strength to already recognise in yourself.",
      "People seem to trust you to make things easier to understand. Your example gives that strength some real context."
    ],

    "Solving problems":[
      "People seem to rely on you when something needs to be worked out.",
      "You seem to be someone people turn to when there is a problem that needs solving."
    ],

    "Listening":[
      "People seem to feel comfortable coming to you and being heard.",
      "Listening seems to be something you bring to the people around you. That can be more valuable than it sounds."
    ],

    "Coming up with ideas":[
      "People seem to come to you when they need a different idea or another way of looking at something.",
      "You seem to enjoy thinking of possibilities and finding a way forward when the obvious answer is not enough."
    ],

    "Organising":[
      "People seem to trust you to bring some order to things.",
      "You seem to be someone who can take a lot of moving pieces and work out what needs to happen next."
    ],

    "Bringing people together":[
      "You seem to have a knack for bringing people together and getting things moving.",
      "People and collaboration show up in what others seem to come to you for."
    ],

    "Taking charge":[
      "People seem to trust you to step up when something needs to happen.",
      "Taking responsibility seems to be something you are already comfortable with."
    ],

    "Making things work":[
      "People seem to come to you when something needs to actually get done.",
      "You seem to enjoy taking an idea or a problem and working out how to make it work in practice."
    ],

    "Writing or communicating":[
      "People seem to value the way you communicate and put things into words.",
      "You seem to bring clarity when something needs to be explained or communicated well."
    ],

    "Staying calm when things get difficult":[
      "Staying calm when things get difficult seems to be something you bring to a situation.",
      "People may value having you around when things become a little complicated."
    ],

    "Learning quickly":[
      "You seem to pick things up quickly when something catches your interest.",
      "Learning quickly appears to be something you already recognise as a strength."
    ]

  },

  values: [

    {
      id:"learning",
      title:"Learning and growth",
      signals:[
        "Learning and becoming better at something",
        "Keep learning",
        "Have opportunities to grow",
        "Become really good at something"
      ],
      templates:[
        "Learning and growth seem to matter to you. You may want a college experience where there is room to keep getting better at something that interests you.",
        "You seem to want a future where you are still learning and growing rather than simply doing the same thing year after year."
      ]
    },

    {
      id:"independence",
      title:"Independence",
      signals:[
        "Having independence",
        "Freedom and independence"
      ],
      templates:[
        "Having some independence seems important to you. You may want an environment where you have room to make choices and find your own way.",
        "You seem to value having a say in how you spend your time and what you explore."
      ]
    },

    {
      id:"impact",
      title:"Making a difference",
      signals:[
        "Solving something that matters",
        "Helping or improving someone's life",
        "Making a visible difference",
        "Being part of something bigger",
        "Help people"
      ],
      templates:[
        "Doing something that matters to other people seems important to you.",
        "Making a difference appears to be part of what would make your future feel worthwhile."
      ]
    },

    {
      id:"stability",
      title:"Stability",
      signals:[
        "Have stability"
      ],
      templates:[
        "Stability seems to matter to you. That is worth keeping in mind when you start comparing courses and colleges.",
        "Having some sense of security seems important to you. You may want to look beyond the course name and understand what each option could actually offer you."
      ]
    },

    {
      id:"variety",
      title:"Variety",
      signals:[
        "Have variety"
      ],
      templates:[
        "You seem to want variety in your future. Having different things to learn, try and work on may be important to you.",
        "A future that gives you different experiences seems to appeal to you."
      ]
    },

    {
      id:"people",
      title:"The people around you",
      signals:[
        "Work with good people",
        "Working with people",
        "Help people",
        "Helping or improving someone's life"
      ],
      templates:[
        "The people around you seem to matter quite a lot. You may want to pay attention to the kind of community you would be joining, not just the course itself.",
        "You seem to care about who you will learn and work alongside."
      ]
    },

    {
      id:"building",
      title:"Building things",
      signals:[
        "Build something",
        "Building something of my own",
        "Creating something people can use"
      ],
      templates:[
        "Building something seems to matter to you. You may enjoy an environment where you can take an idea and turn it into something real.",
        "You seem to want to create rather than simply consume what is already there."
      ]
    },

    {
      id:"life",
      title:"A life beyond work",
      signals:[
        "Have a life beyond work too"
      ],
      templates:[
        "You seem to care about having a life beyond work as well. That is worth remembering when you think about the kind of future you want.",
        "A good future for you may not be only about what you do. How you want to live seems to matter too."
      ]
    }

  ]

};


const CROSS_PATTERNS = [

  {
    id:"peopleImpact",
    signals:[
      "Working with people",
      "Helping others",
      "Working with other people",
      "Helping or improving someone's life",
      "Making a visible difference",
      "Help people"
    ],
    minMatches:3,
    text:"People show up in several of your answers. It seems that working with others and doing something useful for them may be connected for you."
  },

  {
    id:"creatingResults",
    signals:[
      "Making or building things",
      "Creating or expressing myself",
      "Creating something",
      "Seeing a result",
      "Creating something people can use",
      "Build something",
      "Building something of my own"
    ],
    minMatches:3,
    text:"There is a recurring thread of making things in your answers. You seem to enjoy seeing an idea become something real."
  },

  {
    id:"challengeMastery",
    signals:[
      "The challenge",
      "Competition",
      "Become really good at something",
      "Having a challenge that keeps me engaged",
      "Being recognised for doing something well"
    ],
    minMatches:3,
    text:"Challenge and getting better seem to go together for you. You may enjoy environments where there is something difficult to work towards."
  },

  {
    id:"curiosityLearning",
    signals:[
      "Understanding how things work",
      "Learning something new",
      "Being curious about how things work",
      "Keep learning",
      "Have opportunities to grow"
    ],
    minMatches:3,
    text:"Curiosity and learning come through in several of your answers. You seem to want room to explore rather than feel like you have to know everything from the start."
  },

  {
    id:"independenceVariety",
    signals:[
      "Having independence",
      "Having the freedom to do it my way",
      "Freedom and independence",
      "Have variety"
    ],
    minMatches:2,
    text:"You seem to value both freedom and variety. When you compare colleges, it may be worth finding out how much choice students actually have in what they study and experience."
  },

  {
    id:"peopleCommunication",
    signals:[
      "Working with people",
      "Working with other people",
      "Explaining things",
      "Writing or communicating",
      "Bringing people together"
    ],
    minMatches:3,
    text:"A lot of your answers involve people and communication. You seem to enjoy situations where ideas move between people rather than staying with you alone."
  },

  {
    id:"meaningLearning",
    signals:[
      "Solving something that matters",
      "Helping or improving someone's life",
      "Learning and becoming better at something",
      "Keep learning",
      "Have opportunities to grow"
    ],
    minMatches:3,
    text:"You seem to want both meaning and growth. It may be important for you to find something that keeps you learning while also feeling worthwhile."
  },

  {
    id:"independencePeople",
    signals:[
      "Having independence",
      "Having the freedom to do it my way",
      "Freedom and independence",
      "Working with people",
      "Working with other people"
    ],
    minMatches:2,
    text:"Something interesting comes through in your answers. You seem to value having independence while also wanting people around you. Your ideal environment may need room for both."
  }

];


/* -------------------------------------------------------
   REFLECTION HELPERS
   ------------------------------------------------------- */

function answerLabels(key){
  const question=QUESTIONS.find(item=>item.key===key);

  return (state.answers[key]||[])
    .map(i=>question.options[i])
    .filter(Boolean);
}

function patternMatches(pattern, labels){
  return labels.filter(label=>pattern.signals.includes(label)).length;
}

function chooseTemplate(templates, seed){
  return templates[seed % templates.length];
}


/* -------------------------------------------------------
   BUILD FIRST COMPASS REFLECTION
   ------------------------------------------------------- */

function buildReflection(){

  const interests=answerLabels("interests");
  const absorption=answerLabels("absorption");
  const strengths=answerLabels("strengths");
  const meaning=answerLabels("meaning");
  const future=answerLabels("future");

  const energyLabels=[
    ...interests,
    ...absorption
  ];

  const valueLabels=[
    ...meaning,
    ...future
  ];

  const allLabels=[
    ...interests,
    ...absorption,
    ...strengths,
    ...meaning,
    ...future
  ];


  /* ENERGY */

  const energyRanked=REFLECTION_PATTERNS.energy
    .map(pattern=>({
      ...pattern,
      score:patternMatches(pattern,energyLabels)
    }))
    .filter(pattern=>pattern.score>0)
    .sort((a,b)=>b.score-a.score);

  const primaryEnergy=energyRanked[0];
  const secondaryEnergy=energyRanked[1];

  let energyTitle="What pulls you in";
  let energyText="You seem to be exploring a few different things. That is a useful place to start.";

  if(primaryEnergy){

    energyTitle=primaryEnergy.title;

    const seed=
      primaryEnergy.score+
      interests.length+
      absorption.length;

    energyText=chooseTemplate(
      primaryEnergy.templates,
      seed
    );

    if(
      secondaryEnergy &&
      secondaryEnergy.score===primaryEnergy.score
    ){

      const secondarySentence=
        chooseTemplate(
          secondaryEnergy.templates,
          seed+1
        )
        .split(". ")[0]+".";

      energyText+=" "+secondarySentence;
    }
  }


  /* WHAT THE STUDENT BRINGS */

  const primaryStrength=strengths[0];
  const secondaryStrength=strengths[1];

  let bringTitle="What you seem to bring";
  let bringText="You already have a few things that people seem to value in you. The examples you gave are more useful than any label we could give you.";

  if(
    primaryStrength &&
    REFLECTION_PATTERNS.bring[primaryStrength]
  ){

    bringTitle=primaryStrength;

    const templates=
      REFLECTION_PATTERNS.bring[primaryStrength];

    const example=
      state.answers.strengths_example||"";

    bringText=
      chooseTemplate(
        templates,
        example.length
      );

    if(example){

      bringText+=" Your example gives that strength some real context.";

    }
    else if(
      secondaryStrength &&
      REFLECTION_PATTERNS.bring[secondaryStrength]
    ){

      const secondarySentence=
        chooseTemplate(
          REFLECTION_PATTERNS.bring[secondaryStrength],
          0
        )
        .split(".")[0]
        .toLowerCase();

      bringText+=" "+secondarySentence+".";

    }
  }


  /* WHAT MATTERS */

  const valueRanked=REFLECTION_PATTERNS.values
    .map(pattern=>({
      ...pattern,
      score:patternMatches(pattern,valueLabels)
    }))
    .filter(pattern=>pattern.score>0)
    .sort((a,b)=>b.score-a.score);

  const topValues=valueRanked.slice(0,3);

  const uncertainty=
    meaning.includes("I'm not sure yet") ||
    future.includes("I'm genuinely not sure yet");

  let matterTitle="Still working it out";
  let matterText="You are still working out what matters most to you. That is okay. The next step is to explore rather than force an answer.";

  if(topValues.length){

    matterTitle=
      topValues
        .map(pattern=>pattern.title)
        .join(", ")
        .replace(/, ([^,]*)$/," and $1");

    if(topValues.length===1){

      matterText=
        chooseTemplate(
          topValues[0].templates,
          topValues[0].score
        );

    }
    else{

      const names=
        topValues
          .map(pattern=>pattern.title.toLowerCase());

      let nameText="";

      if(names.length===2){
        nameText=names.join(" and ");
      }
      else{
        nameText=
          names.slice(0,-1).join(", ")+
          " and "+
          names[names.length-1];
      }

      matterText=
        nameText.charAt(0).toUpperCase()+
        nameText.slice(1)+
        " seem to matter to you. These are worth keeping in mind when you start thinking about what you want your college years to give you.";
    }

  }
  else if(uncertainty){

    matterTitle="Still working it out";

    matterText=
      "You are not expected to have this figured out yet. What you do have are a few clues about what catches your attention, and those are worth exploring.";

  }


  /* SOMETHING WORTH NOTICING */

  let noticeText=
    "You do not need to turn these clues into a career decision yet. When you compare colleges, look for experiences that let you test what matters to you.";

  const crossRanked=CROSS_PATTERNS
    .map(pattern=>({
      ...pattern,
      score:patternMatches(pattern,allLabels)
    }))
    .filter(pattern=>pattern.score>=pattern.minMatches)
    .sort((a,b)=>b.score-a.score);

  const peopleSignals=allLabels.some(label=>[
    "Working with people",
    "Working with other people",
    "Helping others",
    "Help people"
  ].includes(label));

  const independenceSignals=allLabels.some(label=>[
    "Having independence",
    "Having the freedom to do it my way",
    "Freedom and independence"
  ].includes(label));

  const independencePeople=
    CROSS_PATTERNS.find(
      pattern=>pattern.id==="independencePeople"
    );

  if(
    peopleSignals &&
    independenceSignals &&
    independencePeople &&
    patternMatches(independencePeople,allLabels)>=2
  ){

    noticeText=independencePeople.text;

  }
  else if(crossRanked.length){

    noticeText=crossRanked[0].text;

  }
  else if(uncertainty){

    noticeText=
      "You are not expected to have all of this figured out yet. You already have some clues about what interests you. The next step is to explore those clues rather than force them into a decision.";

  }


  /* WRITE TO THE PAGE */

  document.getElementById("energyTitle").textContent=
    energyTitle;

  document.getElementById("energyCopy").textContent=
    energyText;

  document.getElementById("bringTitle").textContent=
    bringTitle;

  document.getElementById("bringCopy").textContent=
    bringText;

  document.getElementById("matterTitle").textContent=
    matterTitle;

  document.getElementById("matterCopy").textContent=
    matterText;

  document.getElementById("noticeCopy").textContent=
    noticeText;
}

function scrollQuestionToTop(){

  const header =
    document.querySelector("#questionView .question-header");

  if(!header){
    window.scrollTo({
      top:0,
      behavior:"instant"
    });
    return;
  }

  const top =
    header.getBoundingClientRect().top +
    window.scrollY -
    92;

  window.scrollTo({
    top:Math.max(0,top),
    behavior:"instant"
  });
}

function validQuestion(){

  const q=QUESTIONS[state.index];

  return selectedFor(q).length>0;
}


/* -------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------- */

function start(){

  state.index=0;

  show("question");

  renderQuestion();
}


document.getElementById("startBtn")
  .addEventListener("click",start);


document.getElementById("resumeBtn")
  .addEventListener("click",()=>{

    const has=
      Object.keys(state.answers).length>0;

    if(has){

      state.index=0;

      show("question");

      renderQuestion();

    }
    else{

      start();

    }

  });


document.getElementById("backBtn")
  .addEventListener("click",()=>{

    if(state.index>0){

      state.index--;

      renderQuestion();

      requestAnimationFrame(scrollQuestionToTop);

    }

  });


document.getElementById("nextBtn")
  .addEventListener("click",()=>{

    const q=QUESTIONS[state.index];

    if(!validQuestion()){

      document.getElementById("questionError").textContent=
        "Choose at least one response to continue.";

      return;
    }

    if(q.followup){

      state.answers[q.key+"_example"]=
        document.getElementById("followupInput")
          .value
          .trim();

      persist();

    }

    if(state.index<QUESTIONS.length-1){

      state.index++;

      renderQuestion();

      requestAnimationFrame(scrollQuestionToTop);

    }
    else{

      buildReflection();

      show("reflection");

    }

  });


document.getElementById("continueBtn")
  .addEventListener("click",()=>show("auth"));


document.getElementById("backToReflection")
  .addEventListener("click",()=>show("reflection"));


/* -------------------------------------------------------
   SAVE AND EMAIL
   ------------------------------------------------------- */

document.getElementById("authForm")
  .addEventListener("submit",async(e)=>{

    e.preventDefault();

    const btn=
      e.currentTarget.querySelector("button");

    const status=
      document.getElementById("authStatus");

    state.name=
      document.getElementById("nameInput")
        .value
        .trim();

    state.email=
      document.getElementById("emailInput")
        .value
        .trim();

    btn.disabled=true;

    status.textContent=
      "Saving your Compass…";

    try{

      const r=
        await fetch(
          "../api/compass/request-link",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              email:state.email,
              name:state.name,
              answers:state.answers
            })
          }
        );

      const payload=
        await r.json();

      if(!r.ok || !payload.ok){

        throw new Error(
          payload.message||
          "We could not save your Compass just now."
        );

      }

      document.getElementById("continueMessage")
        .textContent=
          `We sent a secure link to ${state.email}. You can close this page and come back whenever you're ready.`;

      show("continue");

    }
    catch(err){

      status.textContent=
        err.message||
        "We could not save your Compass just now.";

    }
    finally{

      btn.disabled=false;

    }

  });


/* -------------------------------------------------------
   INITIALISE
   ------------------------------------------------------- */

function init(){

  if(
    Object.keys(state.answers).length
  ){

    document.getElementById("resumeBtn")
      .textContent=
        "Continue my Compass";

  }

}

init();
