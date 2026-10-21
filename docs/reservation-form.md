# Reservation form

The last “Reservar ahora” CTA opens `reservar/` relative to the homepage. This is a separate Vite HTML entry, so its directory URL also works when opened directly on GitHub Pages. `reservar/gracias/` is the return page after a successful submission. Both pages support `?lang=en`.

Vite emits relative asset URLs. Navigation and the submission return URL derive the site root from the reservation page's location, supporting both `cebx3001.github.io/mia-leticia/` and the custom-domain root without different builds. Form activation is tied to the published origin; verify activation again after changing domains.

The form uses FormSubmit's documented AJAX endpoint for delivery to **info@mialeticia.com**. No mail credentials or API keys belong in the frontend. A honeypot and the provider's built-in spam filtering apply. The guest email field supplies the email Reply-To. Dates, contact information, room selection and positive integer guest/room counts use native browser validation; departure must be after arrival. A second check validates the date order before submission.

The page only redirects to the thank-you page after an explicit successful JSON response. HTTP errors, invalid responses, activation notices and a 20-second timeout keep the form data on screen and offer retry/direct contact. No automatic retries are made. The `_url` metadata supplies a stable form URL for activation in either language.

## Required recipient activation

On first submission FormSubmit sends an activation email to info@mialeticia.com. The mailbox owner must click its confirmation link before submissions can be delivered. Check the spam folder if necessary. A published form alone does not prove email delivery. After activation, submit a clearly labelled test from the live page and confirm receipt in the destination inbox before considering delivery verified.

Provider documentation: https://formsubmit.co/ and https://formsubmit.co/ajax-documentation

To change the recipient, update `EMAIL` in `app/reservation.tsx` and activate the replacement address.
