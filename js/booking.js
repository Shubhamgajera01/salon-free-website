
const bookingData = {
  men: [
    ["m1","Men's Haircut",299,"45 min"],["m2","Beard Styling",199,"25 min"],
    ["m3","Hair Styling",499,"45 min"],["m4","Hair Colour",1399,"90 min"],["m5","Hair Spa",999,"60 min"]
  ],
  women: [
    ["w1","Women's Haircut",599,"60 min"],["w2","Hair Styling",799,"60 min"],
    ["w3","Hair Colour",1399,"90 min"],["w4","Hair Spa",999,"60 min"],
    ["w5","Premium Facial",1399,"60 min"],["w6","Cleanup",699,"45 min"],["w7","Party Makeup",2999,"120 min"]
  ],
  kids: [
    ["k1","Kids Haircut",299,"30 min"],["k2","Kids Styling",399,"40 min"]
  ]
};

const state={audience:"",service:null,date:"",time:"",name:"",phone:"",email:"",notes:""};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const params=new URLSearchParams(location.search);
const preselected=params.get("service");

const steps=$$(".booking-step");
function showStep(n){
  steps.forEach((x,i)=>x.classList.toggle("active",i===n));
  $$(".progress-dot").forEach((x,i)=>x.classList.toggle("active",i<=n));
  window.scrollTo({top:0,behavior:"smooth"});
}

function setServiceOptions(audience){
  const list=bookingData[audience]||[];
  const select=$("#service");
  if(!select)return;
  select.innerHTML='<option value="">Select a service</option>'+list.map(x=>`<option value="${x[0]}">${x[1]} — ₹${x[2].toLocaleString("en-IN")}</option>`).join("");
}
function getService(id){
  return Object.values(bookingData).flat().find(x=>x[0]===id);
}
function syncSummary(){
  $("#summaryAudience").textContent=state.audience?state.audience[0].toUpperCase()+state.audience.slice(1):"—";
  $("#summaryService").textContent=state.service?state.service[1]:"—";
  $("#summaryDate").textContent=state.date||"—";
  $("#summaryTime").textContent=state.time||"—";
  $("#summaryName").textContent=state.name||"—";
  $("#summaryPhone").textContent=state.phone||"—";
}
function validPhone(v){return /^[6-9]\d{9}$/.test(v.replace(/\D/g,""))}
function validEmail(v){return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}

function buildMessage(){
  return `Hello Infinity The Family Salon!%0A%0AAppointment Request%0A━━━━━━━━━━━━%0AName: ${encodeURIComponent(state.name)}%0APhone: ${encodeURIComponent(state.phone)}%0AService: ${encodeURIComponent(state.service[1])}%0AAudience: ${encodeURIComponent(state.audience)}%0ADate: ${encodeURIComponent(state.date)}%0ATime: ${encodeURIComponent(state.time)}%0ANotes: ${encodeURIComponent(state.notes||"None")}%0A━━━━━━━━━━━━%0APlease confirm availability.`;
}

document.addEventListener("DOMContentLoaded",()=>{
  const today=new Date();
  const iso=today.toISOString().split("T")[0];
  const date=$("#date"); if(date){date.min=iso; date.value=iso;}

  $$(".audience-card").forEach(btn=>btn.addEventListener("click",()=>{
    state.audience=btn.dataset.audience;
    $$(".audience-card").forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    setServiceOptions(state.audience);
    showStep(1);
  }));

  if(preselected){
    const item=getService(preselected);
    if(item){
      state.audience=item[0][0]==="m"?"men":item[0][0]==="w"?"women":"kids";
      setServiceOptions(state.audience);
      const select=$("#service"); select.value=item[0]; state.service=item;
    }
  }

  $("#service")?.addEventListener("change",e=>{state.service=getService(e.target.value)||null});
  $("#date")?.addEventListener("change",e=>state.date=e.target.value);
  $("#time")?.addEventListener("change",e=>state.time=e.target.value);

  $$(".next-btn").forEach(btn=>btn.addEventListener("click",()=>{
    const target=Number(btn.dataset.next);
    if(target===2 && !state.service){alert("Please select a service.");return}
    if(target===3 && (!state.date||!state.time)){alert("Please choose a date and time.");return}
    if(target===4){
      state.name=$("#name")?.value.trim()||"";
      state.phone=$("#phone")?.value.trim()||"";
      state.email=$("#email")?.value.trim()||"";
      state.notes=$("#notes")?.value.trim()||"";
      if(state.name.length<2){alert("Please enter your name.");return}
      if(!validPhone(state.phone)){alert("Please enter a valid 10-digit Indian mobile number.");return}
      if(!validEmail(state.email)){alert("Please enter a valid email address.");return}
      syncSummary();
    }
    showStep(target);
  }));

  $$(".back-btn").forEach(btn=>btn.addEventListener("click",()=>showStep(Number(btn.dataset.back))));

  $("#bookingForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    state.name=$("#name").value.trim();state.phone=$("#phone").value.trim();
    state.email=$("#email").value.trim();state.notes=$("#notes").value.trim();
    if(!validPhone(state.phone)||!state.service||!state.date||!state.time)return;
    const id="INF-"+Math.floor(100000+Math.random()*900000);
    const booking={
      id,...state,createdAt:new Date().toISOString()
    };
    localStorage.setItem("infinity_last_booking",JSON.stringify(booking));

    // Production mode: submit to Supabase when configured.
    // Demo mode: localStorage remains available when Supabase is not configured.
    if (window.InfinitySupabase) {
      try {
        await window.InfinitySupabase.init();
        if (window.InfinitySupabase.ready) {
          const result = await window.InfinitySupabase.createAppointment(booking);
          if (result.error) throw result.error;
          booking.synced = true;
          localStorage.setItem("infinity_last_booking",JSON.stringify(booking));
        }
      } catch (err) {
        console.error("Supabase booking sync failed:", err);
        alert("Your demo request was saved locally, but online booking sync is not configured yet.");
      }
    }

    $("#bookingId").textContent=id;
    $("#finalService").textContent=state.service[1];
    $("#finalDate").textContent=state.date;
    $("#finalTime").textContent=state.time;
    $("#whatsappLink").href="https://wa.me/?text="+buildMessage();
    $("#emailLink").href="mailto:?subject=Infinity%20Salon%20Appointment%20Request%20"+id+"&body="+buildMessage().replaceAll("%0A","\n");
    showStep(5);
  });
});


/* Phase 10 notification helpers */
function setupBookingNotifications(booking){
  if(!window.InfinityNotifications) return;
  const msg=InfinityNotifications.bookingConfirmation(booking);
  const wa=document.getElementById("customerWhatsApp");
  const mail=document.getElementById("customerEmail");
  if(wa) wa.href=InfinityNotifications.whatsappUrl(msg,booking.phone);
  if(mail && booking.email){
    mail.href=InfinityNotifications.mailto(booking.email,"Infinity appointment request "+booking.id,msg);
  }else if(mail){
    mail.style.display="none";
  }
}
