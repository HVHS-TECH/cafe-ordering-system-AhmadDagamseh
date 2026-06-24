console.log("Hello world!")
// ------------------------------
// CART SYSTEM + LOCAL STORAGE
// ------------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const addToCartButtons = document.querySelectorAll(".addToCart");
const cartPanel = document.getElementById("cartPanel");

updateCart();

// Add to cart
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

// Update cart UI
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

// Cart animation
function animateCart() {
    cartCount.classList.add("pop");
    setTimeout(() => cartCount.classList.remove("pop"), 300);
}

// Toggle cart panel
function toggleCart() {
    cartPanel.classList.toggle("open");
}

// Go to checkout page
function goToCheckout() {
    window.location.href = "checkout.html";
}

// ------------------------------
// SEARCH BAR
// ------------------------------
function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".af");

    products.forEach(product => {
        const name = product.querySelector("h2").innerText.toLowerCase();
        product.style.display = name.includes(input) ? "block" : "none";
    });
}
