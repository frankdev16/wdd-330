import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";


const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
checkoutProcess.init();

document.querySelector("#checkout-button").addEventListener("click", async (e) => {
  e.preventDefault();

  checkoutProcess.calculateOrderTotal();

  try {
    const form = document.querySelector("#checkoutForm");
    const response = await checkoutProcess.checkout(form);
    console.log("Order submitted:", response);
  } catch (err) {
    console.error("Checkout failed:", err);
  }
});

loadHeaderFooter();