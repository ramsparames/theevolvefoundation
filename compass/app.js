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
const PAYMENT_TEST_MODE = true;

const STEP2_KEY = "evolveCompassStep2";
const STEP3_KEY = "evolveCompassStep3";
const STEP4_KEY = "evolveCompassStep4";
const STEP5_KEY = "evolveCompassStep5";

const STEP2_QUESTIONS = [
  {
    key:"decision",
    text:"What are you actually trying to decide?",
    hint:"Choose the one that best describes the decision in front of you.",
    max:1,
    options:[
      "Which course or degree should I choose?",
      "Which college should I choose?",
      "Which course and college combination should I choose?",
      "What direction should I explore?",
      "I'm not sure yet"
    ]
  },
  {
    key:"matters",
    text:"What matters most to you in the experience you choose?",
    hint:"Pick up to 5. These are things we will keep coming back to later.",
    max:5,
    options:[
      "Strong learning and teaching",
      "Practical experience",
      "Freedom to explore different subjects",
      "Good people and community",
      "Opportunities outside the classroom",
      "A clear path into work",
      "Flexibility to change direction",
      "Independence",
      "A good balance outside academics",
      "Being close to home",
      "Affordability",
      "I'm still figuring this out"
    ]
  },
  {
    key:"wants",
    text:"What do you most want your choice to give you?",
    hint:"Pick up to 5.",
    max:5,
    options:[
      "Confidence that I chose well",
      "Room to discover what I enjoy",
      "Skills I can actually use",
      "A strong foundation for the future",
      "People I can learn with",
      "Different experiences and opportunities",
      "A chance to build something",
      "A chance to make a difference",
      "A clear route into a career",
      "Freedom to change my mind",
      "A life that feels balanced",
      "I'm not sure yet"
    ]
  },
  {
    key:"note",
    text:"Is there anything else you already know about what you want?",
    hint:"You do not need to have a complete answer. A thought, concern or question is enough.",
    max:1,
    options:[],
    followup:true
  }
];

const PAYMENT_KEY = "evolveCompassPaid";
const INDEX_KEY = "evolveCompassSlice1Index";

let savedAnswers = {};

try{
  savedAnswers = JSON.parse(localStorage.getItem(KEY) || "{}");
}catch(e){
  savedAnswers = {};
}

const state = {
  step: "welcome",
  index: Number(localStorage.getItem(INDEX_KEY) || 0),
  answers: savedAnswers && typeof savedAnswers === "object" ? savedAnswers : {},
  name: "",
  email: "",
  saveReturnView: "welcome"
};

const views = {
  welcome: document.getElementById("welcomeView"),
  question: document.getElementById("questionView"),
  reflection: document.getElementById("reflectionView"),
  auth: document.getElementById("authView"),
  continue: document.getElementById("continueView"),
  payment: document.getElementById("paymentView"),
  step2: document.getElementById("step2View"),
  step2Summary: document.getElementById("step2SummaryView"),
  step3: document.getElementById("step3View"),
  step3Summary: document.getElementById("step3SummaryView"),
  step4: document.getElementById("step4View"),
  step4Summary: document.getElementById("step4SummaryView"),
  step5: document.getElementById("step5View")
};

function persist(){
  localStorage.setItem(KEY, JSON.stringify(state.answers));
  localStorage.setItem(INDEX_KEY, String(state.index));
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

function step2SavedState(){

  try{

    const saved=JSON.parse(
      localStorage.getItem(STEP2_KEY) || "{}"
    );

    if(
      saved &&
      typeof saved === "object" &&
      saved.answers &&
      typeof saved.answers === "object"
    ){

      return {
        index:Number(saved.index)||0,
        answers:saved.answers
      };

    }

  }
  catch(e){}

  return {
    index:0,
    answers:{}
  };

}

let step2State=step2SavedState();


function step3SavedState(){

  try{

    const saved=JSON.parse(
      localStorage.getItem(STEP3_KEY) || "{}"
    );

    if(
      saved &&
      typeof saved === "object" &&
      Array.isArray(saved.options)
    ){

      return {
        options:saved.options
      };

    }

  }
  catch(e){}

  return {
    options:[
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""}
    ]
  };

}


let step3State=step3SavedState();


function step4SavedState(){

  try{

    const saved=JSON.parse(
      localStorage.getItem(STEP4_KEY) || "{}"
    );

    if(
      saved &&
      typeof saved === "object" &&
      Array.isArray(saved.options)
    ){

      return {
        options:saved.options
      };

    }

  }
  catch(e){}

  return {
    options:[]
  };

}


let step4State=step4SavedState();


function step5SavedState(){

  try{

    const saved=JSON.parse(
      localStorage.getItem(STEP5_KEY) || "{}"
    );

    if(saved && typeof saved==="object"){
      return saved;
    }

  }
  catch(e){}

  return {
    reviewed:false
  };

}


let step5State=step5SavedState();


function persistStep5(){

  localStorage.setItem(
    STEP5_KEY,
    JSON.stringify(step5State)
  );

}


function persistStep4(){

  localStorage.setItem(
    STEP4_KEY,
    JSON.stringify({
      options:step4State.options
    })
  );

}


