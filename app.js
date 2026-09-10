const cfg=window.APP_CONFIG;
const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
const form=document.querySelector('#leadForm');
const statusBox=document.querySelector('#status');
const submitBtn=document.querySelector('#submitBtn');
function text(id){return document.querySelector(id).value.trim()}
function selectedNeeds(){return [...document.querySelectorAll('input[name="needs"]:checked')].map(x=>x.value)}
form.addEventListener('submit',async(e)=>{
 e.preventDefault(); statusBox.className='status'; statusBox.textContent='';
 const website=text('#website'); if(website) return;
 const email=text('#email'),phone=text('#phone');
 if(!email && !phone){statusBox.className='status err';statusBox.textContent='Please provide an email address or phone number.';return}
 const consent=document.querySelector('#consent').checked;
 if(!consent){statusBox.className='status err';statusBox.textContent='Please confirm permission to follow up.';return}
 submitBtn.disabled=true;submitBtn.textContent='Submitting...';
 const payload={full_name:text('#fullName'),address:text('#address')||null,email:email||null,phone:phone||null,working_with_agent:document.querySelector('input[name="agent"]:checked')?.value||null,current_needs:selectedNeeds(),notes:text('#notes')||null,source:new URLSearchParams(location.search).get('source')||'direct',consent_to_contact:true,user_agent:navigator.userAgent};
 const {error}=await client.from('leads').insert(payload);
 if(error){console.error(error);statusBox.className='status err';statusBox.textContent='The submission could not be saved. Please try again.'}
 else{form.reset();statusBox.className='status ok';statusBox.textContent='Thank you. Your information has been submitted successfully.'}
 submitBtn.disabled=false;submitBtn.textContent='Submit information';
});
