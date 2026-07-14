// script.js - replacement
console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartPanel = document.getElementById("cartPanel");

  // Render cart panel and badge
  function renderCartUI() {
    const totalItems = cart.reduce((s, it) => s + (Number(it.qty) || 0), 0);
    if (cartCount) cartCount.innerText = totalItems;

    if (!cartItems) return;
    cartItems.innerHTML = "";

    if (!cart.length) {
      cartItems.innerHTML = `<p style="color:#666">Cart is empty</p>`;
      return;
    }

    cart.forEach((item, idx) => {
      cartItems.innerHTML += `
        <div class="cart-item" data-index="${idx}">
          <div style="display:flex;gap:8px;align-items:center;">
            ${item.img ? `<img src="${escapeHtml(item.img)}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">` : ""}
            <div>
              <p style="margin:0;font-weight:600;">${escapeHtml(item.name)}</p>
              <p style="margin:0;color:#666;">$${Number(item.price).toFixed(2)} x ${item.qty}</p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
            <input class="cart-qty-input" data-index="${idx}" type="number" min="1" value="${item.qty}" style="width:56px;padding:6px;border-radius:6px;border:1px solid #ddd;">
            <button class="remove-from-cart" data-index="${idx}" style="background:transparent;border:none;color:#c33;cursor:pointer;">Remove</button>
          </div>
        </div>
      `;
    });

    // Add receipt button at bottom
    cartItems.innerHTML += `
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:space-between;align-items:center;">
        <div style="color:#666">Items: ${cart.reduce((s, it) => s + Number(it.qty), 0)}</div>
        <div>
          <button id="generateReceiptBtn" style="padding:8px 12px;border-radius:8px;border:none;background:#000;color:#fff;cursor:pointer;">Generate Receipt</button>
        </div>
      </div>
    `;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Add item (merge by name+price)
  function addToCart(item) {
    item.qty = Number(item.qty) || 1;
    item.price = Number(item.price) || 0;
    const existing = cart.find(c => c.name === item.name && Number(c.price) === Number(item.price));
    if (existing) existing.qty = Number(existing.qty || 0) + item.qty;
    else cart.push(item);
    saveCart();
    renderCartUI();
    animateCartCount();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartUI();
  }

  function changeQty(index, qty) {
    qty = Number(qty) || 1;
    if (cart[index]) {
      cart[index].qty = qty;
      saveCart();
      renderCartUI();
    }
  }

  function animateCartCount() {
    if (!cartCount) return;
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 300);
  }

  // Event delegation: Add to Cart buttons
  document.body.addEventListener("click", function (e) {
    const addBtn = e.target.closest && e.target.closest(".addToCart");
    if (!addBtn) return;

    // Prevent navigation if inside <a>
    e.preventDefault();
    e.stopPropagation();

    const name = addBtn.dataset.name || (addBtn.closest(".af") && addBtn.closest(".af").querySelector("h2")?.innerText) || "Item";
    const price = Number(addBtn.dataset.price || 0);
    const img = addBtn.dataset.img || (addBtn.closest(".af") && addBtn.closest(".af").querySelector("img")?.src) || "";

    addToCart({ name: name.trim(), price, img, qty: 1 });
  });

  // Event delegation: cart panel remove and qty change and receipt
  document.body.addEventListener("click", function (e) {
    const rem = e.target.closest && e.target.closest(".remove-from-cart");
    if (rem) {
      const idx = Number(rem.dataset.index);
      removeFromCart(idx);
      return;
    }

    const receiptBtn = e.target.closest && e.target.closest("#generateReceiptBtn");
    if (receiptBtn) {
      generateReceipt();
      return;
    }
  });

  cartItems && cartItems.addEventListener("input", function (e) {
    const input = e.target.closest && e.target.closest(".cart-qty-input");
    if (!input) return;
    const idx = Number(input.dataset.index);
    changeQty(idx, input.value);
  });

  // Toggle cart panel
  window.toggleCart = function () {
    if (!cartPanel) return;
    cartPanel.classList.toggle("open");
  };

  window.goToCheckout = function () {
    window.location.href = "checkout.html";
  };

  // Receipt generator: opens printable receipt and clears cart on confirm
  function generateReceipt() {
    if (!cart.length) {
      alert("Cart is empty.");
      return;
    }

    let total = 0;
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
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup blocked. Please allow popups to view the receipt.");
      return;
    }
    w.document.write(receiptHtml);
    w.document.close();

    // Ask user to confirm clearing cart
    const confirmed = confirm("Order complete? This will clear the cart.");
    if (confirmed) {
      cart = [];
      saveCart();
      renderCartUI();
      animateCartCount();
    }
  }

  // Initialize
  renderCartUI();

  // Expose for debugging
  window._cart = { get: () => cart, add: addToCart, remove: removeFromCart };
});