function persistStep3(){

  localStorage.setItem(
    STEP3_KEY,
    JSON.stringify({
      options:step3State.options
    })
  );

}


function persistStep2(){

  localStorage.setItem(
    STEP2_KEY,
    JSON.stringify({
      index:step2State.index,
      answers:step2State.answers
    })
  );

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
   STEP 2 · WHAT AM I LOOKING FOR?
   ------------------------------------------------------- */

function step2Selected(q){
  return Array.isArray(step2State.answers[q.key])
    ? step2State.answers[q.key]
    : [];
}

function renderStep2(){

  const q=STEP2_QUESTIONS[step2State.index];

  document.getElementById("step2ProgressText")
    .textContent=
      `${step2State.index+1} of ${STEP2_QUESTIONS.length}`;

  document.getElementById("step2ProgressBar")
    .style.width=
      `${((step2State.index+1)/STEP2_QUESTIONS.length)*100}%`;

  document.getElementById("step2Question")
    .textContent=q.text;

  document.getElementById("step2Hint")
    .textContent=q.hint;

  const list=document.getElementById("step2Options");

  list.innerHTML="";

  const chosen=step2Selected(q);

  q.options.forEach((label,i)=>{

    const b=document.createElement("button");

    b.type="button";
    b.className="option";

    b.innerHTML=
      `<span class="option-key">${String.fromCharCode(65+i)}</span><span class="option-text"></span>`;

    b.querySelector(".option-text").textContent=label;

    if(chosen.includes(i)){
      b.classList.add("selected");
    }

    b.addEventListener("click",()=>{

      let current=step2Selected(q).slice();

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

      step2State.answers[q.key]=current;

      persistStep2();

      renderStep2();

    });

    list.appendChild(b);

  });

  const follow=document.getElementById("step2Followup");
  const input=document.getElementById("step2Input");

  if(q.followup){

    follow.classList.remove("hidden");

    input.value=
      step2State.answers[q.key+"_text"] || "";

  }
  else{

    follow.classList.add("hidden");

    input.value="";

  }

  document.getElementById("step2BackBtn").hidden=
    step2State.index===0;

  document.getElementById("step2NextBtn").textContent=
    step2State.index===STEP2_QUESTIONS.length-1
      ?"See my decision frame →"
      :"Next →";

  document.getElementById("step2Error").textContent="";

}


function validStep2(){

  const q=STEP2_QUESTIONS[step2State.index];

  if(q.followup){
    return true;
  }

  return step2Selected(q).length>0;

}


function labelForStep2(key,index){

  const q=STEP2_QUESTIONS.find(
    item=>item.key===key
  );

  return q && q.options[index]
    ? q.options[index]
    : "";

}


function buildStep2Summary(){

  const decision=
    step2Selected(STEP2_QUESTIONS[0])
      .map(i=>labelForStep2("decision",i))[0]
      || "Still figuring this out";

  const matters=
    step2Selected(STEP2_QUESTIONS[1])
      .map(i=>labelForStep2("matters",i));

  const wants=
    step2Selected(STEP2_QUESTIONS[2])
      .map(i=>labelForStep2("wants",i));

  const note=
    step2State.answers.note_text
      ? step2State.answers.note_text
      : "";

  let reflection="";

  const practical=[
    "Practical experience",
    "Opportunities outside the classroom",
    "A clear path into work",
    "Skills I can actually use",
    "A clear route into a career"
  ];

  const exploration=[
    "Freedom to explore different subjects",
    "Flexibility to change direction",
    "Room to discover what I enjoy",
    "Freedom to change my mind",
    "Different experiences and opportunities"
  ];

  const community=[
    "Good people and community",
    "People I can learn with",
    "Good people and community"
  ];

  const independence=[
    "Independence"
  ];

  const balance=[
    "A good balance outside academics",
    "A life that feels balanced"
  ];

  const affordability=[
    "Affordability"
  ];

  const practicalScore=
    matters.filter(x=>practical.includes(x)).length+
    wants.filter(x=>practical.includes(x)).length;

  const explorationScore=
    matters.filter(x=>exploration.includes(x)).length+
    wants.filter(x=>exploration.includes(x)).length;

  const communityScore=
    matters.filter(x=>community.includes(x)).length+
    wants.filter(x=>community.includes(x)).length;

  const independenceScore=
    matters.filter(x=>independence.includes(x)).length+
    wants.filter(x=>independence.includes(x)).length;

  const balanceScore=
    matters.filter(x=>balance.includes(x)).length+
    wants.filter(x=>balance.includes(x)).length;

  const affordabilityScore=
    matters.filter(x=>affordability.includes(x)).length+
    wants.filter(x=>affordability.includes(x)).length;


  if(
    practicalScore>0 &&
    explorationScore>0
  ){

    reflection=
      "You seem to want room to explore rather than having everything mapped out from the beginning. At the same time, you want your learning to connect with the real world. That combination may be worth paying attention to when you compare your options.";

  }
  else if(
    explorationScore>0 &&
    independenceScore>0
  ){

    reflection=
      "You seem to value having room to discover what interests you and enough freedom to make the experience your own. When you compare your options, it may be worth finding out how much choice students actually have.";

  }
  else if(
    practicalScore>0 &&
    communityScore>0
  ){

    reflection=
      "You seem to want an experience that feels useful while also being surrounded by people you can learn and grow with. The course matters, but the environment around it may matter just as much.";

  }
  else if(
    communityScore>0 &&
    balanceScore>0
  ){

    reflection=
      "The people around you and the life you have alongside your studies both seem important. You may want to look beyond the course itself and understand what everyday life in each option would actually feel like.";

  }
  else if(
    practicalScore>0
  ){

    reflection=
      "You seem to want learning that leads somewhere tangible. It may be important for you to see how much practical experience, real world exposure and useful skill building each option actually provides.";

  }
  else if(
    explorationScore>0
  ){

    reflection=
      "You seem to want room to explore before you commit too tightly to one direction. When you compare your options, look for places where you can try different things and change direction as you learn more about yourself.";

  }
  else if(
    independenceScore>0
  ){

    reflection=
      "Having some control over your own experience seems important to you. It may be worth finding out how much freedom each option gives students in what they study, try and pursue.";

  }
  else if(
    balanceScore>0
  ){

    reflection=
      "You seem to care about the kind of life your choice will support, not only what you will study. That is worth keeping in view when you compare your options.";

  }
  else if(
    affordabilityScore>0
  ){

    reflection=
      "The practical side of the decision matters to you as well. Cost is not separate from the decision, so it will be important to understand what each option gives you for what it asks of you.";

  }
  else{

    reflection=
      "You are still working out what you want from this decision. That is okay. The next step is not to force an answer, but to put some real options in front of you and see what you notice.";

  }


  if(note){

    reflection+=" You have also added something personal here: "+note;

  }


  document.getElementById("summaryDecision")
    .textContent=decision;

  document.getElementById("summaryDecisionCopy")
    .textContent=
      "This is the decision Compass will help you work through.";

  document.getElementById("summaryMatters")
    .textContent=reflection;

  document.getElementById("summaryWants")
    .textContent=
      "As you compare options, notice whether they actually give you the kind of experience you say you want.";

  document.getElementById("summaryNote")
    .textContent=
      note ||
      "You have not added anything else yet. That is completely okay.";

}

/* -------------------------------------------------------
   STEP 3 · EXPLORE MY OPTIONS
   ------------------------------------------------------- */

function getStep2DecisionIndex(){

  const selected=step2Selected(
    STEP2_QUESTIONS[0]
  );

  return selected.length
    ? Number(selected[0])
    : 4;

}


function getStep3Mode(){

  const decisionIndex=
    getStep2DecisionIndex();

  if(decisionIndex===0){
    return "course";
  }

  if(decisionIndex===1){
    return "college";
  }

  if(decisionIndex===2){
    return "courseCollege";
  }

  if(decisionIndex===3){
    return "direction";
  }

  return "option";

}


function getStep3Labels(){

  const mode=getStep3Mode();

  if(mode==="course"){
    return {
      name:"Course or degree",
      placeholder:"For example, B.Tech Computer Science"
    };
  }

  if(mode==="college"){
    return {
      name:"College",
      placeholder:"For example, a college you are considering"
    };
  }

  if(mode==="courseCollege"){
    return {
      course:"Course or degree",
      college:"College"
    };
  }

  if(mode==="direction"){
    return {
      name:"Direction you are considering",
      placeholder:"For example, design, medicine, technology"
    };
  }

  return {
    name:"Option you are curious about",
    placeholder:"A course, college, career direction or anything else on your mind"
  };

}


function ensureStep3Options(){

  if(
    !Array.isArray(step3State.options) ||
    step3State.options.length!==3
  ){

    step3State.options=[
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""}
    ];

  }

}


