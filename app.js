const menuItems = [
  { id: 1, name: "Cheeseburger", price: 5.99 },
  { id: 2, name: "Veggie Pizza", price: 8.49 },
  { id: 3, name: "Caesar Salad", price: 4.75 },
  { id: 4, name: "Fries", price: 2.99 },
  { id: 5, name: "Milkshake", price: 3.50 }
];

let cart = [];

function renderMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = '';
  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="menu-item-info">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
      </div>
      <button class="menu-item-add" data-id="${item.id}">Add</button>
    `;
    menuList.appendChild(li);
  });
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="menu-item-info">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
      </div>
      <button class="menu-item-add remove" data-index="${idx}">Remove</button>
    `;
    cartList.appendChild(li);
  });
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();

  document.getElementById("menu-list").addEventListener("click", e => {
    if (e.target.classList.contains("menu-item-add")) {
      const id = +e.target.dataset.id;
      const item = menuItems.find(m => m.id === id);
      cart.push(item);
      renderCart();
      document.getElementById("order-msg").textContent = '';
    }
  });

  document.getElementById("cart-list").addEventListener("click", e => {
    if (e.target.classList.contains("remove")) {
      const idx = +e.target.dataset.index;
      cart.splice(idx, 1);
      renderCart();
    }
  });

  document.getElementById("place-order").addEventListener("click", () => {
    if (cart.length === 0) {
      document.getElementById("order-msg").textContent = 'Your cart is empty!';
      return;
    }
    document.getElementById("order-msg").textContent = 'Order placed! Thank you!';
    cart = [];
    renderCart();
  });

  // Register Service Worker for PWA/offline
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
