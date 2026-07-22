// checkout.js
(() => {
let cart = (JSON.parse(localStorage.getItem("cart")) || []).map(i => ({
  name: i.name || "Item",
  price: +i.price || 0,
  qty: +i.qty || 1,
  img: i.img || ""
}));
const $ = id => document.getElementById(id),
checkoutItemsEl = $("checkoutItems"),
totalPriceEl = $("totalPrice"),
emptyMessageEl = $("emptyMessage"),
generateReceiptBtn.addEventListener("click", completeOrder);
continueShoppingBtn = $("continueShopping");

const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

const escapeHtml = s => String(s || "")
.replace(/&/g,"&amp;").replace(/</g,"&lt;")
.replace(/>/g,"&gt;").replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

function updateCartCount() {
  const el = $("cartCount");
  if (el) el.innerText = cart.reduce((t,i)=>t+i.qty,0);
}

function updateTotal() {
  totalPriceEl.innerText = `Total: $${cart.reduce((t,i)=>t+i.price*i.qty,0).toFixed(2)}`;
}

function renderCart() {
  checkoutItemsEl.innerHTML = "";

  if (!cart.length) {
    emptyMessageEl.style.display = "block";
    totalPriceEl.innerText = "Total: $0.00";
    return updateCartCount();
  }

  emptyMessageEl.style.display = "none";

  cart.forEach((item,i)=>{
    checkoutItemsEl.innerHTML += `
    <div class="cart-item">
      <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'">
      <div class="item-info">
        <h3>${escapeHtml(item.name)}</h3>
        <div style="color:#666;">Price: $${item.price.toFixed(2)}</div>
      </div>
      <div class="item-controls">
        <div>
          <label style="font-size:12px;color:#666;margin-right:6px">Qty</label>
          <input class="qty-input" type="number" min="1" value="${item.qty}" data-index="${i}">
        </div>
        <div>
          <div style="font-weight:700;margin-top:6px;">$${(item.price*item.qty).toFixed(2)}</div>
          <button class="remove-btn" data-index="${i}">Remove</button>
        </div>
      </div>
    </div>`;
  });

  updateTotal();
  updateCartCount();
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
  renderCart();
}

function changeQty(i,q){
  cart[i].qty = Math.max(1,+q||1);
  saveCart();
  renderCart();
}

checkoutItemsEl.addEventListener("input",e=>{
  if(e.target.classList.contains("qty-input"))
    changeQty(+e.target.dataset.index,e.target.value);
});

checkoutItemsEl.addEventListener("click",e=>{
  if(e.target.classList.contains("remove-btn"))
    removeItem(+e.target.dataset.index);
});

function completeOrder(){
  if(!cart.length) return alert("Your cart is empty.");
const name = prompt("Enter your name:");
const money = Number(prompt("How much money do you have?"));
const age = Number(prompt("Enter your age:"));

const orderTotal = cart.reduce((total,item)=>total + item.price * item.qty,0);

if(!name){
  alert("Please enter your name.");
  return;
}

if(age < 12){
  alert("You are too young to buy this.");
  return;
}

if(age > 100){
  alert("You cannot buy this because your age is over 100.");
  return;
}

if(money < orderTotal){
  alert(`You don't have enough money. You need $${(orderTotal-money).toFixed(2)} more.`);
  return;
}

const change = money - orderTotal;
alert(`Payment successful! Your change is $${change.toFixed(2)}`);

  let total=0;
  const lines=cart.map((i,n)=>{
    const t=i.price*i.qty;
    total+=t;
    return `${n+1}. ${i.name} — $${i.price.toFixed(2)} x ${i.qty} = $${t.toFixed(2)}`;
  }).join("<br>");

  const w=window.open("","_blank");
  if(!w) return alert("Popup blocked. Please allow popups to view the receipt.");

  w.document.write(`
  <html><head><title>Receipt</title>
  <style>body{font-family:Arial;padding:20px}.total{font-weight:700;margin-top:12px}</style>
  </head><body>
  <h2>Football Top Shop — Receipt</h2>
  <div>Date: ${new Date().toLocaleString()}</div><hr>
  <div>${lines}</div>
  <div class="total">Total: $${total.toFixed(2)}</div><hr>
  <div>Thank you for your purchase!</div>
  </body></html>`);
  w.document.close();

  if(!confirm("Complete order and clear cart?")) return;

  cart=[];
  saveCart();
  renderCart();
  updateCartCount();
  location.href="index.html";
}

continueShoppingBtn.onclick=()=>location.href="index.html";
completeOrderBtn.onclick=completeOrder;

renderCart();
})();