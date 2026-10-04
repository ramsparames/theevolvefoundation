const answers=JSON.parse(sessionStorage.getItem('studentCompassAnswersV3')||'[]');
const name=sessionStorage.getItem('studentCompassLeadName')||'there';
const states={
 bearings:{title:'Finding Your Bearings',summary:"You're still figuring out what fits you and what matters to you. That is a perfectly useful place to be.",stepTitle:'Start with yourself',step:'Spend a little time noticing what you naturally enjoy, what you do well and what brings out your best. You do not need to choose a direction yet.',launch:'If you want guided support to understand yourself better, Launchpad can help you start there.'},
 exploring:{title:'Looking Around',summary:"You have some interests and possibilities in mind, but you need more experience to know which ones are worth exploring.",stepTitle:'Explore one thing',step:'Pick one thing you are curious about. Talk to someone, try something small or find a real experience that lets you learn more about it.',launch:'If you want a structured space to explore yourself and possible directions, Launchpad can help.'},
 direction:{title:'Finding a Direction',summary:"You have something in mind, but you are still working out whether it is a direction worth pursuing.",stepTitle:'Test before you decide',step:'Choose one small way to learn more about the direction. Look for evidence from people, experiences or experiments rather than trying to predict the whole future.',launch:'If you want help turning a possible direction into a thoughtful decision, Launchpad is designed for that.'},
 moving:{title:'Ready to Move',summary:"You have a direction in mind. The useful question now is not “Is this definitely right?” but “What can I do next to learn more?”",stepTitle:'Take one concrete step',step:'Choose one action you can complete in the next 30 days. Do it, notice what you learn and adjust from there.',launch:'You may not need a programme right now. If you want structured accountability and reflection, Launchpad is there when you need it.'}
};
function getState(){
 const scores={bearings:0,exploring:0,direction:0,moving:0};
 const map=[['bearings','exploring','direction','moving'],['bearings','exploring','direction','moving'],['bearings','exploring','exploring','moving'],['bearings','exploring','direction','moving'],['bearings','exploring','direction','moving'],['bearings','exploring','direction','moving'],['bearings','exploring','direction','moving'],['bearings','exploring','direction','moving']];
 answers.forEach((v,i)=>{ if(map[i]&&map[i][v]) scores[map[i][v]]+=1; });
 return Object.keys(scores).sort((a,b)=>scores[b]-scores[a])[0]||'bearings';
}
const state=states[getState()];
document.getElementById('state-title').textContent=state.title;
document.getElementById('state-summary').textContent=state.summary;
document.getElementById('step-title').textContent=state.stepTitle;
document.getElementById('step-text').textContent=state.step;
document.getElementById('launch-text').textContent=state.launch;
