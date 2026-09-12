const products = [
  {id:1,name:"Classic Black Shirt",category:"men",price:18500,image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Minimalist Blazer",category:"women",price:35000,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Premium White T-Shirt",category:"unisex",price:12500,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Casual Denim Jacket",category:"unisex",price:28000,image:"https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Elegant Black Dress",category:"women",price:32000,image:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Relaxed Fit Trousers",category:"men",price:22000,image:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Classic Hoodie",category:"unisex",price:24000,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Leather Handbag",category:"women",price:29500,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"}
];

let cart = JSON.parse(localStorage.getItem("urbanThreadCart")) || [];

const productsEl = document.getElementById("products");
const filter = document.getElementById("categoryFilter");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function money(value){
  return "₦" + value.toLocaleString("en-NG");
}

function renderProducts(category="all"){
  const list = category === "all" ? products : products.filter(p=>p.category===category);
  productsEl.innerHTML = list.map(p=>`
    <article class="product">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id){
  const item = products.find(p=>p.id===id);
  const existing = cart.find(p=>p.id===id);
  if(existing) existing.qty++;
  else cart.push({...item,qty:1});
  saveCart();
  alert(item.name + " added to your cart.");
}

function removeFromCart(id){
  cart = cart.filter(item=>item.id!==id);
  saveCart();
  renderCart();
}

function saveCart(){
  localStorage.setItem("urbanThreadCart",JSON.stringify(cart));
  updateCount();
}

function updateCount(){
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
}

function renderCart(){
  if(!cart.length){
    cartItems.innerHTML='<p class="empty">Your cart is empty.</p>';
    cartTotal.textContent="₦0";
    return;
  }
  cartItems.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.qty} × ${money(item.price)}</small>
      </div>
      <div>
        <strong>${money(item.price*item.qty)}</strong><br>
        <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join("");
  cartTotal.textContent=money(cart.reduce((sum,item)=>sum+item.price*item.qty,0));
}

function whatsappMessage(){
  if(!cart.length) return "Hello Urban Thread, I would like to make an enquiry about your products.";
  const lines=cart.map(i=>`• ${i.name} x${i.qty} — ${money(i.price*i.qty)}`).join("\n");
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  return `Hello Urban Thread, I would like to place an order:\n\n${lines}\n\nTotal: ${money(total)}`;
}

document.getElementById("cartBtn").onclick=()=>{renderCart();cartModal.classList.add("open")};
document.getElementById("closeCart").onclick=()=>cartModal.classList.remove("open");
cartModal.addEventListener("click",e=>{if(e.target===cartModal)cartModal.classList.remove("open")});

document.getElementById("checkoutBtn").onclick=()=>{
  window.open("https://wa.me/2348000000000?text="+encodeURIComponent(whatsappMessage()),"_blank");
};

document.getElementById("whatsappBtn").href=
  "https://wa.me/2348000000000?text="+encodeURIComponent("Hello Urban Thread, I would like to enquire about your products.");

filter.addEventListener("change",e=>renderProducts(e.target.value));

document.getElementById("menuBtn").onclick=()=>{
  document.getElementById("navLinks").classList.toggle("show");
};

document.querySelectorAll("#navLinks a").forEach(a=>{
  a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("show"));
});

document.getElementById("year").textContent=new Date().getFullYear();

renderProducts();
updateCount();
