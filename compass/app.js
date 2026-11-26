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
      typeof saved==="object"
    ){

      if(
        typeof saved.course==="string" &&
        Array.isArray(saved.colleges)
      ){

        return {
          course:saved.course.trim(),
          colleges:saved.colleges
            .map(value=>String(value||"").trim())
            .filter(Boolean)
            .slice(0,3)
        };

      }

      /*
       * Migrate the old Step 3 structure if a student already
       * has an older Compass saved locally.
       */
      if(Array.isArray(saved.options)){

        const first=saved.options[0] || {};

        return {
          course:String(
            first.course ||
            first.name ||
            ""
          ).trim(),

          colleges:saved.options
            .map(option=>
              String(
                option && option.college || ""
              ).trim()
            )
            .filter(Boolean)
            .slice(0,3)
        };

      }

    }

  }
  catch(e){}

  return {
    course:"",
    colleges:[]
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
      course:String(step3State.course||"").trim(),
      colleges:Array.isArray(step3State.colleges)
        ? step3State.colleges
            .map(value=>String(value||"").trim())
            .filter(Boolean)
            .slice(0,3)
        : []
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


/* -------------------------------------------------------
   STEP 3 · EXPLORE MY OPTIONS
   ------------------------------------------------------- */

function ensureStep3State(){

  if(
    !step3State ||
    typeof step3State!=="object"
  ){

    step3State={
      course:"",
      colleges:[]
    };

  }

  step3State.course=
    String(step3State.course||"").trim();

  if(!Array.isArray(step3State.colleges)){
    step3State.colleges=[];
  }

  step3State.colleges=
    step3State.colleges
      .map(value=>String(value||"").trim())
      .slice(0,3);

}


function renderStep3(){

  ensureStep3State();

  const courseInput=
    document.getElementById(
      "step3CourseInput"
    );

  const collegeList=
    document.getElementById(
      "step3CollegeList"
    );

  const addButton=
    document.getElementById(
      "step3AddCollegeBtn"
    );

  courseInput.value=
    step3State.course || "";

  collegeList.innerHTML="";

  /*
   * Always render at least one college field.
   */
  const values=
    step3State.colleges.length
      ? step3State.colleges
      : [""];

  values.forEach((value,index)=>{

    const row=
      document.createElement("div");

    row.className=
      "step3-college-row";

    row.innerHTML=`
      <div class="step3-college-number">
        ${index+1}
      </div>

      <input
        type="text"
        maxlength="160"
        data-step3-college="${index}"
        placeholder="${
          index===0
            ? "For example, VIT Vellore"
            : "Another college you are considering"
        }"
      >

      ${
        index>0
          ? `<button
               type="button"
               class="step3-remove-college"
               data-step3-remove="${index}"
             >Remove</button>`
          : ""
      }
    `;

    const input=
      row.querySelector("input");

    input.value=value;

    input.addEventListener(
      "input",
      ()=>{

        ensureStep3State();

        step3State.colleges[index]=
          input.value;

        persistStep3();

      }
    );

    const remove=
      row.querySelector(
        "[data-step3-remove]"
      );

    if(remove){

      remove.addEventListener(
        "click",
        ()=>{

          step3State.colleges.splice(
            index,
            1
          );

          persistStep3();

          renderStep3();

        }
      );

    }

    collegeList.appendChild(row);

  });

  addButton.disabled=
    values.length>=3;

  addButton.textContent=
    values.length>=3
      ? "Maximum of 3 colleges"
      : "+ Add another college";

  courseInput.oninput=()=>{

    step3State.course=
      courseInput.value;

    persistStep3();

  };

  document.getElementById(
    "step3Error"
  ).textContent="";

}


function validStep3(){

  ensureStep3State();

  const course=
    step3State.course.trim();

  const colleges=
    step3State.colleges
      .map(value=>String(value||"").trim())
      .filter(Boolean);

  /*
   * Require the course/direction and at least one
   * real college. Additional colleges are optional.
   */
  return Boolean(
    course &&
    colleges.length
  );

}


function buildStep3Summary(){

  ensureStep3State();

  const grid=
    document.getElementById(
      "step3SummaryGrid"
    );

  grid.innerHTML="";

  const courseCard=
    document.createElement("article");

  courseCard.className=
    "step3-summary-card";

  courseCard.innerHTML=`
    <span class="card-label">
      COURSE OR DIRECTION
    </span>

    <h2></h2>

    <p>
      This is the course or direction
      you want Compass to investigate.
    </p>

    <button
      type="button"
      class="summary-change-btn"
      id="changeStep3CourseInline"
    >
      Change →
    </button>
  `;

  courseCard.querySelector("h2")
    .textContent=
      step3State.course ||
      "Not specified";

  grid.appendChild(courseCard);

  step3State.colleges
    .filter(Boolean)
    .forEach((college,index)=>{

      const card=
        document.createElement("article");

      card.className=
        "step3-summary-card";

      card.innerHTML=`
        <span class="card-label">
          COLLEGE ${index+1}
        </span>

        <h2></h2>

        <p>
          We will check how well this college
          is equipped for the course and what
          matters to you.
        </p>

        <button
          type="button"
          class="summary-change-btn"
          data-step3-change-college="${index}"
        >
          Change →
        </button>
      `;

      card.querySelector("h2")
        .textContent=college;

      grid.appendChild(card);

    });

}


function openStep3(){

  step3State=step3SavedState();

  ensureStep3State();

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


document.getElementById("step3AddCollegeBtn")
  .addEventListener(
    "click",
    ()=>{

      ensureStep3State();

      if(step3State.colleges.length>=3){
        return;
      }

      /*
       * Add a blank field. Do not persist an empty
       * college as an actual option.
       */
      step3State.colleges.push("");

      renderStep3();

      requestAnimationFrame(()=>{

        const inputs=
          document.querySelectorAll(
            "[data-step3-college]"
          );

        const last=
          inputs[inputs.length-1];

        if(last){

          last.focus();

          last.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });

        }

      });

    }
  );


