console.log("Hello world!")

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const addToCartButtons = document.querySelectorAll(".addToCart");
const cartPanel = document.getElementById("cartPanel");

updateCart();


addToCartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);

        cart.push({ name, price });

        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();
        animateCart();
    });
});


function updateCart() {
    cartCount.innerText = cart.length;
    cartItems.innerHTML = "";

    cart.forEach(item => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${item.name}</p>
                <p>$${item.price}</p>
            </div>
        `;
    });
}


function animateCart() {
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 300);
}


function toggleCart() {
    cartPanel.classList.toggle("open");
}


function goToCheckout() {
    window.location.href = "checkout.html";
}


function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".af");

    products.forEach(product => {
        const name = product.querySelector("h2").innerText.toLowerCase();
        product.style.display = name.includes(input) ? "block" : "none";
    });
}
