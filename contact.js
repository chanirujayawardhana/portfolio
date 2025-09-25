<script>
(function () {
  const form = document.getElementById("contact_form");
  if (!form) return;

  // show/hide helpers using your existing elements
  const ok = document.getElementById("success_message");
  const err = document.getElementById("error_message");
  function show(el){ el && el.classList.add("show"); el && el.classList.remove("hide"); }
  function hide(el){ el && el.classList.add("hide"); el && el.classList.remove("show"); }
  hide(ok); hide(err);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // basic client validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const hp = form.company?.value.trim(); // honeypot

    if (hp) { // bot
      hide(err); show(ok); form.reset(); return;
    }
    if (!name || !email || !message) {
      hide(ok); show(err); err.textContent = "Please fill in name, email, and message.";
      return;
    }

    // build payload incl. reCAPTCHA token (v2 checkbox posts automatically)
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
      hide(err); show(ok);
      form.reset();
      // reset reCAPTCHA checkbox (if present)
      if (window.grecaptcha) grecaptcha.reset();
    } catch (e2) {
      hide(ok); show(err);
      err.textContent = "Sorry, there was an error sending your message.";
      console.error(e2);
    }
  });
})();
</script>
