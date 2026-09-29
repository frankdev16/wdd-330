import { loadHeaderFooter, setLocalStorage, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";


const checkoutProcess = new CheckoutProcess("so-cart", ".order-summary");
checkoutProcess.init();

function formatErrorMessage(err) {
  if (err?.message && typeof err.message === "object") {
    return Object.values(err.message).join(" ");
  }
  return err?.message || "Something went wrong with your order. Please try again.";
}

document.querySelector("#checkout-button").addEventListener("click", async (e) => {
  e.preventDefault();

  const form = document.querySelector("#checkoutForm");

  const isValid = form.checkValidity();
  if (!isValid) {
    form.reportValidity();
    return;
  }

  checkoutProcess.calculateOrderTotal();

  try {
    await checkoutProcess.checkout(form);
    setLocalStorage("so-cart", []);
    window.location.href = "/checkout/success.html";
  } catch (err) {
    console.error("Checkout failed:", err);
    alertMessage(formatErrorMessage(err));
  }
});

loadHeaderFooter();
