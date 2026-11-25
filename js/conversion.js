
(function(){
 const btns=document.querySelectorAll("[data-booking-cta]");
 btns.forEach(btn=>btn.addEventListener("click",()=>localStorage.setItem("infinity_cta_clicked",new Date().toISOString())));
 const nav=document.querySelectorAll("a[href='booking.html']");
 nav.forEach(a=>a.addEventListener("click",()=>localStorage.setItem("infinity_booking_intent",new Date().toISOString())));
})();
