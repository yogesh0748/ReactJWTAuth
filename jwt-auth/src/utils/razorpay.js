import { loadScript } from './loadScript';

export const initializeRazorpay = async (orderData, onSuccess) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: "INR",
    name: "Bus Booking",
    description: "Bus Ticket Payment",
    order_id: orderData.id,
    handler: async (response) => {
      try {
        await onSuccess(response);
      } catch (error) {
        console.error("Payment verification failed:", error);
        alert("Payment verification failed");
      }
    },
    prefill: {
      name: orderData.userName,
      email: orderData.userEmail,
    },
    theme: {
      color: "#0891b2",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};