function renderStep3(){

  ensureStep3Options();

  const mode=getStep3Mode();
  const labels=getStep3Labels();
  const container=
    document.getElementById("step3Options");

  container.innerHTML="";

  step3State.options.forEach((option,index)=>{

    const card=
      document.createElement("article");

    card.className=
      "step3-option-card";

    const optional=
      index>0
        ? "Optional"
        : "Start here";

    let fields="";

    if(mode==="courseCollege"){

      fields=`
        <label>
          ${labels.course}
          <input
            type="text"
            data-step3-field="course"
            data-step3-index="${index}"
            maxlength="160"
            placeholder="For example, B.Tech Computer Science"
          >
        </label>

        <label>
          ${labels.college}
          <input
            type="text"
            data-step3-field="college"
            data-step3-index="${index}"
            maxlength="160"
            placeholder="For example, a college you are considering"
          >
        </label>
      `;

    }
    else{

      fields=`
        <label>
          ${labels.name}
          <input
            type="text"
            data-step3-field="name"
            data-step3-index="${index}"
            maxlength="160"
            placeholder="${labels.placeholder}"
          >
        </label>
      `;

    }

    fields+=`
      <label>
        What makes this worth considering?
        <span class="field-optional">Optional</span>
        <textarea
          data-step3-field="why"
          data-step3-index="${index}"
          rows="3"
          maxlength="500"
          placeholder="A reason, attraction, question or simply something you have heard about it."
        ></textarea>
      </label>
    `;

    card.innerHTML=`
      <div class="step3-option-header">
        <div>
          <span class="card-label">OPTION ${index+1}</span>
          <h2>${index===0 ? "Your first option" : "Another possibility"}</h2>
        </div>
        <span class="step3-optional">${optional}</span>
      </div>
      <div class="step3-fields">${fields}</div>
    `;

    container.appendChild(card);

  });


  container
    .querySelectorAll("[data-step3-field]")
    .forEach(input=>{

      const index=
        Number(input.dataset.step3Index);

      const field=
        input.dataset.step3Field;

      input.value=
        step3State.options[index][field] || "";

      input.addEventListener(
        "input",
        ()=>{

          step3State.options[index][field]=
            input.value;

          persistStep3();

        }
      );

    });


  document.getElementById("step3Error")
    .textContent="";

  requestAnimationFrame(
    scrollQuestionToTop
  );

}


