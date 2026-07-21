(function () {let cart = JSON.parse(localStorage.getItem("cart")) || [];const checkoutItemsEl = document.getElementById("checkoutItems");
const totalPriceEl = document.getElementById("totalPrice");const emptyMessageEl = document.getElementById("emptyMessage");
const completeOrderBtn = document.getElementById("completeOrderBtn");const continueShoppingBtn = document.getElementById("continueShopping");
cart = cart.map(item => ({name: item.name || "Item",price: Number(item.price) || 0,
qty: Number(item.qty) || 1,img: item.img || ""}));function renderCart() {
checkoutItemsEl.innerHTML = "";if (!cart.length) {emptyMessageEl.style.display = "block";
totalPriceEl.innerText = "Total: $0.00";updateCartCount();return;} else {
emptyMessageEl.style.display = "none";}
cart.forEach((item, index) => {
const itemEl = document.createElement("div");
itemEl.className = "cart-item";
itemEl.dataset.index = index;
itemEl.innerHTML = `
<img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" onerror="this.style.display='none'">
<div class="item-info">
<h3>${escapeHtml(item.name)}</h3>
<div style="color:#666;">Price: $${Number(item.price).toFixed(2)}</div>
</div>
<div class="item-controls">
<div><label style="font-size:12px;color:#666;margin-right:6px">Qty</label><input class="qty-input" type="number" min="1" value="${item.qty}" data-index="${index}"></div><div><div style="font-weight:700;margin-top:6px;">$${(item.price * item.qty).toFixed(2)}</div><button class="remove-btn" data-index="${index}">Remove</button></div></div>`;checkoutItemsEl.appendChild(itemEl);});updateTotal();updateCartCount();}function updateTotal() {let total = 0;cart.forEach(item => total += item.price * item.qty);totalPriceEl.innerText = "Total: $" + total.toFixed(2);}function saveCart() {localStorage.setItem("cart", JSON.stringify(cart));}
function updateCartCount() {const cartCountEl = document.getElementById("cartCount");
if (cartCountEl) {const totalItems = cart.reduce((sum, it) => sum + Number(it.qty || 0), 0);cartCountEl.innerText = totalItems;}}function removeItem(index) {
cart.splice(index, 1);saveCart();renderCart();}function changeQty(index, newQty) {newQty = Number(newQty);if (isNaN(newQty) || newQty < 1) newQty = 1;cart[index].qty = newQty;saveCart();renderCart();}
checkoutItemsEl.addEventListener("input", function (e) {if (e.target && e.target.classList.contains("qty-input")) {const idx = Number(e.target.dataset.index);changeQty(idx, e.target.value);}
});checkoutItemsEl.addEventListener("click", function (e) {if (e.target && e.target.classList.contains("remove-btn")) {const idx = Number(e.target.dataset.index);removeItem(idx);}});function completeOrder() {if (!cart.length) {alert("Your cart is empty.");return;}let total = 0;
const lines = cart.map((it, i) => {const lineTotal = Number(it.price) * Number(it.qty);total += lineTotal;return `${i + 1}. ${it.name} — $${Number(it.price).toFixed(2)} x ${it.qty} = $${lineTotal.toFixed(2)}`;}).join("<br>");const now = new Date().toLocaleString();const receiptHtml = `<html><head><title>Receipt</title><style>body{font-family:Arial;padding:20px}h2{margin-bottom:6px}.total{font-weight:700;margin-top:12px}</style>
</head><body><h2>Football Top Shop — Receipt</h2><div>Date: ${now}</div><hr><div>${lines}</div><div class="total">Total: $${total.toFixed(2)}</div><hr>
<div>Thank you for your purchase!</div></body></html>`;const w = window.open("", "_blank");if (!w) {alert("Popup blocked. Please allow popups to view the receipt.");return;}w.document.write(receiptHtml);
w.document.close();const confirmed = confirm("Complete order and clear cart?");if (!confirmed) return;
cart = [];saveCart();updateCartCount();renderCart();window.location.href = "index.html";}continueShoppingBtn.addEventListener("click", function () {window.location.href = "index.html";});
completeOrderBtn.addEventListener("click", completeOrder);function escapeHtml(str) {if (!str) return "";return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");}renderCart();})();
