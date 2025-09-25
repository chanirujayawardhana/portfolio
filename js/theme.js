(function () {
  const KEY = "site-theme"; // 'light' | 'dark'
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  // read saved choice or leave empty to follow system
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else {
    root.removeAttribute("data-theme"); // system preference applies via CSS @media
  }

  function currentTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr; // explicit
    // infer from system if not set
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
  }

  btn?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    setTheme(next);
  });

  // update automatically if following system and system changes
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    if (!localStorage.getItem(KEY)) {
      // only if user hasn't chosen manually
      root.removeAttribute("data-theme");
    }
  });
})();