function step3OptionHasContent(option){

  return Boolean(
    (option.name || "").trim() ||
    (option.course || "").trim() ||
    (option.college || "").trim()
  );

}


function validStep3(){

  const first=
    step3State.options[0];

  const mode=getStep3Mode();

  if(mode==="courseCollege"){

    return Boolean(
      first.course.trim() &&
      first.college.trim()
    );

  }

  return Boolean(
    first.name.trim()
  );

}


function optionDisplayText(option){

  const mode=getStep3Mode();

  if(mode==="courseCollege"){

    return [
      option.course.trim(),
      option.college.trim()
    ]
      .filter(Boolean)
      .join(" · ");

  }

  return (
    option.name ||
    option.course ||
    option.college ||
    "Unnamed option"
  ).trim();

}


function buildStep3Summary(){

  const grid=
    document.getElementById(
      "step3SummaryGrid"
    );

  grid.innerHTML="";

  step3State.options
    .filter(option=>step3OptionHasContent(option))
    .forEach((option,index)=>{

      const card=
        document.createElement("article");

      card.className=
        "step3-summary-card";

      const name=
        optionDisplayText(option);

      const why=
        option.why.trim();

      card.innerHTML=`
        <span class="card-label">OPTION ${index+1}</span>
        <h2></h2>
        <p></p>
        <button
          type="button"
          class="summary-change-btn"
          data-step3-change="${index}"
        >Change →</button>
      `;

      card.querySelector("h2")
        .textContent=name;

      card.querySelector("p")
        .textContent=
          why ||
          "You have not added a reason yet.";

      grid.appendChild(card);

    });

}


function openStep3(){

  step3State=step3SavedState();

  ensureStep3Options();

  show("step3");
  renderStep3();

}


document.getElementById("step3BackBtn")
  .addEventListener(
    "click",
    ()=>{

      buildStep2Summary();

      show("step2Summary");

    }
  );


document.getElementById("step3NextBtn")
  .addEventListener(
    "click",
    ()=>{

      if(!validStep3()){

        document.getElementById("step3Error")
          .textContent=
            getStep3Mode()==="courseCollege"
              ? "Add a course and college for your first option to continue."
              : "Add your first option to continue.";

        return;

      }

      persistStep3();
      buildStep3Summary();

      show("step3Summary");

    }
  );


document.getElementById("step3SaveBtn")
  .addEventListener(
    "click",
    ()=>{

      persistStep3();

      state.saveReturnView="step3";

      show("auth");

    }
  );


document.getElementById("changeStep3Btn")
  .addEventListener(
    "click",
    ()=>{

      openStep3();

    }
  );


document
  .querySelector("#step3SummaryView")
  .addEventListener(
    "click",
    event=>{

      const button=
        event.target.closest(
          "[data-step3-change]"
        );

      if(!button){
        return;
      }

      const index=
        Number(button.dataset.step3Change);

      const card=
        step3State.options[index];

      if(!card){
        return;
      }

      openStep3();

      requestAnimationFrame(()=>{

        const firstInput=
          document.querySelector(
            `[data-step3-index="${index}"]`
          );

        if(firstInput){
          firstInput.focus();
          firstInput.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });
        }

      });

    }
  );


document.getElementById("step3ContinueBtn")
  .addEventListener(
    "click",
    openStep4
  );


/* -------------------------------------------------------
   STEP 4 · CHECK THE FIT
   ------------------------------------------------------- */

function createStep4Option(option){

  return {
    option:optionDisplayText(option),
    fit:"",
    known:"",
    uncertain:"",
    findOut:""
  };

}


function ensureStep4Options(){

  const validOptions=
    step3State.options
      .filter(option=>step3OptionHasContent(option));

  const existing=
    Array.isArray(step4State.options)
      ? step4State.options
      : [];

  step4State.options=
    validOptions.map((option,index)=>{

      const old=
        existing[index] || {};

      return {
        option:optionDisplayText(option),
        fit:old.fit || "",
        known:old.known || "",
        uncertain:old.uncertain || "",
        findOut:old.findOut || ""
      };

    });

}


