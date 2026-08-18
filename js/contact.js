/**
 * Drives contact.html — the form has no backend, so submitting it opens a
 * pre-filled WhatsApp chat with the message instead of silently "succeeding".
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = qs("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || !message) { toast("Please fill in your name and message", "error"); return; }
    const text = [
      "Hello, I'm reaching out from the contact form on your website.",
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
      email ? `Email: ${email}` : null,
      subject ? `Subject: ${subject}` : null,
      "Message:",
      message,
    ].filter(Boolean).join("\n");
    openWhatsApp(text);
    toast("Opening WhatsApp with your message...");
    form.reset();
  });
});
