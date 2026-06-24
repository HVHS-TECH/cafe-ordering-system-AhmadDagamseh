let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkoutItems");
const totalPrice = document.getElementById("totalPrice");

let total = 0;

cart.forEach(item => {
    checkoutItems.innerHTML += `
        <div class="cart-item">
            <p>${item.name}</p>
            <p>$${item.price}</p>
        </div>
    `;
    total += item.price;
});

totalPrice.innerText = "Total: $" + total;

function completeOrder() {
    alert("Order Completed!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}