function renderStep4(){

  ensureStep4Options();

  const container=
    document.getElementById("step4Options");

  container.innerHTML="";

  step4State.options.forEach((item,index)=>{

    const card=
      document.createElement("article");

    card.className=
      "step4-option-card";

    card.innerHTML=`
      <div class="step4-option-header">
        <div>
          <span class="card-label">OPTION ${index+1}</span>
          <h2></h2>
        </div>
      </div>

      <div class="step4-fit-question">
        <span class="field-title">
          Based on what you know right now, how does this option feel?
        </span>

        <div class="step4-fit-options">

          <button
            type="button"
            class="fit-choice"
            data-step4-field="fit"
            data-step4-value="Feels aligned"
          >
            <span>Feels aligned</span>
            <small>What I know seems to fit what matters to me.</small>
          </button>

          <button
            type="button"
            class="fit-choice"
            data-step4-field="fit"
            data-step4-value="Some things fit, some need checking"
          >
            <span>Some things fit, some need checking</span>
            <small>There are good signs, but I still have questions.</small>
          </button>

          <button
            type="button"
            class="fit-choice"
            data-step4-field="fit"
            data-step4-value="Too early to tell"
          >
            <span>Too early to tell</span>
            <small>I need more information before I can judge this.</small>
          </button>

        </div>
      </div>

      <div class="step4-text-fields">

        <label>
          What do you already know?
          <span class="field-optional">Optional</span>
          <textarea
            data-step4-field="known"
            rows="3"
            maxlength="700"
            placeholder="Facts, conversations, visits, experiences or anything you already know."
          ></textarea>
        </label>

        <label>
          What are you unsure about?
          <span class="field-optional">Optional</span>
          <textarea
            data-step4-field="uncertain"
            rows="3"
            maxlength="700"
            placeholder="What makes you hesitate, wonder or feel uncertain?"
          ></textarea>
        </label>

        <label>
          What do you need to find out?
          <span class="field-optional">Optional</span>
          <textarea
            data-step4-field="findOut"
            rows="3"
            maxlength="700"
            placeholder="What would you want to know before making this choice?"
          ></textarea>
        </label>

      </div>
    `;

    card.querySelector("h2")
      .textContent=item.option;

    container.appendChild(card);


    card
      .querySelectorAll(".fit-choice")
      .forEach(button=>{

        const field=
          button.dataset.step4Field;

        button.classList.toggle(
          "selected",
          item[field]===button.dataset.step4Value
        );

        button.addEventListener(
          "click",
          ()=>{

            item[field]=
              button.dataset.step4Value;

            persistStep4();

            card
              .querySelectorAll(
                `.fit-choice[data-step4-field="${field}"]`
              )
              .forEach(other=>{
                other.classList.toggle(
                  "selected",
                  other===button
                );
              });

          }
        );

      });


    card
      .querySelectorAll(
        "textarea[data-step4-field]"
      )
      .forEach(input=>{

        const field=
          input.dataset.step4Field;

        input.value=
          item[field] || "";

        input.addEventListener(
          "input",
          ()=>{

            item[field]=input.value;

            persistStep4();

          }
        );

      });

  });


  document.getElementById("step4Error")
    .textContent="";

  requestAnimationFrame(
    scrollQuestionToTop
  );

}


function buildStep4Summary(){

  ensureStep4Options();

  const grid=
    document.getElementById(
      "step4SummaryGrid"
    );

  grid.innerHTML="";

  step4State.options
    .forEach((item,index)=>{

      const card=
        document.createElement("article");

      card.className=
        "step4-summary-card";

      const fit=
        item.fit ||
        "You have not judged this yet.";

      const known=
        item.known.trim() ||
        "Nothing added yet.";

      const uncertain=
        item.uncertain.trim() ||
        "Nothing added yet.";

      const findOut=
        item.findOut.trim() ||
        "You have not added a question yet.";

      card.innerHTML=`
        <span class="card-label">OPTION ${index+1}</span>
        <h2></h2>

        <div class="step4-summary-section">
          <span>HOW IT FEELS RIGHT NOW</span>
          <p class="fit-summary"></p>
        </div>

        <div class="step4-summary-section">
          <span>WHAT YOU KNOW</span>
          <p class="known-summary"></p>
        </div>

        <div class="step4-summary-section">
          <span>WHAT IS UNCLEAR</span>
          <p class="uncertain-summary"></p>
        </div>

        <div class="step4-summary-section important">
          <span>WHAT YOU NEED TO FIND OUT</span>
          <p class="findout-summary"></p>
        </div>

        <button
          type="button"
          class="summary-change-btn"
          data-step4-change="${index}"
        >Change →</button>
      `;

      card.querySelector("h2")
        .textContent=item.option;

      card.querySelector(".fit-summary")
        .textContent=fit;

      card.querySelector(".known-summary")
        .textContent=known;

      card.querySelector(".uncertain-summary")
        .textContent=uncertain;

      card.querySelector(".findout-summary")
        .textContent=findOut;

      grid.appendChild(card);

    });

}


function openStep4(){

  step4State=step4SavedState();

  ensureStep4Options();

  show("step4");
  renderStep4();

}


document.getElementById("step4BackBtn")
  .addEventListener(
    "click",
    ()=>{

      buildStep3Summary();

      show("step3Summary");

    }
  );


document.getElementById("step4NextBtn")
  .addEventListener(
    "click",
    ()=>{

      ensureStep4Options();

      persistStep4();
      buildStep4Summary();

      show("step4Summary");

    }
  );


document.getElementById("step4SaveBtn")
  .addEventListener(
    "click",
    ()=>{

      persistStep4();

      state.saveReturnView="step4";

      show("auth");

    }
  );


