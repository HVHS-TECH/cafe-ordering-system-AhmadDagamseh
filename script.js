console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount"),
      cartItems = document.getElementById("cartItems"),
      cartPanel = document.getElementById("cartPanel");

const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

const escapeHtml = str => String(str || "")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

function renderCartUI() {
  if (cartCount)
    cartCount.innerText = cart.reduce((s,i)=>s+(+i.qty||0),0);

  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `<p style="color:#666">Cart is empty</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item,idx)=>`
    <div class="cart-item" data-index="${idx}">
      <div style="display:flex;gap:8px;align-items:center;">
        ${item.img?`<img src="${escapeHtml(item.img)}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">`:""}
        <div>
          <p style="margin:0;font-weight:600;">${escapeHtml(item.name)}</p>
          <p style="margin:0;color:#666;">$${(+item.price).toFixed(2)} x ${item.qty}</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
        <input class="cart-qty-input" data-index="${idx}" type="number" min="1"
        value="${item.qty}" style="width:56px;padding:6px;border-radius:6px;border:1px solid #ddd;">
        <button class="remove-from-cart" data-index="${idx}"
        style="background:transparent;border:none;color:#c33;cursor:pointer;">
        Remove</button>
      </div>
    </div>
  `).join("") + `
  <div style="margin-top:12px;display:flex;gap:8px;justify-content:space-between;align-items:center;">
    <div style="color:#666">Items: ${cart.reduce((s,i)=>s+ +i.qty,0)}</div>
    <button id="generateReceiptBtn"
    style="padding:8px 12px;border-radius:8px;border:none;background:#000;color:#fff;cursor:pointer;">
    Generate Receipt</button>
  </div>`;
}

function addToCart(item){
  item.qty=+item.qty||1;
  item.price=+item.price||0;

  const existing=cart.find(c=>c.name===item.name && +c.price===item.price);

  existing ? existing.qty+=item.qty : cart.push(item);

  saveCart();
  renderCartUI();
  animateCartCount();
}

const removeFromCart=i=>{
  cart.splice(i,1);
  saveCart();
  renderCartUI();
};

function changeQty(i,qty){
  if(!cart[i]) return;
  cart[i].qty=+qty||1;
  saveCart();
  renderCartUI();
}

function animateCartCount(){
  if(!cartCount) return;
  cartCount.classList.add("pop");
  setTimeout(()=>cartCount.classList.remove("pop"),300);
}

document.body.addEventListener("click",e=>{
  const addBtn=e.target.closest(".addToCart");

  if(addBtn){
    e.preventDefault();
    e.stopPropagation();

    const card=addBtn.closest(".af");

    addToCart({
      name:(addBtn.dataset.name||card?.querySelector("h2")?.innerText||"Item").trim(),
      price:+addBtn.dataset.price||0,
      img:addBtn.dataset.img||card?.querySelector("img")?.src||"",
      qty:1
    });

    return;
  }

  const rem=e.target.closest(".remove-from-cart");
  if(rem) return removeFromCart(+rem.dataset.index);

  if(e.target.closest("#generateReceiptBtn"))
    generateReceipt();
});

cartItems?.addEventListener("input",e=>{
  const input=e.target.closest(".cart-qty-input");
  if(input) changeQty(+input.dataset.index,input.value);
});

window.toggleCart=()=>cartPanel?.classList.toggle("open");
window.goToCheckout=()=>location.href="checkout.html";

function generateReceipt(){
  if(!cart.length){
    alert("Cart is empty.");
    return;
  }

  let total=0;
const lines = cart.map((it, i) => {
const lineTotal = Number(it.price) * Number(it.qty);
total += lineTotal;
return `${i + 1}. ${it.name} — $${Number(it.price).toFixed(2)} x ${it.qty} = $${lineTotal.toFixed(2)}`;
}).join("<br>");
const now = new Date().toLocaleString();
const receiptHtml = `
<html>
<head>
<title>Receipt</title>
<style>
body { font-family: Arial, sans-serif; padding:20px; color:#111; }
h2 { margin-bottom:6px; }
.line { margin:6px 0; }
.total { font-weight:700; margin-top:12px; }
</style>
</head>
<body>
<h2>Football Top Shop — Receipt</h2>
<div>Date: ${now}</div>
<hr>
<div>${lines}</div>
<div class="total">Total: $${total.toFixed(2)}</div>
<hr>
<div>Thank you for your purchase!</div>
</body>
</html>`;
const w = window.open("", "_blank");
if (!w) {
alert("Popup blocked. Please allow popups to view the receipt.");
return;}
w.document.write(receiptHtml);
w.document.close();
const confirmed = confirm("Order complete? This will clear the cart.");
if (confirmed) {
cart = [];
saveCart();
renderCartUI();
animateCartCount();}}
renderCartUI();
window._cart = { get: () => cart, add: addToCart, remove: removeFromCart };
});
let _searchTimeout = null;
window.searchProducts = function () {
clearTimeout(_searchTimeout);
_searchTimeout = setTimeout(() => {
const input = document.getElementById("searchInput");
if (!input) return;
const q = input.value.trim().toLowerCase();
const products = document.querySelectorAll(".af");
let anyVisible = false;
products.forEach(product => {
const titleEl = product.querySelector("h2");
const title = titleEl ? titleEl.innerText.trim().toLowerCase() : "";

      // if title missing, try alt text of image as fallback
      if (!title && product.querySelector("img")) {
        const alt = product.querySelector("img").alt || "";
        if (alt) title = alt.trim().toLowerCase();
      }

      // decide visibility
      const visible = q === "" || (title && title.includes(q));
      product.style.display = visible ? "" : "none";
      if (visible) anyVisible = true;
    });

    // optional: show a no-results message
    let noResults = document.getElementById("noResultsMessage");
    if (!noResults) {
      noResults = document.createElement("div");
      noResults.id = "noResultsMessage";
      noResults.style.textAlign = "center";
      noResults.style.color = "#666";
      noResults.style.marginTop = "18px";
      noResults.innerText = "No products match your search.";
      const container = document.querySelector(".containor") || document.body;
      container.parentNode.insertBefore(noResults, container.nextSibling);
    }
    noResults.style.display = anyVisible ? "none" : "block";
  }, 180); // 180ms debounce
};
