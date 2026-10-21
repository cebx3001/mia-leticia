import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const BASE = import.meta.env.BASE_URL;
const EMAIL = 'info@mialeticia.com';
const PHONE = '+593 98 202 3389';

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function followingDay(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return localDate(new Date(year, month - 1, day + 1));
}

export default function Reservation() {
  const en = new URLSearchParams(window.location.search).get('lang') === 'en';
  const sent = window.location.pathname.replace(/index\.html$/, '').endsWith('/gracias/');
  const t = (es: string, english: string) => en ? english : es;
  const today = localDate(new Date());
  const [arrival, setArrival] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const languageQuery = en ? '?lang=en' : '';
  const next = new URL(`${BASE}reservar/gracias/${languageQuery}`, window.location.origin).href;

  useEffect(() => {
    document.documentElement.lang = en ? 'en' : 'es';
    document.title = `${sent ? (en ? 'Request sent' : 'Solicitud enviada') : (en ? 'Request a reservation' : 'Solicitar reserva')} — Mía Leticia`;
    const reset = () => setSubmitting(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, [en, sent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const departure = form.querySelector<HTMLInputElement>('#departure');
    if (String(data.get('Salida')) <= String(data.get('Llegada'))) {
      departure?.setCustomValidity(t('La salida debe ser posterior a la llegada.', 'Departure must be after arrival.'));
      form.reportValidity();
      return;
    }
    setError('');
    setSubmitting(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission unavailable');
      const result = await response.json();
      if (/activat|confirm.*email|verify.*email/i.test(String(result.message || ''))) {
        setError(t('El envío por correo está pendiente de activación. Por favor, contáctanos directamente para solicitar tu estancia.', 'Email delivery is awaiting activation. Please contact us directly to request your stay.'));
      } else if (result.success === true || result.success === 'true') {
        window.location.assign(next);
      } else {
        throw new Error('Submission not accepted');
      }
    } catch {
      setError(t('No pudimos confirmar el envío. Tus datos siguen aquí: puedes volver a intentarlo o contactarnos directamente.', 'We could not confirm your request was sent. Your details are still here: please try again or contact us directly.'));
    } finally {
      window.clearTimeout(timeout);
      setSubmitting(false);
    }
  }

  return <div className="reservation-page">
    <a className="reservation-skip" href="#reservation-main">{t('Saltar al contenido', 'Skip to content')}</a>
    <header className="reservation-header">
      <a className="reservation-brand" href={BASE}>MÍA LETICIA<span>QUITO · ECUADOR</span></a>
      <nav aria-label={t('Navegación', 'Navigation')}>
        <a href={`?lang=${en ? 'es' : 'en'}`} lang={en ? 'es' : 'en'} aria-label={en ? 'Ver en español' : 'View in English'}>{en ? 'ES' : 'EN'}</a>
        <a href={BASE}>{t('Volver a la casa', 'Back to the house')} ↗</a>
      </nav>
    </header>

    <main id="reservation-main" className={`reservation-layout${sent ? ' reservation-sent' : ''}`}>
      <section className="reservation-intro" aria-labelledby="reservation-title">
        <p className="reservation-eyebrow">{t('TU ESTANCIA EN MÍA LETICIA', 'YOUR STAY AT MÍA LETICIA')}</p>
        <h1 id="reservation-title">{sent ? t('Gracias por escribirnos.', 'Thank you for getting in touch.') : <>{t('Tu viaje', 'Your journey')}<br/><em>{t('empieza aquí.', 'begins here.')}</em></>}</h1>
        <p className="reservation-lead">{sent
          ? t('Tu solicitud ha sido enviada. Nuestro equipo te responderá al correo que indicaste para confirmar disponibilidad y los detalles de tu estancia.', 'Your request has been sent. Our team will reply to the email you provided to confirm availability and the details of your stay.')
          : t('Cuéntanos cuándo vienes y qué habitación necesitas. Te responderemos por correo para ayudarte a preparar tu estancia en Quito.', 'Tell us when you are coming and which room you need. We will reply by email to help you plan your stay in Quito.')}</p>
        <p className="reservation-confirmation">{t('La solicitud no confirma la reserva. La disponibilidad y la tarifa se confirman directamente con nuestro equipo.', 'Submitting a request does not confirm a booking. Our team will confirm availability and rates directly with you.')}</p>
        {sent && <a className="reservation-return" href={BASE}>{t('VOLVER A MÍA LETICIA', 'BACK TO MÍA LETICIA')} ↗</a>}
        <div className="reservation-contact">
          <p className="reservation-eyebrow">{t('HABLEMOS', 'GET IN TOUCH')}</p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href="tel:+593982023389">{PHONE}</a>
          <p>Montúfar N5-91 y Mejía<br/>{t('Centro Histórico · Quito, Ecuador', 'Historic Centre · Quito, Ecuador')}</p>
        </div>
      </section>

      {!sent && <section className="reservation-card" aria-labelledby="reservation-form-title">
        <div className="reservation-form-heading">
          <h2 id="reservation-form-title">{t('Solicitar reserva', 'Request a reservation')}</h2>
          <p id="reservation-required">{t('Los campos con * son obligatorios.', 'Fields marked * are required.')}</p>
        </div>
        <form action={`https://formsubmit.co/${EMAIL}`} method="POST" acceptCharset="UTF-8" aria-describedby="reservation-required reservation-use" aria-busy={submitting} onSubmit={submit}>
          <input type="hidden" name="_subject" value="Solicitud de reserva — Mía Leticia"/>
          <input type="hidden" name="_template" value="table"/>
          <input type="hidden" name="_next" value={next}/>
          <input type="hidden" name="_url" value={new URL(`${BASE}reservar/`, window.location.origin).href}/>
          <input type="hidden" name="Idioma" value={en ? 'English' : 'Español'}/>
          <div className="reservation-honeypot" aria-hidden="true">
            <label htmlFor="website">{t('Deja este campo vacío', 'Leave this field empty')}</label>
            <input id="website" name="_honey" type="text" tabIndex={-1} autoComplete="off"/>
          </div>
          <fieldset>
            <legend>{t('01 / Tus datos', '01 / Your details')}</legend>
            <div className="reservation-fields">
              <label className="reservation-wide" htmlFor="guest-name">{t('Nombre y apellido', 'Full name')} *<input id="guest-name" name="Nombre" autoComplete="name" required maxLength={120}/></label>
              <label htmlFor="guest-email">{t('Correo electrónico', 'Email address')} *<input id="guest-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label>
              <label htmlFor="guest-phone">{t('Teléfono con código de país', 'Phone with country code')} *<input id="guest-phone" name="Teléfono" type="tel" autoComplete="tel" required maxLength={40} placeholder="+593 …"/></label>
              <label className="reservation-wide" htmlFor="guest-country">{t('País de origen', 'Country of origin')} *<input id="guest-country" name="País de origen" autoComplete="country-name" required maxLength={100}/></label>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('02 / Tu estancia', '02 / Your stay')}</legend>
            <div className="reservation-fields">
              <label htmlFor="arrival">{t('Fecha de llegada', 'Arrival date')} *<input id="arrival" name="Llegada" type="date" min={today} required value={arrival} onChange={event => setArrival(event.target.value)} onInput={event => setArrival(event.currentTarget.value)}/></label>
              <label htmlFor="departure">{t('Fecha de salida', 'Departure date')} *<input id="departure" name="Salida" type="date" min={followingDay(arrival && arrival >= today ? arrival : today)} required onInput={event => event.currentTarget.setCustomValidity('')}/></label>
              <label className="reservation-wide" htmlFor="room">{t('Tipo de habitación', 'Room type')} *<select id="room" name="Habitación" required defaultValue="">
                <option value="" disabled>{t('Selecciona una habitación', 'Choose a room')}</option>
                <option value="Simple">{t('Simple', 'Single')}</option>
                <option value="Doble">{t('Doble', 'Double')}</option>
                <option value="Triple">Triple</option>
                <option value="Familiar">{t('Familiar', 'Family')}</option>
              </select></label>
              <label htmlFor="guests">{t('Número de huéspedes', 'Number of guests')} *<input id="guests" name="Huéspedes" type="number" inputMode="numeric" min="1" step="1" required/></label>
              <label htmlFor="rooms">{t('Número de habitaciones', 'Number of rooms')} *<input id="rooms" name="Habitaciones" type="number" inputMode="numeric" min="1" step="1" required defaultValue="1"/></label>
              <label className="reservation-wide" htmlFor="message">{t('Mensaje o peticiones especiales', 'Message or special requests')}<textarea id="message" name="Mensaje" rows={5} maxLength={5000} placeholder={t('Si necesitas varias habitaciones de distinto tipo, un traslado o tienes alguna consulta, cuéntanos aquí.', 'If you need different room types, a transfer or have any questions, let us know here.')}/></label>
            </div>
          </fieldset>
          <p id="reservation-use" className="reservation-use">{t('Usaremos estos datos para atender tu solicitud y contactarte sobre tu estancia.', 'We will use these details to respond to your request and contact you about your stay.')}</p>
          {error && <div className="reservation-error" role="alert"><p>{error}</p><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href="tel:+593982023389">{PHONE}</a></div>}
          <button className="reservation-submit" type="submit" disabled={submitting}>{submitting ? t('ENVIANDO…', 'SENDING…') : t('ENVIAR SOLICITUD', 'SEND REQUEST')} <span aria-hidden="true">↗</span></button>
        </form>
      </section>}
    </main>
    <footer className="reservation-footer"><span>MÍA LETICIA</span><span>{t('Una casa en el corazón de Quito.', 'A house in the heart of Quito.')}</span></footer>
  </div>;
}
