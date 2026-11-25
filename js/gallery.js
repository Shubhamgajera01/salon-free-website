
const galleryItems = [
 {type:"hair", title:"Hair Styling", src:"https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80"},
 {type:"salon", title:"Salon Experience", src:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80"},
 {type:"hair", title:"Professional Finish", src:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80"},
 {type:"beauty", title:"Beauty Care", src:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80"},
 {type:"hair", title:"Fresh Look", src:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"},
 {type:"salon", title:"Your Next Visit", src:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"}
];
const grid=document.getElementById("galleryGrid");
function renderGallery(filter="all"){
 const items=filter==="all"?galleryItems:galleryItems.filter(x=>x.type===filter);
 grid.innerHTML=items.map(x=>`<figure class="gallery-card"><img src="${x.src}" alt="${x.title}" loading="lazy"><figcaption class="gallery-caption">${x.title}</figcaption></figure>`).join("");
}
document.querySelectorAll(".gallery-filter").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".gallery-filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderGallery(b.dataset.filter);
}));
renderGallery();
