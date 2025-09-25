document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById("see-more-btn");
  const moreItems = document.querySelector(".more-items");

  if (btn && moreItems) {
    btn.addEventListener("click", function() {
      moreItems.classList.toggle("d-none"); // show/hide hidden items
      btn.textContent = moreItems.classList.contains("d-none") 
        ? "See More" 
        : "See Less";
    });
  }
});
