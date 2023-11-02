const updateOrderFormElements = document.querySelectorAll(".order-actions form");
const selectElement = document.querySelector('select[name="status"]');
const orderStatusBadgeElement = document.querySelector('.order-summary .badge');

let selectedStatusTitle = '';

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(form);
  const newStatus = formData.get("status");
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;

  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        newStatus: newStatus,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong - could not update order status.");
    return;
  }

  orderStatusBadgeElement.textContent = selectedStatusTitle.toUpperCase();
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder);
}

selectElement.addEventListener('change', function () {
  const selectedOption = this.options[this.selectedIndex];
  selectedStatusTitle = selectedOption.getAttribute('data-statustitle');
});
