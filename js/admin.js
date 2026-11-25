
const KEY="infinity_last_booking";
let remoteBookings=[];
const rows=document.getElementById("rows"),empty=document.getElementById("empty");
const filter=document.getElementById("statusFilter"),search=document.getElementById("search");

function localBookings(){const x=localStorage.getItem(KEY);return x?[JSON.parse(x)]:[]}
async function load(){
  remoteBookings=[];
  if(window.InfinitySupabase){
    try{
      await window.InfinitySupabase.init();
      if(window.InfinitySupabase.ready){
        const result=await window.InfinitySupabase.getAppointments();
        if(!result.error) remoteBookings=result.data||[];
      }
    }catch(e){console.warn("Remote dashboard unavailable; using demo data.",e)}
  }
  render();
}
function allBookings(){
  if(remoteBookings.length) return remoteBookings.map(x=>({
    id:x.booking_code,name:x.customer_name,phone:x.phone,email:x.email,
    service:[x.service_id,x.service_name,x.price,(x.duration_minutes||0)+" min"],
    date:x.appointment_date,time:x.appointment_time,audience:x.audience,
    notes:x.notes,status:x.status,remoteId:x.appointment_id
  }));
  return localBookings();
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
 const all=allBookings(),q=search.value.toLowerCase().trim();
 const shown=all.filter(b=>(filter.value==="all"||b.status===""+filter.value)&&(!q||`${b.id} ${b.name} ${b.phone}`.toLowerCase().includes(q)));
 document.getElementById("pendingCount").textContent=all.filter(x=>(x.status||"pending")==="pending").length;
 document.getElementById("confirmedCount").textContent=all.filter(x=>x.status==="confirmed").length;
 const today=new Date().toISOString().slice(0,10);
 document.getElementById("todayCount").textContent=all.filter(x=>x.date===today).length;
 document.getElementById("totalCount").textContent=all.length;
 rows.innerHTML=shown.map((b,i)=>`<tr><td><span class="code">${esc(b.id)}</span></td><td><b>${esc(b.name)}</b><br>${esc(b.phone)}</td><td>${esc(b.service?.[1]||"—")}</td><td>${esc(b.date)}</td><td>${esc(b.time)}</td><td><span class="status ${esc(b.status||"pending")}">${esc(b.status||"pending")}</span></td><td><button class="action" data-index="${i}">Change</button></td></tr>`).join("");
 empty.style.display=shown.length?"none":"block";
}
rows.addEventListener("click",async e=>{
 const btn=e.target.closest("[data-index]");if(!btn)return;
 const all=allBookings(),b=all[Number(btn.dataset.index)];
 const next=prompt("Set status: pending, confirmed, completed or cancelled",b.status||"pending");
 if(!["pending","confirmed","completed","cancelled"].includes(next))return;
 if(b.remoteId && window.InfinitySupabase?.ready){
   const result=await window.InfinitySupabase.updateStatus(b.remoteId,next);
   if(result.error)return alert("Could not update the online appointment.");
   await load();
 }else{
   const local=localBookings(); if(local[Number(btn.dataset.index)]){local[Number(btn.dataset.index)].status=next;localStorage.setItem(KEY,JSON.stringify(local[Number(btn.dataset.index)]));}
   render();
 }
});
filter.addEventListener("change",render);search.addEventListener("input",render);
document.getElementById("clearDemo").addEventListener("click",()=>{if(confirm("Clear local demo appointment?")){localStorage.removeItem(KEY);render()}});
load();
