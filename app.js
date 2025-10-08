const menuItems = [
  { id: 1, name: "Cheeseburger", price: 5.99, img: "cheeseburger.png" },
  { id: 2, name: "Veggie Pizza", price: 8.49, img: "pizza.png" },
  { id: 3, name: "Caesar Salad", price: 4.75, img: "salad.png" },
  { id: 4, name: "Fries", price: 2.99, img: "fries.png" },
  { id: 5, name: "Milkshake", price: 3.50, img: "milkshake.png" }
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = '';
  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="menu-item-img">
      <div class="menu-item-info">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
      </div>
      <button class="menu-item-add" data-id="${item.id}" aria-label="Add ${item.name}">Add</button>
    `;
    menuList.appendChild(li);
  });
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" data-idx="${idx}" data-action="dec" aria-label="Decrease quantity">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-idx="${idx}" data-action="inc" aria-label="Increase quantity">+</button>
        <button class="qty-btn remove" data-idx="${idx}" data-action="remove" aria-label="Remove item">×</button>
      </div>
    `;
    cartList.appendChild(li);
  });
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
  updateCartCount();
  saveCart();
}

function openCartModal() {
  document.getElementById("cart-modal").classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
  renderCart();
  document.getElementById("order-msg").textContent = '';
  document.getElementById("cart-modal").focus();
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
}

function clearCart() {
  cart = [];
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();

  document.getElementById("menu-list").addEventListener("click", e => {
    if (e.target.classList.contains("menu-item-add")) {
      const id = +e.target.dataset.id;
      const item = menuItems.find(m => m.id === id);
      const cartItem = cart.find(ci => ci.id === id);
      if (cartItem) cartItem.qty += 1;
      else cart.push({ ...item, qty: 1 });
      renderCart();
      updateCartCount();
    }
  });

  document.getElementById("cart-list").addEventListener("click", e => {
    if (e.target.classList.contains("qty-btn")) {
      const idx = +e.target.dataset.idx;
      const action = e.target.dataset.action;
      if (action === "inc") {
        cart[idx].qty += 1;
      } else if (action === "dec") {
        if (cart[idx].qty > 1) cart[idx].qty -= 1;
      } else if (action === "remove") {
        cart.splice(idx, 1);
      }
      renderCart();
      updateCartCount();
    }
  });

  document.getElementById("cart-fab").addEventListener("click", openCartModal);
  document.getElementById("close-cart").addEventListener("click", closeCartModal);
  document.getElementById("overlay").addEventListener("click", closeCartModal);

  document.getElementById("place-order").addEventListener("click", () => {
    if (cart.length === 0) {
      document.getElementById("order-msg").textContent = 'Your cart is empty!';
      return;
    }
    document.getElementById("order-msg").textContent = 'Order placed! Thank you!';
    clearCart();
    updateCartCount();
    saveCart();
    setTimeout(closeCartModal, 1200);
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    clearCart();
    updateCartCount();
    saveCart();
  });

  // Trap focus in modal for accessibility
  document.getElementById("cart-modal").addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartModal();
  });

  // Register Service Worker for PWA/offline
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
