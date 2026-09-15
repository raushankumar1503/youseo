"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

const CONTACT_EMAIL = SITE.email;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const fieldClasses =
    "w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400";

  // Until a real public contact email is configured in src/lib/site.ts
  // (SITE.email), submitting a mailto form would do nothing useful, so we
  // show a notice instead of a dead form.
  if (!CONTACT_EMAIL.trim()) {
    return (
      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        The public contact form is being set up. In the meantime, this site is
        reached best through the topics and guides on this page — and the owner
        will list a contact email here soon.
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name || "a site visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClasses}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClasses}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClasses} resize-y`}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Send message
      </button>
    </form>
  );
}