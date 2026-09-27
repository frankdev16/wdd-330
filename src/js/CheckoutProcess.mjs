import { getLocalStorage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

 init() {
    const items = getLocalStorage(this.key) || [];
    this.list = items.map((item) => ({
      quantity: 1,
      ...item,
    }));
    this.calculateItemSubTotal();
  }


calculateItemSubTotal() {
  this.itemTotal = this.list.reduce(
    (sum, item) => sum + item.FinalPrice * item.quantity,
    0
  );
  const subtotalEl = document.querySelector(`${this.outputSelector} #summarySubtotal`);
  subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
}

calculateOrderTotal() {
  const numItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
  this.tax = this.itemTotal * 0.06;
  this.shipping = numItems > 0 ? 10 + (numItems - 1) * 2 : 0;
  this.orderTotal = this.itemTotal + this.tax + this.shipping;
  this.displayOrderTotals();
}

displayOrderTotals() {
  const tax = document.querySelector(`${this.outputSelector} #summaryTax`);
  const shipping = document.querySelector(`${this.outputSelector} #summaryShipping`);
  const orderTotal = document.querySelector(`${this.outputSelector} #summaryTotal`);

  tax.innerText = `$${this.tax.toFixed(2)}`;
  shipping.innerText = `$${this.shipping.toFixed(2)}`;
  orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
}

packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity,
  }));
}

async checkout(form) {
  const formData = new FormData(form);
  const orderData = formDataToJSON(formData);

    for (const key in orderData) {
    if (typeof orderData[key] === "string") {
      orderData[key] = orderData[key].trim();
    }
  }

  orderData.orderDate = new Date().toISOString();
  orderData.orderTotal = this.orderTotal.toFixed(2); // string
  orderData.tax = this.tax.toFixed(2);               // string
  orderData.shipping = this.shipping;                // number
  orderData.items = this.packageItems(this.list);


  try {
    const services = new ExternalServices();
    const response = await services.checkout(orderData);
    return response;
  } catch (err) {
    console.error("Checkout error:", err);
    throw err; // let checkout.js decide how to show this to the user
  }
  

}

}