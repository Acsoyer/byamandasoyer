let v151TimerHandle=0;
function positionWorkshopTimer(){const timer=$('timer');if(!timer)return;timer.classList.toggle('review-timer',step===4);if(step===4&&proofLabel)proofLabel.before(timer);else document.querySelector('.app').appendChild(timer)}
updateTimer=function(){clearTimeout(v151TimerHandle);if(!hold)return;const timer=$('timer');timer.classList.remove('hidden');positionWorkshopTimer();const remaining=Math.max(0,holdUntil-Date.now()),clock=`${Math.floor(remaining/60000)}:${String(Math.floor(remaining/1000)%60).padStart(2,'0')}`;timer.innerHTML=remaining?`<span>Your spot(s) has been reserved.</span><span>To keep your workshop spot, complete the process within <strong>${clock}</strong></span>`:'<strong>Your workshop hold has expired.</strong>';if(remaining)v151TimerHandle=setTimeout(updateTimer,1000)};

const v151Draw=draw;draw=function(){v151Draw();positionWorkshopTimer();if(hold&&step<5)updateTimer();else clearTimeout(v151TimerHandle)};

copyPayment=async function(event,text){
  event.preventDefault();event.stopPropagation();
  const button=event.currentTarget,pay=button.closest('.pay'),radio=pay?.querySelector('input[type="radio"]'),number=pay?.querySelector('.pay-info span');
  document.querySelectorAll('.pay').forEach(el=>el.classList.remove('payment-selected'));pay?.classList.add('payment-selected');
  if(radio){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}))}
  try{await navigator.clipboard.writeText(text)}catch(_){const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove()}
  number?.classList.add('copy-flash');const old=button.textContent;button.textContent='Copied ✓';button.classList.add('ok');
  setTimeout(()=>{number?.classList.remove('copy-flash');button.textContent=old;button.classList.remove('ok')},1000);
};

document.querySelectorAll('[name="payment"]').forEach(radio=>radio.addEventListener('change',()=>{document.querySelectorAll('.pay').forEach(pay=>pay.classList.toggle('payment-selected',pay.contains(radio)&&radio.checked))}));
draw();