document.getElementById("step3NextBtn")
  .addEventListener(
    "click",
    ()=>{

      ensureStep3State();

      /*
       * Remove blank college rows before validating.
       */
      step3State.colleges=
        step3State.colleges
          .map(value=>String(value||"").trim())
          .filter(Boolean)
          .slice(0,3);

      persistStep3();

      if(!validStep3()){

        document.getElementById(
          "step3Error"
        ).textContent=
          !step3State.course.trim()
            ? "Add the course or direction you are considering."
            : "Add at least one college you are genuinely considering.";

        return;

      }

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
  .getElementById("step3SummaryView")
  .addEventListener(
    "click",
    event=>{

      if(
        event.target.closest(
          "#changeStep3CourseInline"
        )
      ){

        openStep3();

        requestAnimationFrame(()=>{

          const input=
            document.getElementById(
              "step3CourseInput"
            );

          if(input){

            input.focus();

            input.scrollIntoView({
              behavior:"smooth",
              block:"center"
            });

          }

        });

        return;

      }

      const button=
        event.target.closest(
          "[data-step3-change-college]"
        );

      if(!button){
        return;
      }

      const index=
        Number(
          button.dataset.step3ChangeCollege
        );

      openStep3();

      requestAnimationFrame(()=>{

        const input=
          document.querySelector(
            `[data-step3-college="${index}"]`
          );

        if(input){

          input.focus();

          input.scrollIntoView({
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

const STEP4_CRITERIA = [
  {
    key:"courseStrength",
    label:"Course strength",
    description:"How well the college seems equipped for the course you are considering."
  },
  {
    key:"practicalExperience",
    label:"Practical experience",
    description:"Projects, labs, internships, industry exposure or other ways to apply what you learn."
  },
  {
    key:"opportunities",
    label:"Opportunities beyond the classroom",
    description:"Clubs, competitions, research, entrepreneurship, exchange or other experiences."
  },
  {
    key:"environment",
    label:"People and learning environment",
    description:"The kind of people, support and everyday learning environment you would be around."
  },
  {
    key:"careerPath",
    label:"Path after college",
    description:"How clearly the college connects your course to further study, careers or work."
  },
  {
    key:"affordability",
    label:"Affordability and value",
    description:"What the overall cost means in relation to what the college offers you."
  }
];


const STEP4_EVIDENCE_LEVELS = [
  {
    value:"strong",
    label:"Strong evidence",
    description:"I have good reason to believe this is a strength."
  },
  {
    value:"some",
    label:"Some evidence",
    description:"There are positive signs, but I would like to verify them."
  },
  {
    value:"concern",
    label:"Concern",
    description:"Something here makes me hesitate."
  },
  {
    value:"unknown",
    label:"Not enough evidence",
    description:"I do not know enough yet to judge this."
  }
];


function createStep4Option(college,index){

  const criteria={};

  STEP4_CRITERIA.forEach(item=>{

    criteria[item.key]={
      level:"unknown",
      evidence:"",
      verify:""
    };

  });

  return {
    option:String(college||"").trim(),
    course:String(step3State.course||"").trim(),
    criteria
  };

}


function normaliseStep4Criteria(saved){

  const criteria={};

  STEP4_CRITERIA.forEach(item=>{

    const old=
      saved &&
      saved.criteria &&
      saved.criteria[item.key]
        ? saved.criteria[item.key]
        : {};

    criteria[item.key]={
      level:
        STEP4_EVIDENCE_LEVELS.some(
          level=>level.value===old.level
        )
          ? old.level
          : "unknown",

      evidence:
        String(old.evidence||"").trim(),

      verify:
        String(old.verify||"").trim()
    };

  });

  return criteria;

}


function ensureStep4Options(){

  ensureStep3State();

  const colleges=
    step3State.colleges
      .map(value=>String(value||"").trim())
      .filter(Boolean)
      .slice(0,3);

  const existing=
    Array.isArray(step4State.options)
      ? step4State.options
      : [];

  step4State.options=
    colleges.map((college,index)=>{

      /*
       * Match by college name first. This prevents answers
       * from moving to another college when the student edits
       * the Step 3 list.
       */
      const old=
        existing.find(
          item=>
            String(item.option||"").trim()===college
        )
        || existing[index]
        || {};

      /*
       * Migrate the old Step 4 structure where possible.
       */
      const migratedCriteria={};

      STEP4_CRITERIA.forEach(item=>{

        const oldCriterion=
          old.criteria &&
          old.criteria[item.key]
            ? old.criteria[item.key]
            : null;

        migratedCriteria[item.key]=
          oldCriterion
            ? {
                level:
                  oldCriterion.level || "unknown",
                evidence:
                  String(
                    oldCriterion.evidence||""
                  ).trim(),
                verify:
                  String(
                    oldCriterion.verify||""
                  ).trim()
              }
            : {
                level:"unknown",
                evidence:"",
                verify:""
              };

      });

      /*
       * If the student has an old fit answer, retain it as
       * context rather than silently throwing it away.
       */
      if(
        old.fit &&
        !Object.values(migratedCriteria)
          .some(item=>item.level!=="unknown")
      ){

        const oldLevel=
          old.fit==="Feels aligned"
            ? "some"
            : old.fit==="Some things fit, some need checking"
              ? "some"
              : "unknown";

        /*
         * Put the old general judgement into the course
         * strength criterion as a migration only.
         */
        migratedCriteria.courseStrength.level=
          oldLevel;

      }

      return {
        option:college,
        course:String(
          step3State.course||""
        ).trim(),
        criteria:migratedCriteria
      };

    });

}


function renderStep4Lens(){

  const lens=
    document.getElementById(
      "step4LensList"
    );

  lens.innerHTML="";

  const priorities=
    selectedLabels(
      STEP2_QUESTIONS[1]
    ).concat(
      selectedLabels(
        STEP2_QUESTIONS[2]
      )
    );

  const unique=[];

  priorities.forEach(priority=>{

    if(
      priority &&
      !unique.includes(priority)
    ){
      unique.push(priority);
    }

  });

  /*
   * Show the student's own priorities first.
   * Then explain the broader checks Compass will use.
   */
  if(unique.length){

    unique.slice(0,6)
      .forEach((priority,index)=>{

        const item=
          document.createElement("div");

        item.className=
          "step4-lens-item";

        item.innerHTML=`
          <strong></strong>
          <span>Priority ${index+1}</span>
        `;

        item.querySelector("strong")
          .textContent=priority;

        lens.appendChild(item);

      });

  }
  else{

    const item=
      document.createElement("div");

    item.className=
      "step4-lens-item";

    item.innerHTML=`
      <strong>Your priorities are still taking shape.</strong>
      <span>Compass will keep the broader decision factors in view.</span>
    `;

    lens.appendChild(item);

  }

}


function renderStep4(){

  ensureStep4Options();

  renderStep4Lens();

  const container=
    document.getElementById(
      "step4Options"
    );

  container.innerHTML="";

  step4State.options.forEach((item,index)=>{

    const card=
      document.createElement("article");

    card.className=
      "step4-option-card";

    card.innerHTML=`
      <div class="step4-option-header">
        <div>
          <span class="card-label">COLLEGE ${index+1}</span>
          <h2></h2>
          <p class="step4-course-context"></p>
        </div>
      </div>

      <div class="step4-criteria"></div>
    `;

    card.querySelector("h2")
      .textContent=item.option;

    card.querySelector(
      ".step4-course-context"
    ).textContent=
      item.course
        ? `Course: ${item.course}`
        : "";

    const criteriaContainer=
      card.querySelector(
        ".step4-criteria"
      );

    STEP4_CRITERIA.forEach(criterion=>{

      const value=
        item.criteria[criterion.key] || {
          level:"unknown",
          evidence:"",
          verify:""
        };

      const block=
        document.createElement("div");

      block.className=
        "step4-criterion";

      block.innerHTML=`
        <div class="step4-criterion-head">
          <div>
            <strong class="step4-criterion-title"></strong>
            <span class="step4-criterion-description"></span>
          </div>
        </div>

        <div class="step4-evidence-options"></div>

        <div class="step4-optional-fields">

          <label>
            What makes you say that?
            <span class="field-optional">Optional</span>

            <textarea
              data-step4-evidence="${criterion.key}"
              rows="2"
              maxlength="400"
              placeholder="A fact, conversation, visit, website or experience."
            ></textarea>
          </label>

          <label>
            What would you want to verify?
            <span class="field-optional">Optional</span>

            <textarea
              data-step4-verify="${criterion.key}"
              rows="2"
              maxlength="400"
              placeholder="Something you would want to check before deciding."
            ></textarea>
          </label>

        </div>
      `;

      block.querySelector(
        ".step4-criterion-title"
      ).textContent=
        criterion.label;

      block.querySelector(
        ".step4-criterion-description"
      ).textContent=
        criterion.description;

      const choices=
        block.querySelector(
          ".step4-evidence-options"
        );

      STEP4_EVIDENCE_LEVELS.forEach(level=>{

        const button=
          document.createElement("button");

        button.type="button";

        button.className=
          "fit-choice";

        button.dataset.step4Criterion=
          criterion.key;

        button.dataset.step4Level=
          level.value;

        button.innerHTML=`
          <span></span>
          <small></small>
        `;

        button.querySelector("span")
          .textContent=
            level.label;

        button.querySelector("small")
          .textContent=
            level.description;

        button.classList.toggle(
          "selected",
          value.level===level.value
        );

        button.addEventListener(
          "click",
          ()=>{

            item.criteria[
              criterion.key
            ].level=
              level.value;

            persistStep4();

            choices
              .querySelectorAll(
                "[data-step4-level]"
              )
              .forEach(other=>{

                other.classList.toggle(
                  "selected",
                  other===button
                );

              });

          }
        );

        choices.appendChild(button);

      });

      const evidence=
        block.querySelector(
          `[data-step4-evidence="${criterion.key}"]`
        );

      const verify=
        block.querySelector(
          `[data-step4-verify="${criterion.key}"]`
        );

      evidence.value=
        value.evidence || "";

      verify.value=
        value.verify || "";

      evidence.addEventListener(
        "input",
        ()=>{

          item.criteria[
            criterion.key
          ].evidence=
            evidence.value;

          persistStep4();

        }
      );

      verify.addEventListener(
        "input",
        ()=>{

          item.criteria[
            criterion.key
          ].verify=
            verify.value;

          persistStep4();

        }
      );

      criteriaContainer.appendChild(block);

    });

    container.appendChild(card);

  });

  document.getElementById(
    "step4Error"
  ).textContent="";

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

      card.innerHTML=`
        <span class="card-label">COLLEGE ${index+1}</span>

        <h2></h2>

        <p class="step4-summary-course"></p>

        <div class="step4-summary-criteria"></div>

        <button
          type="button"
          class="summary-change-btn"
          data-step4-change="${index}"
        >
          Change →
        </button>
      `;

      card.querySelector("h2")
        .textContent=item.option;

      card.querySelector(
        ".step4-summary-course"
      ).textContent=
        item.course
          ? `Course: ${item.course}`
          : "";

      const criteriaContainer=
        card.querySelector(
          ".step4-summary-criteria"
        );

      STEP4_CRITERIA.forEach(criterion=>{

        const value=
          item.criteria[criterion.key] || {
            level:"unknown"
          };

        const level=
          STEP4_EVIDENCE_LEVELS.find(
            option=>
              option.value===value.level
          );

        const row=
          document.createElement("div");

        row.className=
          "step4-summary-section";

        row.innerHTML=`
          <span></span>
          <strong></strong>
        `;

        row.querySelector("span")
          .textContent=
            criterion.label;

        row.querySelector("strong")
          .textContent=
            level
              ? level.label
              : "Not enough evidence";

        criteriaContainer.appendChild(row);

        if(
          value.evidence ||
          value.verify
        ){

          const detail=
            document.createElement("p");

          const pieces=[];

          if(value.evidence){
            pieces.push(
              `Evidence: ${value.evidence}`
            );
          }

          if(value.verify){
            pieces.push(
              `Verify: ${value.verify}`
            );
          }

          detail.textContent=
            pieces.join(" ");

          criteriaContainer.appendChild(detail);

        }

      });

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

  ensureStep3State();
  ensureStep4Options();

  return step3State.colleges
    .map((college,index)=>{

      const step4=
        step4State.options[index] || {};

      const criteria=
        step4.criteria || {};

      return {
        name:String(college||"").trim(),

        course:String(
          step3State.course || ""
        ).trim(),

        criteria,

        fit:step4.fit || "",

        findOut:String(
          step4.findOut || ""
        ).trim()

      };

    })
    .filter(option=>option.name);

}


function step5PriorityTerms(){

  const matters=
    selectedLabels(
      STEP2_QUESTIONS[1]
    );

  const wants=
    selectedLabels(
      STEP2_QUESTIONS[2]
    );

  /*
   * Keep the student's language intact.
   * We use it as a qualitative lens rather than
   * pretending we can calculate an exact score.
   */
  return cleanList(
    matters.concat(wants)
  ).filter(
    (value,index,array)=>
      array.indexOf(value)===index
  );

}


function step5CriterionMatchesPriority(
  criterion,
  priorities
){

  const text=
    String(
      criterion.label+
      " "+
      criterion.description
    ).toLowerCase();

  return priorities.some(priority=>{

    const words=
      String(priority)
        .toLowerCase()
        .split(/\s+/)
        .filter(word=>word.length>3);

    return words.some(word=>
      text.includes(word)
    );

  });

}


function step5EvidenceLabel(level){

  if(level==="strong"){
    return "Strong evidence";
  }

  if(level==="some"){
    return "Some evidence";
  }

  if(level==="concern"){
    return "Concern";
  }

  return "Not enough evidence";

}


function step5BuildAnalysis(){

  const priorities=
    step5PriorityTerms();

  const options=
    step5OptionItems();

  const analysed=
    options.map(option=>{

      const strong=[];
      const some=[];
      const concerns=[];
      const unknown=[];

      STEP4_CRITERIA.forEach(criterion=>{

        const value=
          option.criteria[criterion.key] || {
            level:"unknown",
            evidence:"",
            verify:""
          };

        const item={
          key:criterion.key,
          label:criterion.label,
          description:criterion.description,
          evidence:String(
            value.evidence||""
          ).trim(),
          verify:String(
            value.verify||""
          ).trim(),
          level:value.level || "unknown",
          priority:
            step5CriterionMatchesPriority(
              criterion,
              priorities
            )
        };

        if(item.level==="strong"){
          strong.push(item);
        }
        else if(item.level==="some"){
          some.push(item);
        }
        else if(item.level==="concern"){
          concerns.push(item);
        }
        else{
          unknown.push(item);
        }

      });

      const priorityStrong=
        strong.filter(item=>item.priority);

      const prioritySome=
        some.filter(item=>item.priority);

      const priorityConcerns=
        concerns.filter(item=>item.priority);

      const priorityUnknown=
        unknown.filter(item=>item.priority);

      return {
        ...option,
        strong,
        some,
        concerns,
        unknown,
        priorityStrong,
        prioritySome,
        priorityConcerns,
        priorityUnknown
      };

    });


  /*
   * We deliberately do not create a numerical score.
   *
   * The order is based first on evidence against the
   * student's stated priorities, then on broader evidence.
   */
  const ranked=
    [...analysed].sort((a,b)=>{

      const aPriorityStrong=
        a.priorityStrong.length;

      const bPriorityStrong=
        b.priorityStrong.length;

      if(
        aPriorityStrong!==
        bPriorityStrong
      ){

        return (
          bPriorityStrong-
          aPriorityStrong
        );

      }

      const aPriorityConcerns=
        a.priorityConcerns.length;

      const bPriorityConcerns=
        b.priorityConcerns.length;

      if(
        aPriorityConcerns!==
        bPriorityConcerns
      ){

        return (
          aPriorityConcerns-
          bPriorityConcerns
        );

      }

      const aStrong=
        a.strong.length;

      const bStrong=
        b.strong.length;

      return bStrong-aStrong;

    });


  const strongest=
    ranked[0] || null;


  /*
   * Identify meaningful differences between options.
   * This is the heart of the decision-support layer.
   */
  const tradeoffs=[];

  for(
    let i=0;
    i<ranked.length;
    i++
  ){

    for(
      let j=i+1;
      j<ranked.length;
      j++
    ){

      const first=ranked[i];
      const second=ranked[j];

      const firstAdvantages=
        first.strong.filter(item=>
          second.concerns.some(
            other=>other.key===item.key
          )
        );

      const secondAdvantages=
        second.strong.filter(item=>
          first.concerns.some(
            other=>other.key===item.key
          )
        );

      if(
        firstAdvantages.length ||
        secondAdvantages.length
      ){

        tradeoffs.push({
          first:first.name,
          second:second.name,
          firstAdvantages:
            firstAdvantages.slice(0,3),
          secondAdvantages:
            secondAdvantages.slice(0,3)
        });

      }

    }

  }


  /*
   * Find the most important unknowns.
   * Priority unknowns come first because those can
   * actually affect the decision.
   */
  const evidenceGaps=[];

  ranked.forEach(option=>{

    option.priorityUnknown
      .forEach(item=>{

        evidenceGaps.push({
          option:option.name,
          criterion:item.label,
          verify:item.verify
        });

      });

    option.unknown
      .filter(item=>!item.priority)
      .forEach(item=>{

        evidenceGaps.push({
          option:option.name,
          criterion:item.label,
          verify:item.verify
        });

      });

    option.prioritySome
      .forEach(item=>{

        if(item.verify){

          evidenceGaps.push({
            option:option.name,
            criterion:item.label,
            verify:item.verify
          });

        }

      });

  });


  const uniqueGaps=[];

  evidenceGaps.forEach(gap=>{

    const key=
      gap.option+"|"+gap.criterion;

    if(
      !uniqueGaps.some(
        item=>
          item.option+"|"+item.criterion===key
      )
    ){

      uniqueGaps.push(gap);

    }

  });


  /*
   * Create practical next actions.
   */
  const nextActions=[];

  uniqueGaps.forEach(gap=>{

    if(nextActions.length>=3){
      return;
    }

    const action=
      gap.verify
        ? `Verify ${gap.criterion.toLowerCase()} at ${gap.option}: ${gap.verify}`
        : `Find reliable evidence about ${gap.criterion.toLowerCase()} at ${gap.option}.`;

    if(!nextActions.includes(action)){
      nextActions.push(action);
    }

  });


  if(
    nextActions.length<3 &&
    ranked.length>1
  ){

    const action=
      "Compare the leading options side by side on the two or three priorities that matter most to you.";

    if(!nextActions.includes(action)){
      nextActions.push(action);
    }

  }


  if(
    nextActions.length<3
  ){

    const action=
      "Talk to a current student or recent graduate to test what the published information does not tell you.";

    if(!nextActions.includes(action)){
      nextActions.push(action);
    }

  }


  /*
   * Interpretation.
   */
  let interpretation="";

  if(!strongest){

    interpretation=
      "There is not enough information yet to make a useful comparison.";

  }
  else if(ranked.length===1){

    interpretation=
      `${strongest.name} has some useful evidence behind it, but Compass cannot tell you whether it is the right choice without another option to compare.`;

  }
  else{

    const second=
      ranked[1];

    const strongDifference=
      strongest.priorityStrong.length-
      second.priorityStrong.length;

    const concernDifference=
      strongest.priorityConcerns.length-
      second.priorityConcerns.length;

    if(
      strongDifference>0 &&
      concernDifference<=0
    ){

      interpretation=
        `${strongest.name} currently has the strongest evidence against the priorities you have said matter most. That is a useful signal to investigate further, not a final recommendation.`;

    }
    else{

      interpretation=
        "There is not yet a clear front-runner. The options have different strengths and gaps, so the next useful step is to investigate the differences that matter most to you.";

    }

  }


  return {
    priorities,
    options,
    ranked,
    strongest,
    tradeoffs,
    evidenceGaps:uniqueGaps.slice(0,8),
    nextActions:nextActions.slice(0,3),
    interpretation
  };

}


function buildStep5Data(){

  const interests=
    firstStep1Labels("interests");

  const strengths=
    firstStep1Labels("strengths");

  const matters=
    selectedLabels(
      STEP2_QUESTIONS[1]
    );

  const wants=
    selectedLabels(
      STEP2_QUESTIONS[2]
    );

  const analysis=
    step5BuildAnalysis();

  const questions=
    analysis.evidenceGaps.map(
      gap=>{

        return gap.verify
          ? `${gap.option}: ${gap.verify}`
          : `${gap.option}: find out more about ${gap.criterion.toLowerCase()}.`;

      }
    );

  let nextTitle=
    "Keep learning before you decide.";

  let nextCopy=
    analysis.interpretation;

  if(
    analysis.nextActions.length
  ){

    nextTitle=
      "What could make this decision clearer.";

    nextCopy=
      analysis.nextActions[0];

  }

  return {
    interests,
    strengths,
    matters,
    wants,
    course:String(
      step3State.course||""
    ).trim(),
    options:analysis.ranked,
    priorities:analysis.priorities,
    tradeoffs:analysis.tradeoffs,
    evidenceGaps:analysis.evidenceGaps,
    questions,
    nextActions:analysis.nextActions,
    strongest:analysis.strongest,
    interpretation:analysis.interpretation,
    nextTitle,
    nextCopy
  };

}


function addStep5Card(
  grid,
  label,
  title,
  copy,
  className=""
){

  const card=
    document.createElement("article");

  card.className=
    "step5-card "+className;

  card.innerHTML=
    '<span class="card-label"></span>'+
    '<h2></h2><p></p>';

  card.querySelector(
    ".card-label"
  ).textContent=label;

  card.querySelector("h2")
    .textContent=title;

  card.querySelector("p")
    .textContent=copy;

  grid.appendChild(card);

}


function buildParentSummary(data){

  const lines=[];

  lines.push("Compass snapshot");
  lines.push("");

  if(data.course){

    lines.push(
      "Course or direction: "+
      data.course
    );

  }

  lines.push(
    "I am still working through my decision about what comes next."
  );

  if(data.interests.length){

    lines.push(
      "What seems to interest me: "+
      makeSentenceList(
        data.interests.slice(0,4)
      )+
      "."
    );

  }

  if(data.strengths.length){

    lines.push(
      "What I seem to bring: "+
      makeSentenceList(
        data.strengths.slice(0,3)
      )+
      "."
    );

  }

  if(data.matters.length){

    lines.push(
      "What matters to me in the experience: "+
      makeSentenceList(
        data.matters.slice(0,5)
      )+
      "."
    );

  }

  if(data.wants.length){

    lines.push(
      "What I want from the choice: "+
      makeSentenceList(
        data.wants.slice(0,5)
      )+
      "."
    );

  }

  if(data.options.length){

    lines.push("");
    lines.push(
      "Colleges I am considering:"
    );

    data.options.forEach(
      (option,index)=>{

        lines.push(
          (index+1)+". "+option.name
        );

      }
    );

  }

  if(data.tradeoffs.length){

    lines.push("");
    lines.push("What Compass is noticing:");

    data.tradeoffs
      .slice(0,3)
      .forEach(tradeoff=>{

        let line=
          tradeoff.first+
          " appears stronger on ";

        line+=
          tradeoff.firstAdvantages.length
            ? makeSentenceList(
                tradeoff.firstAdvantages
                  .map(item=>item.label)
              )
            : "some areas";

        if(
          tradeoff.secondAdvantages.length
        ){

          line+=
            ", while "+
            tradeoff.second+
            " appears stronger on "+
            makeSentenceList(
              tradeoff.secondAdvantages
                .map(item=>item.label)
            );

        }

        line+=".";

        lines.push(line);

      });

  }

  if(data.questions.length){

    lines.push("");
    lines.push(
      "Things still worth finding out:"
    );

    data.questions
      .slice(0,6)
      .forEach(
        question=>
          lines.push("• "+question)
      );

  }

  lines.push("");
  lines.push(
    "What would help me most from my parent:"
  );

  lines.push(
    "Listen to what I am thinking, help me find reliable information and ask questions without trying to make the decision for me."
  );

  return lines.join("\n");

}


function renderStep5(){

  const data=
    buildStep5Data();

  const grid=
    document.getElementById(
      "step5StudentGrid"
    );

  grid.innerHTML="";


  /*
   * 1. THE DECISION
   */
  addStep5Card(
    grid,
    "THE DECISION IN FRONT OF ME",
    data.course
      ? data.course
      : "What I am deciding next",
    data.interpretation
  );


  /*
   * 2. CURRENT SIGNAL
   */
  if(data.strongest){

    addStep5Card(
      grid,
      "CURRENTLY STRONGEST SIGNAL",
      data.strongest.name,
      data.strongest.priorityStrong.length
        ? "This option currently has the strongest evidence against the priorities you have said matter most."
        : "This option currently has the clearest overall evidence, although the decision is not settled.",
      "sage"
    );

  }


  /*
   * 3. OPTION COMPARISON
   */
  if(data.options.length){

    const card=
      document.createElement("article");

    card.className=
      "step5-card step5-options-card";

    card.innerHTML=
      '<span class="card-label">WHAT THE EVIDENCE SUGGESTS</span>'+
      '<h2>How the options look today</h2>'+
      '<div class="step5-option-list"></div>';

    const list=
      card.querySelector(
        ".step5-option-list"
      );

    data.options.forEach(
      (option,index)=>{

        const row=
          document.createElement("div");

        row.className=
          "step5-option-row";

        row.innerHTML=
          "<strong></strong><span></span>";

        row.querySelector(
          "strong"
        ).textContent=
          `${index+1}. ${option.name}`;

        const pieces=[];

        if(option.priorityStrong.length){

          pieces.push(
            "Strong evidence on "+
            makeSentenceList(
              option.priorityStrong
                .slice(0,3)
                .map(item=>item.label)
            )+
            "."
          );

        }

        if(option.prioritySome.length){

          pieces.push(
            "Some areas still need checking, including "+
            makeSentenceList(
              option.prioritySome
                .slice(0,2)
                .map(item=>item.label)
            )+
            "."
          );

        }

        if(option.priorityConcerns.length){

          pieces.push(
            "There are concerns around "+
            makeSentenceList(
              option.priorityConcerns
                .slice(0,2)
                .map(item=>item.label)
            )+
            "."
          );

        }

        if(!pieces.length){

          pieces.push(
            "There is not enough evidence yet to say how well this option fits."
          );

        }

        row.querySelector(
          "span"
        ).textContent=
          pieces.join(" ");

        list.appendChild(row);

      }
    );

    grid.appendChild(card);

  }


  /*
   * 4. TRADE-OFFS
   */
  if(data.tradeoffs.length){

    const card=
      document.createElement("article");

    card.className=
      "step5-card";

    card.innerHTML=
      '<span class="card-label">THE TRADE-OFF</span>'+
      '<h2>There may not be one perfect option.</h2>'+
      '<div class="step5-tradeoff-list"></div>';

    const list=
      card.querySelector(
        ".step5-tradeoff-list"
      );

    data.tradeoffs
      .slice(0,3)
      .forEach(tradeoff=>{

        const item=
          document.createElement("p");

        let text=
          `${tradeoff.first} looks stronger on `;

        text+=
          tradeoff.firstAdvantages.length
            ? makeSentenceList(
                tradeoff.firstAdvantages
                  .map(item=>item.label)
              )
            : "some areas";

        if(
          tradeoff.secondAdvantages.length
        ){

          text+=
            `, while ${tradeoff.second} looks stronger on `+
            makeSentenceList(
              tradeoff.secondAdvantages
                .map(item=>item.label)
            );

        }

        text+=".";

        item.textContent=text;

        list.appendChild(item);

      });

    grid.appendChild(card);

  }


  /*
   * 5. WHAT IS STILL UNKNOWN
   */
  if(data.evidenceGaps.length){

    const card=
      document.createElement("article");

    card.className=
      "step5-card step5-questions-card";

    card.innerHTML=
      '<span class="card-label">WHAT COULD CHANGE MY MIND</span>'+
      '<h2>Questions worth answering before I decide.</h2>'+
      '<ul></ul>';

    const ul=
      card.querySelector("ul");

    data.evidenceGaps
      .slice(0,6)
      .forEach(gap=>{

        const li=
          document.createElement("li");

        li.textContent=
          gap.verify
            ? `${gap.option}: ${gap.verify}`
            : `${gap.option}: find out more about ${gap.criterion.toLowerCase()}.`;

        ul.appendChild(li);

      });

    grid.appendChild(card);

  }


  /*
   * 6. STUDENT CONTEXT
   *
   * We keep this compact. These answers are context for
   * the reasoning, not the conclusion itself.
   */
  if(
    data.interests.length ||
    data.strengths.length ||
    data.matters.length ||
    data.wants.length
  ){

    const contextParts=[];

    if(data.matters.length){

      contextParts.push(
        "You said "+
        makeSentenceList(
          data.matters.slice(0,3)
        )+
        " matter to you."

      );

    }

    if(data.wants.length){

      contextParts.push(
        "You want "+
        makeSentenceList(
          data.wants.slice(0,3)
        )+
        " from the experience."

      );

    }

    addStep5Card(
      grid,
      "YOUR DECISION LENS",
      "Why these differences matter",
      contextParts.join(" ")
    );

  }


  document.getElementById(
    "step5NextTitle"
  ).textContent=
    data.nextTitle;

  document.getElementById(
    "step5NextCopy"
  ).textContent=
    data.nextCopy;

  document.getElementById(
    "parentSummaryText"
  ).textContent=
    buildParentSummary(data);

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
                  course:String(step3State.course||""),
                  colleges:Array.isArray(step3State.colleges)
                    ? step3State.colleges
                    : []
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
      typeof savedStep3==="object"
    ){

      /*
       * New Step 3 structure:
       * one course + up to three colleges.
       */
      if(
        typeof savedStep3.course==="string" &&
        Array.isArray(savedStep3.colleges)
      ){

        step3State={
          course:savedStep3.course,
          colleges:savedStep3.colleges
            .map(value=>String(value||"").trim())
            .filter(Boolean)
            .slice(0,3)
        };

        persistStep3();

      }

      /*
       * Backward compatibility with any Compass saved
       * before the Step 3 architecture change.
       */
      else if(
        Array.isArray(savedStep3.options)
      ){

        const first=
          savedStep3.options[0] || {};

        step3State={
          course:String(
            first.course ||
            first.name ||
            ""
          ).trim(),

          colleges:savedStep3.options
            .map(option=>
              String(
                option &&
                option.college ||
                ""
              ).trim()
            )
            .filter(Boolean)
            .slice(0,3)
        };

        persistStep3();

      }

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