document.getElementById("changeStep4Btn")
  .addEventListener(
    "click",
    openStep4
  );


document
  .getElementById("step4SummaryView")
  .addEventListener(
    "click",
    event=>{

      const button=
        event.target.closest(
          "[data-step4-change]"
        );

      if(!button){
        return;
      }

      const index=
        Number(button.dataset.step4Change);

      if(!step4State.options[index]){
        return;
      }

      openStep4();

      requestAnimationFrame(()=>{

        const cards=
          document.querySelectorAll(
            ".step4-option-card"
          );

        const card=cards[index];

        if(card){

          card.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });

        }

      });

    }
  );


/* -------------------------------------------------------
   STEP 5 · MY COMPASS
   ------------------------------------------------------- */

function cleanList(values){
  return values.map(value=>String(value||"").trim()).filter(Boolean);
}

function selectedLabels(question){
  return cleanList(
    step2Selected(question).map(i=>labelForStep2(question.key,i))
  );
}

function firstStep1Labels(key){
  const values=state.answers && Array.isArray(state.answers[key])
    ? state.answers[key] : [];
  return cleanList(values);
}

function makeSentenceList(items){
  if(!items.length) return "";
  if(items.length===1) return items[0];
  if(items.length===2) return items[0]+" and "+items[1];
  return items.slice(0,-1).join(", ")+", and "+items[items.length-1];
}

function step5OptionItems(){
  return step3State.options
    .filter(option=>step3OptionHasContent(option))
    .map((option,index)=>{
      const fit=step4State.options[index] && step4State.options[index].fit
        ? step4State.options[index].fit : "";
      return {
        name:optionDisplayText(option),
        fit,
        findOut:step4State.options[index] &&
          (step4State.options[index].findOut||"").trim()
            ? step4State.options[index].findOut.trim() : ""
      };
    });
}

function buildStep5Data(){
  const interests=firstStep1Labels("interests");
  const strengths=firstStep1Labels("strengths");
  const matters=selectedLabels(STEP2_QUESTIONS[1]);
  const wants=selectedLabels(STEP2_QUESTIONS[2]);
  const options=step5OptionItems();
  const questions=step4State.options
    .map(item=>(item.findOut||"").trim())
    .filter(Boolean);

  let nextTitle="Keep learning before you decide.";
  let nextCopy="You have a clearer starting point now. The next useful step is to answer the questions you have identified rather than trying to force a decision too early.";

  if(questions.length){
    nextTitle="Find out what you still do not know.";
    nextCopy="Start with the questions that could genuinely change how you feel about your options. You do not need to answer everything at once.";
  }else if(options.length>1){
    nextTitle="Compare the options against what matters to you.";
    nextCopy="Look at the differences between your options and ask which differences actually matter to you.";
  }

  return {interests,strengths,matters,wants,options,questions,nextTitle,nextCopy};
}

function addStep5Card(grid,label,title,copy,className=""){
  const card=document.createElement("article");
  card.className="step5-card "+className;
  card.innerHTML='<span class="card-label"></span><h2></h2><p></p>';
  card.querySelector(".card-label").textContent=label;
  card.querySelector("h2").textContent=title;
  card.querySelector("p").textContent=copy;
  grid.appendChild(card);
}

function buildParentSummary(data){
  const lines=[];
  lines.push("Compass snapshot");
  lines.push("");
  lines.push("I am still working through my decision about what comes next.");

  if(data.interests.length)
    lines.push("What seems to interest me: "+makeSentenceList(data.interests.slice(0,4))+".");
  if(data.strengths.length)
    lines.push("What I seem to bring: "+makeSentenceList(data.strengths.slice(0,3))+".");
  if(data.matters.length)
    lines.push("What matters to me in the experience: "+makeSentenceList(data.matters.slice(0,5))+".");
  if(data.wants.length)
    lines.push("What I want from the choice: "+makeSentenceList(data.wants.slice(0,5))+".");

  if(data.options.length){
    lines.push("");
    lines.push("Options I am considering:");
    data.options.forEach((option,index)=>{
      let line=(index+1)+". "+option.name;
      if(option.fit) line+=" | "+option.fit;
      lines.push(line);
    });
  }

  if(data.questions.length){
    lines.push("");
    lines.push("Things I still want to find out:");
    data.questions.slice(0,6).forEach(question=>lines.push("• "+question));
  }

  lines.push("");
  lines.push("What would help me most from my parent:");
  lines.push("Listen to what I am thinking, help me find reliable information and ask questions without trying to make the decision for me.");

  return lines.join("\n");
}

