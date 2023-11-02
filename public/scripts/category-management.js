const deleteCategoryButtonElements = document.querySelectorAll(".category-item button");

async function deleteCategory(event) {
  const buttonElement = event.target;
  const categoryId = buttonElement.dataset.categoryid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/categories/" + categoryId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const categoryListItemElement = buttonElement.closest("li");
  categoryListItemElement.remove();
}

for (const deleteCategoryButtonElement of deleteCategoryButtonElements) {
  deleteCategoryButtonElement.addEventListener("click", deleteCategory);
}
