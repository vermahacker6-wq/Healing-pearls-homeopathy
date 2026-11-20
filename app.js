const $ = (s) => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();
$('#menuToggle').addEventListener('click', () => $('#nav').classList.toggle('open'));
$('#nav').querySelectorAll('a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

async function submitForm(form, endpoint, statusEl) {
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());
  if (form.querySelector('[name="consent_to_display"]')) data.consent_to_display = form.querySelector('[name="consent_to_display"]').checked;
  button.disabled = true; statusEl.textContent = 'Sending...';
  try {
    const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to submit. Please try again.');
    statusEl.textContent = result.message || 'Submitted successfully.';
    form.reset();
  } catch (e) { statusEl.textContent = e.message; }
  finally { button.disabled = false; }
}
$('#feedbackForm').addEventListener('submit', e => {e.preventDefault(); submitForm(e.currentTarget,'/api/feedback',$('#feedbackStatus'));});
$('#contactForm').addEventListener('submit', e => {e.preventDefault(); submitForm(e.currentTarget,'/api/contact',$('#contactStatus'));});

(async()=>{try{const r=await fetch('/api/approved-feedback');if(!r.ok)return;const d=await r.json();const box=$('#approvedFeedback');d.items.forEach(item=>{const card=document.createElement('article');card.className='feedback-item';const h=document.createElement('h3');h.textContent=`${item.display_name||'Patient'} • ${item.rating}/5`;const p=document.createElement('p');p.textContent=item.message;card.append(h,p);box.append(card)})}catch{}})();
