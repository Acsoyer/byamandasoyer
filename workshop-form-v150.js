document.querySelector('.workshop-footer-links')?.remove();

function buildQuantityPicker(){
  const select=$('qty');if(!select)return;
  const field=select.closest('.field');field?.classList.add('qty-field');
  let custom=document.getElementById('customQty');
  if(!custom){custom=document.createElement('div');custom.id='customQty';custom.className='custom-qty';custom.innerHTML='<button type="button" class="custom-qty-button" aria-haspopup="listbox" aria-expanded="false">1 participant</button><div class="custom-qty-menu" role="listbox"></div>';select.after(custom);custom.querySelector('button').onclick=()=>{const menu=custom.querySelector('.custom-qty-menu'),open=!menu.classList.contains('show');menu.classList.toggle('show',open);custom.querySelector('button').setAttribute('aria-expanded',String(open))};document.addEventListener('click',e=>{if(!custom.contains(e.target)){custom.querySelector('.custom-qty-menu').classList.remove('show');custom.querySelector('button').setAttribute('aria-expanded','false')}})}
  const values=[...select.options].map(o=>o.value),value=select.value||values[0]||'1',menu=custom.querySelector('.custom-qty-menu');
  custom.querySelector('.custom-qty-button').textContent=`${value} participant${value==='1'?'':'s'}`;
  menu.innerHTML=values.map(v=>`<button type="button" class="custom-qty-option ${v===value?'selected':''}" role="option" aria-selected="${v===value}" data-value="${v}">${v}</button>`).join('');
  menu.querySelectorAll('button').forEach(button=>button.onclick=()=>{select.value=button.dataset.value;select.dispatchEvent(new Event('change',{bubbles:true}));buildQuantityPicker();menu.classList.remove('show')});
}
const v150RenderSessions=renderSessions;renderSessions=function(){v150RenderSessions();buildQuantityPicker()};
const v150Choose=choose;choose=function(id){v150Choose(id);buildQuantityPicker()};

updateTimer=function(){if(!hold)return;$('timer').classList.remove('hidden');const remaining=Math.max(0,holdUntil-Date.now()),clock=`${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,'0')}`;$('timer').innerHTML=remaining?`When you started this booking, these places were reserved for you. Complete the process within <strong>${clock}</strong> to keep your workshop spots.`:'<strong>Your workshop hold has expired.</strong> Return to the first step to reserve again.';if(remaining)setTimeout(updateTimer,1000)};

renderSummary=function(){
  document.querySelectorAll('.review-customer').forEach(el=>el.remove());
  const name=safeText($('name').value),phone=safeText(`${$('countryCode').value} ${$('phone').value}`.trim());
  $('summary').innerHTML=`<div><span>Workshop</span><b>${dateText(selected)}</b></div><div><span>Time</span><b>${String(selected.start_time).slice(0,5)}–${String(selected.end_time).slice(0,5)}</b></div><div><span>Participants</span><b>${$('qty').value}</b></div><div><span>Flavours</span><b>${flavourValues.map(safeText).join(', ')}</b></div><div><span>Total</span><b>${money(selected.price_cents*Number($('qty').value))}</b></div>`;
  $('summary').insertAdjacentHTML('beforebegin',`<div class="review-customer"><strong>${name}</strong><span>${phone}</span></div>`);
};

const paymentStep=document.querySelector('[data-step="4"]');
if(paymentStep){const firstPay=paymentStep.querySelector('.pay');if(firstPay&&!paymentStep.querySelector('.payment-method-heading'))firstPay.insertAdjacentHTML('beforebegin','<div class="payment-method-heading">Payment method</div>')}

const proof=$('proof'),proofLabel=document.querySelector('.proof-upload');let proofPreviewUrl='';
function uploadIcon(){return '<span class="proof-upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"></path><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"></path></svg></span>'}
function renderProofState(){if(!proof||!proofLabel)return;const file=proof.files?.[0];proofLabel.classList.toggle('has-file',!!file);if(!file){proofLabel.innerHTML=`${uploadIcon()}<span class="proof-upload-copy"><b>Tap here to upload your payment proof</b><small>Screenshot, image or PDF · max 10 MB</small></span>`;return}if(proofPreviewUrl)URL.revokeObjectURL(proofPreviewUrl);const image=file.type.startsWith('image/');proofPreviewUrl=image?URL.createObjectURL(file):'';proofLabel.innerHTML=`${image?`<img class="proof-thumb" src="${proofPreviewUrl}" alt="Selected payment proof">`:'<span class="proof-pdf">PDF</span>'}<span class="proof-upload-copy"><b>✓ Payment proof added</b><small>${safeText(file.name)}</small></span>`}
if(proof){proof.addEventListener('change',renderProofState);renderProofState()}

const v150Draw=draw;draw=function(){v150Draw();document.querySelectorAll('.review-customer').forEach((el,i)=>{if(i>0)el.remove()});if(step===1)requestAnimationFrame(buildQuantityPicker)};draw();
