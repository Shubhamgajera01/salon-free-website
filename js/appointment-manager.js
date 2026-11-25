
let bookings=[], selected=null;
let selectedDate=new Date(); selectedDate.setHours(0,0,0,0);

const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,"0");
const dateKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const fmt=d=>d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

function localData(){
 const x=localStorage.getItem("infinity_last_booking");
 return x?[JSON.parse(x)]:[];
}
async function boot(){
 try{
   const session=await InfinityAuth.getSession();
   if(!session){location.replace("admin-login.html");return}
   const profile=await InfinityAuth.getProfile(session.user.id);
   if(!profile){await InfinityAuth.logout();location.replace("admin-login.html");return}
   if(await InfinityAuth.init()){
     const r=await InfinitySupabase.getAppointments();
     if(!r.error) bookings=(r.data||[]).map(x=>({
       id:x.booking_code,remoteId:x.appointment_id,name:x.customer_name,phone:x.phone,email:x.email,
       audience:x.audience,service:x.service_name,date:x.appointment_date,time:x.appointment_time,
       price:x.price,duration:x.duration_minutes,notes:x.notes,status:x.status
     }));
   }
 }catch(e){console.warn(e);bookings=[]}
 if(!bookings.length) bookings=localData();
 render();
}
function filtered(){
 const q=$("search").value.toLowerCase().trim(), st=$("status").value, au=$("audience").value;
 return bookings.filter(b=>b.date===dateKey(selectedDate))
   .filter(b=>st==="all"||b.status===st).filter(b=>au==="all"||b.audience===au)
   .filter(b=>!q||`${b.id} ${b.name} ${b.phone} ${b.service}`.toLowerCase().includes(q));
}
function render(){
 $("dateTitle").textContent=fmt(selectedDate);
 const day=bookings.filter(b=>b.date===dateKey(selectedDate));
 $("dayCount").textContent=day.length;
 $("pending").textContent=day.filter(b=>b.status==="pending").length;
 $("confirmed").textContent=day.filter(b=>b.status==="confirmed").length;
 $("completed").textContent=day.filter(b=>b.status==="completed").length;
 const list=filtered();
 if(!list.length){$("tableWrap").innerHTML='<div class="empty">No appointments for this selection.</div>';return}
 $("tableWrap").innerHTML=`<table><thead><tr><th>Time</th><th>Customer</th><th>Service</th><th>Status</th></tr></thead><tbody>
 ${list.map((b,i)=>`<tr data-id="${esc(b.id)}" style="cursor:pointer"><td>${esc(b.time)}</td><td><b>${esc(b.name)}</b><br><small>${esc(b.phone)}</small></td><td>${esc(b.service)}</td><td><span class="status ${esc(b.status)}">${esc(b.status)}</span></td></tr>`).join("")}
 </tbody></table>`;
}
$("tableWrap").addEventListener("click",e=>{
 const row=e.target.closest("tr[data-id]");if(!row)return;
 selected=bookings.find(b=>b.id===row.dataset.id);renderDetail();
});
function renderDetail(){
 if(!selected){$("detail").innerHTML='<div class="empty">Select an appointment.</div>';return}
 $("detail").innerHTML=`
 <h2>${esc(selected.name)}</h2>
 <div class="row"><span>Booking</span><b>${esc(selected.id)}</b></div>
 <div class="row"><span>Phone</span><b>${esc(selected.phone)}</b></div>
 <div class="row"><span>Service</span><b>${esc(selected.service)}</b></div>
 <div class="row"><span>For</span><b>${esc(selected.audience)}</b></div>
 <div class="row"><span>Date</span><b>${esc(selected.date)}</b></div>
 <div class="row"><span>Time</span><b>${esc(selected.time)}</b></div>
 <div class="row"><span>Price</span><b>₹${esc(selected.price)}</b></div>
 <div class="row"><span>Notes</span><b>${esc(selected.notes||"—")}</b></div>
 <div class="actions">
  <button data-status="confirmed">Confirm</button>
  <button data-status="completed">Complete</button>
  <button data-status="cancelled">Cancel</button>
 </div>`;
}
$("detail").addEventListener("click",async e=>{
 const btn=e.target.closest("[data-status]");if(!btn||!selected)return;
 const status=btn.dataset.status;
 if(!confirm(`Change ${selected.id} to ${status}?`))return;
 if(selected.remoteId && InfinitySupabase.ready){
   const r=await InfinitySupabase.updateStatus(selected.remoteId,status);
   if(r.error)return alert("Could not update appointment.");
 }else{
   selected.status=status;
   localStorage.setItem("infinity_last_booking",JSON.stringify(selected));
 }
 selected.status=status; render(); renderDetail();
});
$("prev").onclick=()=>{selectedDate.setDate(selectedDate.getDate()-1);selected=null;render();renderDetail()};
$("next").onclick=()=>{selectedDate.setDate(selectedDate.getDate()+1);selected=null;render();renderDetail()};
$("today").onclick=()=>{selectedDate=new Date();selectedDate.setHours(0,0,0,0);selected=null;render();renderDetail()};
$("search").oninput=render;$("status").onchange=render;$("audience").onchange=render;
$("logout").onclick=async()=>{await InfinityAuth.logout();location.replace("admin-login.html")};
boot();
