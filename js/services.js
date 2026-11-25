
const services = [
  {id:"m1",cat:"men",tag:"Men",icon:"✂",name:"Men's Haircut",price:299,duration:"45 min",desc:"Clean, sharp and tailored to your face shape."},
  {id:"m2",cat:"men",tag:"Men",icon:"◒",name:"Beard Styling",price:199,duration:"25 min",desc:"Shape, define and finish your beard with precision."},
  {id:"m3",cat:"men",tag:"Men",icon:"✦",name:"Hair Styling",price:499,duration:"45 min",desc:"A polished finish for parties, events or everyday style."},
  {id:"m4",cat:"men",tag:"Men",icon:"◉",name:"Hair Colour",price:1399,duration:"90 min",desc:"Professional colour service with a personalised finish."},
  {id:"m5",cat:"men",tag:"Men",icon:"≈",name:"Hair Spa",price:999,duration:"60 min",desc:"Relax, nourish and refresh tired hair and scalp."},
  {id:"w1",cat:"women",tag:"Women",icon:"✂",name:"Women's Haircut",price:599,duration:"60 min",desc:"A personalised cut designed around your style."},
  {id:"w2",cat:"women",tag:"Women",icon:"✦",name:"Hair Styling",price:799,duration:"60 min",desc:"Volume, waves, sleek looks and occasion styling."},
  {id:"w3",cat:"women",tag:"Women",icon:"◉",name:"Hair Colour",price:1399,duration:"90 min",desc:"Refresh your look with a beautiful colour finish."},
  {id:"w4",cat:"women",tag:"Women",icon:"≈",name:"Hair Spa",price:999,duration:"60 min",desc:"A relaxing care ritual for softer, healthier-looking hair."},
  {id:"w5",cat:"women",tag:"Women",icon:"◇",name:"Premium Facial",price:1399,duration:"60 min",desc:"Glow-focused facial care for a refreshed finish."},
  {id:"w6",cat:"women",tag:"Women",icon:"○",name:"Cleanup",price:699,duration:"45 min",desc:"Quick, refreshing skin care for a clean, fresh look."},
  {id:"w7",cat:"women",tag:"Women",icon:"♢",name:"Party Makeup",price:2999,duration:"120 min",desc:"Event-ready makeup for your special moments."},
  {id:"k1",cat:"kids",tag:"Kids",icon:"✂",name:"Kids Haircut",price:299,duration:"30 min",desc:"Comfortable, neat and kid-friendly haircut service."},
  {id:"k2",cat:"kids",tag:"Kids",icon:"★",name:"Kids Styling",price:399,duration:"40 min",desc:"Fun, tidy styling for celebrations and special days."}
];

const grid = document.getElementById("serviceGrid");
const search = document.getElementById("serviceSearch");
const empty = document.getElementById("emptyState");
let activeCategory = "all";

function money(n){ return "₹" + n.toLocaleString("en-IN"); }

function render(){
  const q = search.value.trim().toLowerCase();
  const filtered = services.filter(s =>
    (activeCategory === "all" || s.cat === activeCategory) &&
    (!q || `${s.name} ${s.tag} ${s.desc}`.toLowerCase().includes(q))
  );

  grid.innerHTML = filtered.map(s => `
    <article class="service-card">
      <span class="service-tag">${s.tag}</span>
      <div class="service-icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="service-meta">
        <div class="service-price">${money(s.price)} <small>starting</small></div>
        <div class="service-duration">${s.duration}</div>
      </div>
      <a class="card-book" href="booking.html?service=${encodeURIComponent(s.id)}">Book this service →</a>
    </article>
  `).join("");

  empty.hidden = filtered.length !== 0;
}

document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    render();
  });
});
search.addEventListener("input", render);
render();
