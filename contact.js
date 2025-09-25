// contact.js
(function () {
  const form = document.getElementById("contact_form");
  if (!form) return;

  const ok  = document.getElementById("success_message");
  const err = document.getElementById("error_message");

  function show(el, msg) {
    if (!el) return;
    if (msg) el.textContent = msg;
    el.style.display = "block";
  }
  function hide(el) { if (el) el.style.display = "none"; }

  hide(ok); hide(err);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hide(ok); hide(err);

    // honeypot
    const hp = form.company?.value?.trim();
    if (hp) { show(ok, "Thanks!"); form.reset(); return; }

    // simple check
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      show(err, "Please fill in name, email and message.");
      return;
    }

    const data = {
      name,
      email,
      subject: "Contact form",
      message
    };

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to send");

      show(ok, "Your message has been sent. I’ll get back to you soon!");
      form.reset();
      if (window.grecaptcha) grecaptcha.reset();
    } catch (e2) {
      console.error(e2);
      show(err, "Sorry, there was an error sending your message.");
    }
  });
})();