function renderStep5(){
  const data=buildStep5Data();
  const grid=document.getElementById("step5StudentGrid");
  grid.innerHTML="";

  addStep5Card(grid,"WHAT I AM NOTICING ABOUT MYSELF","What pulls me in",
    data.interests.length ? makeSentenceList(data.interests.slice(0,4))+"." : "I am still noticing what naturally pulls me in.");

  addStep5Card(grid,"WHAT I BRING","Things I seem to be good at",
    data.strengths.length ? makeSentenceList(data.strengths.slice(0,3))+"." : "I am still working out what I naturally bring to different situations.","sage");

  addStep5Card(grid,"WHAT MATTERS TO ME","Things worth keeping in view",
    data.matters.length ? makeSentenceList(data.matters.slice(0,5))+"." : "I am still figuring out what matters most to me.","peach");

  addStep5Card(grid,"WHAT I WANT","What I hope this choice gives me",
    data.wants.length ? makeSentenceList(data.wants.slice(0,5))+"." : "I am still figuring out what I want this experience to give me.","lilac");

  if(data.options.length){
    const card=document.createElement("article");
    card.className="step5-card step5-options-card";
    card.innerHTML='<span class="card-label">THE OPTIONS IN FRONT OF ME</span><h2>What I am considering</h2><div class="step5-option-list"></div>';
    const list=card.querySelector(".step5-option-list");

    data.options.forEach((option,index)=>{
      const row=document.createElement("div");
      row.className="step5-option-row";
      row.innerHTML='<strong></strong><span></span>';
      row.querySelector("strong").textContent=(index+1)+". "+option.name;
      row.querySelector("span").textContent=option.fit || "Still working this out.";
      list.appendChild(row);
    });

    grid.appendChild(card);
  }

  if(data.questions.length){
    const card=document.createElement("article");
    card.className="step5-card step5-questions-card";
    card.innerHTML='<span class="card-label">WHAT I STILL NEED TO KNOW</span><h2>Questions worth answering</h2><ul></ul>';
    const ul=card.querySelector("ul");

    data.questions.slice(0,8).forEach(question=>{
      const li=document.createElement("li");
      li.textContent=question;
      ul.appendChild(li);
    });

    grid.appendChild(card);
  }

  document.getElementById("step5NextTitle").textContent=data.nextTitle;
  document.getElementById("step5NextCopy").textContent=data.nextCopy;
  document.getElementById("parentSummaryText").textContent=buildParentSummary(data);
}

function openStep5(){
  step5State=step5SavedState();
  step5State.reviewed=true;
  persistStep5();
  renderStep5();
  show("step5");
  requestAnimationFrame(scrollQuestionToTop);
}

document.getElementById("step4ContinueBtn").addEventListener("click",openStep5);

document.getElementById("step5BackBtn").addEventListener("click",()=>{
  buildStep4Summary();
  show("step4Summary");
});

document.getElementById("changeStep5Btn").addEventListener("click",()=>{
  openStep4();
});

