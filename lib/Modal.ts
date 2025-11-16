// lib/modal.ts
export const openPaymentModal = (pkg: any) => {
  window.dispatchEvent(new CustomEvent("open-payment", { detail: pkg }));
};

export const closePaymentModal = () => {
  (document.getElementById("payment-modal") as any)?.close();
};
