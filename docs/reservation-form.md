# Reservation form

The last “Reservar ahora” CTA opens `/mia-leticia/reservar/`. This is a separate Vite HTML entry, so its directory URL also works when opened directly on GitHub Pages. `/reservar/gracias/` is the return page after a successful submission. Both pages support `?lang=en`.

The form posts to FormSubmit for delivery to **info@mialeticia.com**. No mail credentials or API keys belong in the frontend. FormSubmit's default reCAPTCHA remains enabled and a honeypot is included. The guest email field supplies the email Reply-To. Dates, contact information, room selection and positive integer guest/room counts use native browser validation; departure must be after arrival.

## Required recipient activation

On first submission FormSubmit sends an activation email to info@mialeticia.com. The mailbox owner must click its confirmation link before submissions can be delivered. Check the spam folder if necessary. A published form alone does not prove email delivery. After activation, submit a clearly labelled test from the live page and confirm receipt in the destination inbox before considering delivery verified.

Provider documentation: https://formsubmit.co/

To change the recipient, update `EMAIL` in `app/reservation.tsx` and activate the replacement address. Do not disable the provider's spam protection.
