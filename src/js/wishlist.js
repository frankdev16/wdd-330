import { getLocalStorage, loadHeaderFooter } from './utils.mjs';

function renderWishlist() {
  const wishlistItems = getLocalStorage('so-wishlist') || [];
  const wishlistList = document.querySelector('.wishlist-list');

  if (wishlistItems.length === 0) {
    wishlistList.innerHTML = '<p>Your wishlist is empty.</p>';
    return;
  }

  wishlistList.innerHTML = wishlistItems
    .map(
      (item) => `
        <li class="cart-card divider">
          <img
            src="${item.Images.PrimaryMedium}"
            alt="${item.Name}"
          />

          <h2>${item.Name}</h2>

          <p>${item.Colors[0].ColorName}</p>

          <p>$${item.FinalPrice}</p>

          <button
            type="button"
            class="remove-wishlist"
            data-id="${item.Id}"
          >
            Remove
          </button>

          <button
            type="button"
            class="move-to-cart"
            data-id="${item.Id}"
          >
            Add to Cart
          </button>
        </li>
      `
    )
    .join('');

  addWishlistListeners();
}

function addWishlistListeners() {
  document.querySelectorAll('.remove-wishlist').forEach((button) => {
    button.addEventListener('click', removeFromWishlist);
  });

  document.querySelectorAll('.move-to-cart').forEach((button) => {
    button.addEventListener('click', moveToCart);
  });
}

function removeFromWishlist(event) {
  const productId = event.target.dataset.id;
  const wishlistItems = getLocalStorage('so-wishlist') || [];

  const updatedWishlist = wishlistItems.filter(
    (item) => item.Id !== productId
  );

  localStorage.setItem('so-wishlist', JSON.stringify(updatedWishlist));

  renderWishlist();
}

function moveToCart(event) {
  const productId = event.target.dataset.id;
  const wishlistItems = getLocalStorage('so-wishlist') || [];
  const cartItems = getLocalStorage('so-cart') || [];

  const product = wishlistItems.find(
    (item) => item.Id === productId
  );

  if (product) {
    cartItems.push(product);
    localStorage.setItem('so-cart', JSON.stringify(cartItems));
  }
}

renderWishlist();
loadHeaderFooter();