console.log("script.js loaded");

document.addEventListener("DOMContentLoaded",()=>{
let cart=JSON.parse(localStorage.getItem("cart"))||[];

const  cartCount=document.getElementById("cartCount"),
      cartItems=document.getElementById("cartItems"),
      cartPanel=document.getElementById("cartPanel");

const saveCart=()=>localStorage.setItem("cart",JSON.stringify(cart));

const escapeHtml=s=>String(s||"")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

function renderCartUI(){
  if(cartCount)cartCount.innerText=cart.reduce((t,i)=>t+(+i.qty||0),0);
  if(!cartItems)return;

  if(!cart.length){
    cartItems.innerHTML='<p style="color:#666">Cart is empty</p>';
    return;
  }

  cartItems.innerHTML=cart.map((i,x)=>`
<div class="cart-item" data-index="${x}">
<div style="display:flex;gap:8px;align-items:center;">
${i.img?`<img src="${escapeHtml(i.img)}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">`:""}
<div>
<p style="margin:0;font-weight:600;">${escapeHtml(i.name)}</p>
<p style="margin:0;color:#666;">$${(+i.price).toFixed(2)} x ${i.qty}</p>
</div>
</div>

<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
<input class="cart-qty-input" data-index="${x}" type="number" min="1" value="${i.qty}">
<button class="remove-from-cart" data-index="${x}">Remove</button>
</div>
</div>`).join("")+`

<div style="margin-top:12px;color:#666">
Items: ${cart.reduce((t,i)=>t+ +i.qty,0)}
</div>`;
}

function addToCart(item){
  item.qty=+item.qty||1;
  item.price=+item.price||0;

  const e=cart.find(c=>c.name===item.name&&+c.price===item.price);

  e?e.qty+=item.qty:cart.push(item);

  saveCart();
  renderCartUI();
  animateCartCount();
}

const removeFromCart=i=>{
  cart.splice(i,1);
  saveCart();
  renderCartUI();
};

const changeQty=(i,q)=>{
  if(cart[i]){
    cart[i].qty=+q||1;
    saveCart();
    renderCartUI();
  }
};

function animateCartCount(){
  if(!cartCount)return;
  cartCount.classList.add("pop");
  setTimeout(()=>cartCount.classList.remove("pop"),300);
}

document.body.addEventListener("click",e=>{
  const add=e.target.closest(".addToCart");

  if(add){
    e.preventDefault();
    const card=add.closest(".af");

    addToCart({
      name:(add.dataset.name||card?.querySelector("h2")?.innerText||"Item").trim(),
      price:+add.dataset.price||0,
      img:add.dataset.img||card?.querySelector("img")?.src||"",
      qty:1
    });

    return;
  }

  const rem=e.target.closest(".remove-from-cart");
  if(rem)return removeFromCart(+rem.dataset.index);

});

cartItems?.addEventListener("input",e=>{
  const i=e.target.closest(".cart-qty-input");
  if(i)changeQty(+i.dataset.index,i.value);
});

window.toggleCart=()=>cartPanel?.classList.toggle("open");
window.goToCheckout=()=>location.href="checkout.html";

function generateReceipt(){
  if(!cart.length){
    alert("Cart is empty.");
    return;
  }

  let total=0;
const lines=cart.map((it,i)=>{
  const t=+it.price*+it.qty;
  total+=t;
  return`${i+1}. ${it.name} — $${(+it.price).toFixed(2)} x ${it.qty} = $${t.toFixed(2)}`;
}).join("<br>");

const w=window.open("","_blank");
if(!w)return alert("Popup blocked. Please allow popups to view the receipt.");

w.document.write(`<html><head><title>Receipt</title><style>
body{font-family:Arial,sans-serif;padding:20px;color:#111}
h2{margin-bottom:6px}.total{font-weight:700;margin-top:12px}
</style></head><body>
<h2>Football Top Shop — Receipt</h2>
<div>Date: ${new Date().toLocaleString()}</div><hr>
<div>${lines}</div>
<div class="total">Total: $${total.toFixed(2)}</div><hr>
<div>Thank you for your purchase!</div>
</body></html>`);

w.document.close();

if(confirm("Order complete? This will clear the cart.")){
  cart=[];
  saveCart();
  renderCartUI();
  animateCartCount();
}
}

renderCartUI();
window._cart={get:()=>cart,add:addToCart,remove:removeFromCart};

});

let _searchTimeout;

window.searchProducts=()=>{
  clearTimeout(_searchTimeout);
  _searchTimeout=setTimeout(()=>{
    const input=document.getElementById("searchInput");
    if(!input)return;

    const q=input.value.trim().toLowerCase();
    let any=false;

    document.querySelectorAll(".af").forEach(p=>{
      let title=p.querySelector("h2")?.innerText.trim().toLowerCase()||
                p.querySelector("img")?.alt?.trim().toLowerCase()||"";

      const show=!q||title.includes(q);
      p.style.display=show?"":"none";
      if(show)any=true;
    });

    let msg=document.getElementById("noResultsMessage");

    if(!msg){
      msg=document.createElement("div");
      msg.id="noResultsMessage";
      msg.style.cssText="text-align:center;color:#666;margin-top:18px";
      msg.innerText="No products match your search.";
      const c=document.querySelector(".containor")||document.body;
      c.parentNode.insertBefore(msg,c.nextSibling);
    }

    msg.style.display=any?"none":"block";
  },180);
};
window.addEventListener("load",()=>{
document.getElementById("loader").style.display="none";
});