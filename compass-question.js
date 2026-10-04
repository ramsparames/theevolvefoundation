const QUESTIONS = [{"text": "When you think about what comes next, which feels most like you?", "options": ["I really don't know yet.", "I have a few things I'm curious about.", "I have a direction in mind, but I'm not sure.", "I have a fairly clear direction."], "hint": "Think about what feels true today, not what you think you should say."}, {"text": "How well do you feel you know yourself?", "options": ["I'm still figuring myself out.", "I know some things about myself, but there's a lot I haven't thought about.", "I have a fairly good sense of what suits me.", "I know myself quite well and can explain why certain things fit me."], "hint": "There is no better answer. Think about how easily you could describe yourself to someone who doesn't know you."}, {"text": "When something catches your interest, what usually happens?", "options": ["I notice it, but usually move on.", "I think about it or look it up.", "I usually try to learn more about it.", "I like to try things and see what I learn."], "hint": "Think about what you actually tend to do, not what you wish you did."}, {"text": "When you think about your future, what feels hardest right now?", "options": ["Knowing what I want.", "Choosing between different possibilities.", "Knowing whether I'm making the right choice.", "Turning what I want into action."], "hint": "Which part feels like the biggest sticking point today?"}, {"text": "How much have you actually explored the things you're curious about?", "options": ["Not much yet.", "I've thought about them or searched online.", "I've talked to people or learned more about them.", "I've actually tried something."], "hint": "Exploring can be as small as a conversation, a project or trying something once."}, {"text": "When you're unsure about an important choice, what do you tend to do?", "options": ["Wait until I feel more certain.", "Ask other people what they think.", "Look for information before deciding.", "Make the best choice I can and adjust as I learn."], "hint": "Think about your usual pattern when the answer isn't obvious."}, {"text": "Which feels closest to you right now?", "options": ["I wish I knew myself better.", "I wish I had more things to explore.", "I wish I knew which direction to choose.", "I know my direction, but I need to get moving."], "hint": "Pick the sentence that feels most like where you are today."}, {"text": "If you had the next month to make progress on your future, what would you most want to do?", "options": ["Understand myself better.", "Explore something I'm curious about.", "Get clearer about a direction.", "Take action on a direction I already have."], "hint": "Choose the kind of progress that would be most useful right now."}];
const STORAGE_KEY = 'studentCompassAnswersV3';
const answers = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
const qIndex = Number(sessionStorage.getItem('studentCompassQuestion') || '0');

function save() { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers)); }
function setIndex(i) { sessionStorage.setItem('studentCompassQuestion', String(i)); }
function render() {
  const i = Math.max(0, Math.min(QUESTIONS.length - 1, qIndex));
  const q = QUESTIONS[i];
  document.getElementById('question-number').textContent = `Reflection ${i+1} of ${QUESTIONS.length}`;
  document.getElementById('question-text').textContent = q.text;
  document.getElementById('question-hint').textContent = q.hint;
  document.getElementById('progress-bar').style.width = `${((i+1)/QUESTIONS.length)*100}%`;
  const box = document.getElementById('options'); box.innerHTML='';
  q.options.forEach((label, idx) => {
    const b=document.createElement('button'); b.className='option'; b.type='button';
    b.innerHTML=`<span class="option-key">${String.fromCharCode(65+idx)}</span><span class="option-text">${label}</span>`;
    if (answers[i] === idx) b.classList.add('selected');
    b.onclick=()=>{ answers[i]=idx; save(); [...box.children].forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); document.getElementById('next').disabled=false; };
    box.appendChild(b);
  });
  document.getElementById('next').textContent = i === QUESTIONS.length-1 ? 'Continue →' : 'Next →';
  document.getElementById('next').disabled = answers[i] === undefined;
  document.getElementById('back').classList.toggle('hidden', i===0);
}
document.getElementById('next').onclick=()=>{
  const i=Number(sessionStorage.getItem('studentCompassQuestion')||'0');
  if(answers[i]===undefined) return;
  if(i<QUESTIONS.length-1){setIndex(i+1); location.reload();} else {location.href='compass-details.html';}
};
document.getElementById('back').onclick=()=>{const i=Number(sessionStorage.getItem('studentCompassQuestion')||'0'); if(i>0){setIndex(i-1); location.reload();}};
render();
