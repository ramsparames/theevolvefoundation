const form=document.getElementById('lead-form');
const error=document.getElementById('form-error');
form.addEventListener('submit',async(e)=>{
 e.preventDefault(); error.classList.add('hidden');
 const answers=JSON.parse(sessionStorage.getItem('studentCompassAnswersV3')||'[]');
 if(answers.length!==8 || answers.some(v=>v===undefined)){error.textContent='Please complete all eight reflections first.';error.classList.remove('hidden');return;}
 const data=Object.fromEntries(new FormData(form).entries());
 const btn=form.querySelector('button[type="submit"]'); btn.disabled=true; btn.textContent='Preparing your Compass…';
 try{
   const response=await fetch('/api/student-compass/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name,email:data.email,phone:data.phone,website:data.website,answers,submissionId:`${Date.now()}-${Math.random().toString(36).slice(2)}`})});
   const payload=await response.json();
   if(!response.ok||!payload.ok) throw new Error(payload.message||'Something went wrong.');
   sessionStorage.setItem('studentCompassLeadName',data.name);
   location.href='compass-result.html';
 }catch(err){error.textContent=err.message||'We could not send your reflection just now. Please try again.';error.classList.remove('hidden');btn.disabled=false;btn.textContent='Show me my Compass →';}
});