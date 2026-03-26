// NAVIGATION
function showSection(section) {
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.remove("active");
    });
    document.getElementById(section).classList.add("active");

    if (section === 'cart') showCart();
}

// GO TO SHOP
function goToShop() {
    showSection('shop');
}

// CART DATA
let cart = [];

// ADD TO CART
function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartCount();
    alert(name + " added to cart!");
}

// INCREASE QUANTITY
function increaseQty(index) {
    cart[index].quantity++;
    showCart();
}

// DECREASE QUANTITY
function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    showCart();
}

// SHOW CART
function showCart() {
    let cartItems = document.getElementById("cart-items");
    let total = 0;

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong><br>
                ₱${item.price} × ${item.quantity} = ₱${subtotal}<br>
                <button onclick="decreaseQty(${index})">➖</button>
                <button onclick="increaseQty(${index})">➕</button>
            </div>
        `;
    });

    document.getElementById("total").innerText = "Grand Total: ₱" + total;
    updateCartCount();
}

// UPDATE CART COUNT
function updateCartCount() {
    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });

    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.innerText = count;
}

// CLEAR CART
function clearCart() {
    cart = [];
    showCart();
}

// ✅ FIXED PICKUP VALIDATION
function validatePickup() {
    const pickupDate = document.getElementById('pickup-date');
    const pickupTime = document.getElementById('pickup-time');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!pickupDate || !pickupTime || !checkoutBtn) return false;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    pickupDate.min = minDate;

    if (!pickupDate.value) pickupDate.value = minDate;

    const isValid = pickupDate.value && pickupTime.value;

    checkoutBtn.disabled = !isValid;
    checkoutBtn.style.opacity = isValid ? '1' : '0.6';

    return isValid; // ✅ IMPORTANT
}

// ✅ FIXED CHECKOUT (ONLY ONE VERSION)
function proceedToCheckout() {
    if (!validatePickup()) {
        alert('Please select both pickup date and time!');
        return;
    }
    
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    
    const date = new Date(pickupDate + 'T00:00:00');
    const formattedDate = date.toLocaleDateString('en-PH', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let orderSummary = '🎉 ORDER CONFIRMED!\n\n';
    orderSummary += '📅 Pickup: ' + formattedDate + ' at ' + pickupTime + '\n';
    orderSummary += '📦 Total Items: ' + cart.reduce((sum, item) => sum + item.quantity, 0) + '\n\n';
    
    let grandTotal = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        grandTotal += subtotal;
        orderSummary += '• ' + item.name + ' (x' + item.quantity + ') = ₱' + subtotal + '\n';
    });
    
    orderSummary += '\n💰 GRAND TOTAL: ₱' + grandTotal.toLocaleString() + '\n\n';
    orderSummary += '✅ Thank you for your order!\n📞 Call us: 0999-123-4567';
    
    alert(orderSummary);

    // RESET
    cart = [];
    showCart();
    updateCartCount();

    document.getElementById('pickup-date').value = '';
    document.getElementById('pickup-time').value = '';
    validatePickup();
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    updateCartCount();
    validatePickup();

    // ✅ Auto-enable checkout when selecting date/time
    document.getElementById('pickup-date').addEventListener('change', validatePickup);
    document.getElementById('pickup-time').addEventListener('change', validatePickup);
});