document.getElementById("parentSummaryBtn").addEventListener("click",()=>{
  const panel=document.getElementById("parentSummaryPanel");
  panel.classList.toggle("hidden");

  if(!panel.classList.contains("hidden")){
    requestAnimationFrame(()=>{
      panel.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  }
});

document.getElementById("copyParentSummaryBtn").addEventListener("click",async()=>{
  const text=document.getElementById("parentSummaryText").textContent;
  const status=document.getElementById("parentSummaryStatus");

  try{
    await navigator.clipboard.writeText(text);
    status.textContent="Copied. You can paste this into a message to your parent.";
  }
  catch(e){
    status.textContent="Copy is not available here. Select the summary and copy it.";
  }
});


function openPaidCompass(){

  if(PAYMENT_TEST_MODE){

    localStorage.setItem(
      PAYMENT_KEY,
      "true"
    );

    step2State=step2SavedState();

    show("step2");
    renderStep2();

    return;

  }

  show("payment");

}


document.getElementById("paymentBtn")
  .addEventListener(
    "click",
    openPaidCompass
  );


document.getElementById("changeStep1Btn")
  .addEventListener(
    "click",
    ()=>{

      state.index=0;

      show("question");
      renderQuestion();

      requestAnimationFrame(scrollQuestionToTop);

    }
  );


document.getElementById("continueBtn")
  .addEventListener(
    "click",
    ()=>{

      if(localStorage.getItem(PAYMENT_KEY)==="true"){

        step2State=step2SavedState();

        show("step2");
        renderStep2();

      }
      else{

        show("payment");

      }

    }
  );


document.getElementById("step2BackBtn")
  .addEventListener(
    "click",
    ()=>{

      if(step2State.index>0){

        step2State.index--;

        persistStep2();

        renderStep2();

      }
      else{

        show("reflection");

      }

    }
  );


document.getElementById("step2NextBtn")
  .addEventListener(
    "click",
    ()=>{

      const q=STEP2_QUESTIONS[step2State.index];

      if(!validStep2()){

        document.getElementById("step2Error")
          .textContent=
            "Choose at least one response to continue.";

        return;

      }

      if(q.followup){

        step2State.answers.note_text=
          document.getElementById("step2Input")
            .value
            .trim();

        persistStep2();

      }

      if(
        step2State.index<
        STEP2_QUESTIONS.length-1
      ){

        step2State.index++;

        persistStep2();

        renderStep2();

      }
      else{

        buildStep2Summary();

        show("step2Summary");

      }

    }
  );


document.querySelectorAll("[data-step2-change]")
  .forEach(button=>{

    button.addEventListener(
      "click",
      ()=>{

        const index=
          Number(
            button.dataset.step2Change
          );

        step2State.index=
          Math.max(
            0,
            Math.min(
              index,
              STEP2_QUESTIONS.length-1
            )
          );

        persistStep2();

        show("step2");
        renderStep2();

        requestAnimationFrame(
          scrollQuestionToTop
        );

      }
    );

  });


document.getElementById("changeStep2Btn")
  .addEventListener(
    "click",
    ()=>{

      step2State.index=0;

      persistStep2();

      show("step2");
      renderStep2();

      requestAnimationFrame(
        scrollQuestionToTop
      );

    }
  );


document.getElementById("step2ContinueBtn")
  .addEventListener(
    "click",
    openStep3
  );


/* -------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------- */

function start(){

  state.index=0;
  state.answers={};

  localStorage.removeItem(KEY);
  localStorage.removeItem(INDEX_KEY);
  localStorage.removeItem(PAYMENT_KEY);
  localStorage.removeItem(STEP2_KEY);
  localStorage.removeItem(STEP3_KEY);
  localStorage.removeItem(STEP4_KEY);
  localStorage.removeItem(STEP5_KEY);

  step2State={
    index:0,
    answers:{}
  };

  step3State={
    options:[
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""},
      {name:"",course:"",college:"",why:""}
    ]
  };

  step4State={
    options:[]
  };

  step5State={
    reviewed:false
  };

  document.getElementById("saveBtn").hidden=false;

  show("question");

  renderQuestion();
  requestAnimationFrame(scrollQuestionToTop);
}


document.getElementById("startBtn")
  .addEventListener("click",start);


// Resume is handled by the secure email link.


document.getElementById("backBtn")
  .addEventListener("click",()=>{

    if(state.index>0){

      state.index--;

      persist();

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

      persist();

      renderQuestion();

      requestAnimationFrame(scrollQuestionToTop);

    }
    else{

      buildReflection();

      show("reflection");

    }

  });





document.getElementById("backToReflection")
  .addEventListener("click",()=>show(state.saveReturnView||"welcome"));


/* -------------------------------------------------------
   SAVE AND EMAIL
   ------------------------------------------------------- */

document.getElementById("saveBtn")
  .addEventListener("click",()=>{

    const q=QUESTIONS[state.index];

    if(q.followup){

      state.answers[q.key+"_example"]=
        document.getElementById("followupInput")
          .value
          .trim();

    }

    persist();

    state.saveReturnView = state.step || "welcome";

    show("auth");

  });


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
              answers:{
                ...state.answers,
                __step2:{
                  index:step2State.index,
                  answers:step2State.answers
                },
                __step3:{
                  options:step3State.options
                },
                __step4:{
                  options:step4State.options
                },
                __step5:{
                  reviewed:step5State.reviewed
                },
                __paid:localStorage.getItem(PAYMENT_KEY)==="true"
              },
              index:state.index
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

function resumeFromSavedCompass(){

  if(state.answers.__step2){

    const savedStep2=state.answers.__step2;

    step2State={
      index:Number(savedStep2.index)||0,
      answers:
        savedStep2.answers &&
        typeof savedStep2.answers==="object"
          ? savedStep2.answers
          : {}
    };

    persistStep2();

    delete state.answers.__step2;

  }

  if(state.answers.__step3){

    const savedStep3=
      state.answers.__step3;

    if(
      savedStep3 &&
      Array.isArray(savedStep3.options)
    ){

      step3State={
        options:savedStep3.options
      };

      persistStep3();

    }

    delete state.answers.__step3;

  }


  if(state.answers.__step4){

    const savedStep4=
      state.answers.__step4;

    if(
      savedStep4 &&
      Array.isArray(savedStep4.options)
    ){

      step4State={
        options:savedStep4.options
      };

      persistStep4();

    }

    delete state.answers.__step4;

  }


  if(state.answers.__step5){

    const savedStep5=state.answers.__step5;

    if(savedStep5 && typeof savedStep5==="object"){
      step5State=savedStep5;
      persistStep5();
    }

    delete state.answers.__step5;

  }


  if(state.answers.__paid){

    localStorage.setItem(
      PAYMENT_KEY,
      "true"
    );

    delete state.answers.__paid;

    persist();

  }

  if(
    localStorage.getItem(PAYMENT_KEY)==="true" &&
    localStorage.getItem(STEP4_KEY)
  ){

    step4State=step4SavedState();

    openStep4();

    return;

  }

  if(
    localStorage.getItem(PAYMENT_KEY)==="true" &&
    localStorage.getItem(STEP3_KEY)
  ){

    step3State=step3SavedState();

    openStep3();

    return;

  }

  if(
    localStorage.getItem(PAYMENT_KEY)==="true" &&
    localStorage.getItem(STEP2_KEY)
  ){

    step2State=step2SavedState();

    show("step2");
    renderStep2();

    return;

  }

  const has=Object.keys(state.answers).length>0;

  if(!has){
    show("welcome");
    return;
  }

  const savedIndex=Number(
    localStorage.getItem(INDEX_KEY) || 0
  );

  state.index=Math.max(
    0,
    Math.min(savedIndex,QUESTIONS.length-1)
  );

  document.getElementById("saveBtn").hidden=false;

  show("question");
  renderQuestion();

  requestAnimationFrame(scrollQuestionToTop);
}

function init(){

  document.getElementById("saveBtn").hidden=true;

  const params=new URLSearchParams(
    window.location.search
  );

  if(params.get("resume")==="1"){
    resumeFromSavedCompass();
  }

}

init();
