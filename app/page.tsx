'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

const roomImages = [
  {
    nameEs: 'Simple',
    nameEn: 'Single',
    src: 'https://images.trvl-media.com/lodging/4000000/3840000/3836700/3836630/6548b2e8.jpg?h=1100&impolicy=fcrop&w=1800',
    alt: 'Habitación simple de Mia Leticia',
  },
  {
    nameEs: 'Doble',
    nameEn: 'Double',
    src: 'https://images.trvl-media.com/lodging/4000000/3840000/3836700/3836630/93710469.jpg?h=1100&impolicy=fcrop&w=1800',
    alt: 'Habitación doble de Mia Leticia',
  },
  {
    nameEs: 'Triple',
    nameEn: 'Triple',
    src: 'https://images.trvl-media.com/lodging/4000000/3840000/3836700/3836630/b46d55e9.jpg?h=1100&impolicy=fcrop&w=1800',
    alt: 'Habitación triple de Mia Leticia',
  },
  {
    nameEs: 'Familiar',
    nameEn: 'Family',
    src: 'https://images.trvl-media.com/lodging/4000000/3840000/3836700/3836630/b4288bf3.jpg?h=1100&impolicy=fcrop&w=1800',
    alt: 'Habitación familiar de Mia Leticia',
  },
];

const hotelPhotos = {
  arrival: 'https://www.instagram.com/p/DcZquDNsrAE/media/?size=l',
  commons: 'https://www.instagram.com/p/DdDF5l8sPx6/media/?size=l',
  family: 'https://www.instagram.com/p/DX2VKnwlEbE/media/?size=l',
  games: 'https://www.instagram.com/p/Dayj_moMMJI/media/?size=l',
  breakfast: 'https://www.instagram.com/p/DXZiMILkcAe/media/?size=l',
  returnCouple: 'https://www.instagram.com/p/DaeQ66ZMGyJ/media/?size=l',
} as const;

const ecuador = [
  ['Cotopaxi', 'images/cotopaxi.webp'],
  ['Quilotoa', 'images/quilotoa.webp'],
  ['Otavalo', 'images/otavalo.webp'],
  ['Papallacta', 'images/papallacta.webp'],
  ['Baños', 'images/banos.webp'],
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const fallbackPhoto = (event: SyntheticEvent<HTMLImageElement>, fallback: string) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.parentElement?.classList.add('ml-photo-fallback');
  image.src = fallback;
};

export default function Home() {
  const [english, setEnglish] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [activeRoom, setActiveRoom] = useState(0);
  const [activeDestination, setActiveDestination] = useState(0);
  const roomRef = useRef(0);
  const destinationRef = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);

  useEffect(() => {
    let raf = 0;

    const paint = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress', String(total ? scrollY / total : 0));

      document.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const travel = Math.max(scene.offsetHeight - innerHeight, 1);
        const progress = clamp(-rect.top / travel);
        scene.style.setProperty('--p', progress.toFixed(4));

        scene.querySelectorAll<HTMLElement>('[data-window]').forEach((item) => {
          const raw = item.dataset.window?.split(':').map(Number) ?? [0, 1];
          const start = raw[0] ?? 0;
          const end = raw[1] ?? 1;
          const fade = Math.min(0.09, Math.max((end - start) / 3, 0.025));
          const visibility = clamp(Math.min((progress - start) / fade, (end - progress) / fade));
          item.style.setProperty('--w', visibility.toFixed(4));
        });

        if (scene.dataset.scene === 'rooms') {
          const next = Math.min(roomImages.length - 1, Math.floor(progress * roomImages.length));
          if (next !== roomRef.current) {
            roomRef.current = next;
            setActiveRoom(next);
          }
        }

        if (scene.dataset.scene === 'ecuador') {
          const next = Math.min(ecuador.length - 1, Math.floor(progress * ecuador.length));
          if (next !== destinationRef.current) {
            destinationRef.current = next;
            setActiveDestination(next);
          }
        }
      });

      raf = 0;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const pointer = (event: PointerEvent) => {
      const x = event.clientX / innerWidth;
      const y = event.clientY / innerHeight;
      document.documentElement.style.setProperty('--mx', String(x - 0.5));
      document.documentElement.style.setProperty('--my', String(y - 0.5));
      document.documentElement.style.setProperty('--px', `${(x * 100).toFixed(2)}%`);
      document.documentElement.style.setProperty('--py', `${(y * 100).toFixed(2)}%`);
    };

    paint();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    addEventListener('pointermove', pointer, { passive: true });

    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      removeEventListener('pointermove', pointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toggleSound = () => {
    if (!soundOn) {
      const ctx = audio.current ?? new AudioContext();
      const gain = master.current ?? ctx.createGain();
      if (!master.current) {
        gain.gain.value = 0.015;
        gain.connect(ctx.destination);
        [55, 82.5, 110].forEach((frequency, index) => {
          const osc = ctx.createOscillator();
          const local = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = frequency;
          local.gain.value = [0.25, 0.08, 0.025][index];
          osc.connect(local).connect(gain);
          osc.start();
        });
      }
      gain.gain.setTargetAtTime(0.015, ctx.currentTime, 0.25);
      audio.current = ctx;
      master.current = gain;
      void ctx.resume();
      setSoundOn(true);
    } else {
      master.current?.gain.setTargetAtTime(0.0001, audio.current?.currentTime ?? 0, 0.2);
      setSoundOn(false);
    }
  };

  const room = roomImages[activeRoom];

  return (
    <main>
      <div className="progress" />
      <header className="masthead">
        <a href="#top">MIA LETICIA</a>
        <span>00°13′S · 78°30′W</span>
        <div>
          <button onClick={toggleSound} aria-pressed={soundOn}><i className={soundOn ? 'live' : ''} /> {english ? 'Sound' : 'Sonido'}</button>
          <button onClick={() => setEnglish(!english)}>{english ? 'ES' : 'EN'}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <img src="images/facade.webp" alt="Fachada de Mia Leticia en el Centro Histórico de Quito" />
        <div className="shade" />
        <p className="folio">QUITO · ECUADOR · 2026</p>
        <h1>
          <span>{english ? 'Your door' : 'Tu puerta'}</span>
          <em>{english ? 'into' : 'de entrada'}</em>
          <span>{english ? 'Ecuador.' : 'a Ecuador.'}</span>
        </h1>
        <p className="dek">
          {english ? 'A colonial house in Quito’s Historic Centre.' : 'Una casa colonial en el corazón del Centro Histórico.'}<br />
          {english ? 'The first page of your journey.' : 'La primera página de tu viaje.'}
        </p>
        <a className="enter" href="#entrar">{english ? 'Enter' : 'Entrar'} ↓</a>
      </section>

      <section className="ml-threshold" id="entrar" data-scene="threshold">
        <div className="ml-stage ml-threshold-stage">
          <div className="ml-threshold-frame ml-photo-crop ml-crop-arrival">
            <img
              src={hotelPhotos.arrival}
              alt="Viajeros llegando a Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/warm-interior.webp')}
            />
          </div>
          <p className="ml-kicker">{english ? 'FROM THE STREET TO THE HOUSE' : 'DE LA CALLE A LA CASA'}</p>
          <h2 className="ml-threshold-title">
            <span className="ml-window" data-window="0.08:0.47">{english ? 'The city stays outside.' : 'La ciudad queda atrás.'}</span>
            <em className="ml-window" data-window="0.40:0.84">{english ? 'The house starts here.' : 'La casa empieza aquí.'}</em>
          </h2>
          <p className="ml-window ml-threshold-note" data-window="0.67:0.98">
            {english ? 'Montúfar N5-91 and Mejía. Three blocks from Plaza Grande.' : 'Montúfar N5-91 y Mejía. A tres cuadras de la Plaza Grande.'}
          </p>
          <div className="ml-threshold-line"><i /></div>
        </div>
      </section>

      <section className="ml-patio" data-scene="patio">
        <div className="ml-stage ml-patio-stage">
          <img src="images/hero-patio.webp" alt="Patio colonial de Mia Leticia" />
          <div className="ml-cursor-light" />
          <p className="ml-kicker">01 — {english ? 'THE HOUSE' : 'LA CASA'}</p>
          <h2 className="ml-window ml-patio-title" data-window="0.08:0.47">
            <span>{english ? 'You are' : 'Ya estás'}</span>
            <em>{english ? 'home.' : 'en casa.'}</em>
          </h2>
          <p className="ml-window ml-patio-copy" data-window="0.48:0.88">
            {english ? 'A colonial house made for hospitality, three blocks from Plaza Grande.' : 'Una casa colonial hecha para recibir, a tres cuadras de la Plaza Grande.'}
          </p>
        </div>
      </section>

      <section className="ml-stay" data-scene="stay">
        <div className="ml-stage ml-stay-stage">
          <p className="ml-kicker">02 — {english ? 'THE STAY' : 'LA ESTANCIA'}</p>

          <figure className="ml-window ml-stay-shot breakfast ml-photo-crop ml-crop-breakfast" data-window="0.00:0.28">
            <img
              loading="lazy"
              src={hotelPhotos.breakfast}
              alt="Desayuno en Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/detail.webp')}
            />
          </figure>
          <figure className="ml-window ml-stay-shot games ml-photo-crop ml-crop-games" data-window="0.24:0.52">
            <img
              loading="lazy"
              src={hotelPhotos.games}
              alt="Huéspedes compartiendo juegos de mesa en Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/reading-area.webp')}
            />
          </figure>
          <figure className="ml-window ml-stay-shot family ml-photo-crop ml-crop-family" data-window="0.48:0.76">
            <img
              loading="lazy"
              src={hotelPhotos.family}
              alt="Familia en una habitación de Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/room-gallery.webp')}
            />
          </figure>
          <figure className="ml-window ml-stay-shot commons ml-photo-crop ml-crop-commons" data-window="0.72:1.00">
            <img
              loading="lazy"
              src={hotelPhotos.commons}
              alt="Área común de Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/house-gallery.webp')}
            />
          </figure>

          <div className="ml-stay-copy">
            <article className="ml-window" data-window="0.02:0.27">
              <small>08:00 — 10:00</small>
              <h2>{english ? 'Start with breakfast.' : 'Empieza con desayuno.'}</h2>
              <p>{english ? 'Breakfast is included before the Historic Centre starts calling.' : 'Desayuno incluido antes de salir a caminar el Centro Histórico.'}</p>
            </article>
            <article className="ml-window" data-window="0.27:0.51">
              <small>{english ? 'COMMON AREAS' : 'ESPACIOS COMUNES'}</small>
              <h2>{english ? 'A place to share.' : 'También se comparte.'}</h2>
              <p>{english ? 'Reading, board games and corners where the trip slows down for a while.' : 'Lectura, juegos de mesa y rincones donde el viaje baja el ritmo por un momento.'}</p>
            </article>
            <article className="ml-window" data-window="0.51:0.75">
              <small>{english ? 'FAMILY ROOMS' : 'HABITACIONES FAMILIARES'}</small>
              <h2>{english ? 'Travelling together fits here.' : 'Viajar juntos cabe aquí.'}</h2>
              <p>{english ? 'Rooms for solo travellers, couples, groups and families.' : 'Habitaciones para quien viaja solo, en pareja, en grupo o en familia.'}</p>
            </article>
            <article className="ml-window" data-window="0.75:0.99">
              <small>{english ? 'THE PRACTICAL SIDE' : 'LO PRÁCTICO'}</small>
              <h2>{english ? 'The basics are already solved.' : 'Lo básico ya está resuelto.'}</h2>
              <p>{english ? 'Wi-Fi, 24-hour reception, hot showers and local guidance from the house.' : 'Wi-Fi, recepción 24 horas, duchas calientes y orientación local desde la casa.'}</p>
            </article>
          </div>

          <div className="ml-stay-rail" aria-hidden="true">
            <span><b>01</b> Wi-Fi</span>
            <span><b>02</b> {english ? 'Breakfast' : 'Desayuno'}</span>
            <span><b>03</b> {english ? '24h reception' : 'Recepción 24h'}</span>
            <span><b>04</b> {english ? 'Private bathroom' : 'Baño privado'}</span>
          </div>
        </div>
      </section>

      <section className="ml-rooms" id="habitaciones" data-scene="rooms">
        <div className="ml-stage ml-rooms-stage">
          <div className="ml-room-image">
            <img src={room.src} alt={room.alt} />
            <img className="ml-room-reveal" src={room.src} alt="" aria-hidden="true" />
          </div>
          <div className="ml-room-shade" />
          <p className="ml-kicker">03 — {english ? 'ROOMS' : 'HABITACIONES'}</p>
          <h2 className="ml-room-title">{english ? 'Sleep here.' : 'Dormir aquí.'}</h2>
          <nav className="ml-room-nav" aria-label={english ? 'Room types' : 'Tipos de habitación'}>
            {roomImages.map((item, index) => (
              <button
                key={item.nameEs}
                className={activeRoom === index ? 'active' : ''}
                onMouseEnter={() => { roomRef.current = index; setActiveRoom(index); }}
                onFocus={() => { roomRef.current = index; setActiveRoom(index); }}
                onClick={() => { roomRef.current = index; setActiveRoom(index); }}
              >
                <small>{String(index + 1).padStart(2, '0')}</small>
                <span>{english ? item.nameEn : item.nameEs}</span>
              </button>
            ))}
          </nav>
          <p className="ml-room-meta">{english ? 'Private bathroom · hot shower · breakfast included' : 'Baño privado · ducha caliente · desayuno incluido'}</p>
          <p className="ml-room-hint">{english ? 'Move the cursor across the room.' : 'Mueve el cursor sobre la habitación.'}</p>
        </div>
      </section>

      <section className="ml-morning" data-scene="morning">
        <div className="ml-stage ml-morning-stage">
          <img className="ml-morning-room" src="images/warm-interior.webp" alt="Interior de Mia Leticia por la mañana" />
          <img className="ml-morning-city" src="images/quito-street.webp" alt="Centro Histórico de Quito" />
          <div className="ml-morning-shade" />
          <span className="ml-window ml-clock" data-window="0.02:0.25">07:12</span>
          <span className="ml-window ml-clock" data-window="0.26:0.48">07:48</span>
          <span className="ml-window ml-clock" data-window="0.49:0.72">08:16</span>
          <h2 className="ml-window ml-morning-line one" data-window="0.12:0.48">{english ? 'Wake up.' : 'Despierta.'}</h2>
          <h2 className="ml-window ml-morning-line two" data-window="0.43:0.76">{english ? 'Quito is already outside.' : 'Quito ya está afuera.'}</h2>
          <div className="ml-window ml-outside" data-window="0.70:0.99">{english ? 'OUTSIDE' : 'AFUERA'}</div>
        </div>
      </section>

      <section className="ml-quito" id="quito" data-scene="quito">
        <div className="ml-stage ml-quito-stage">
          <img className="ml-window ml-quito-image" data-window="0.00:0.29" src="images/plaza-grande.webp" alt="Plaza Grande de Quito" />
          <img className="ml-window ml-quito-image" data-window="0.25:0.52" src="images/quito-cathedral.webp" alt="Catedral Metropolitana de Quito" />
          <img className="ml-window ml-quito-image" data-window="0.48:0.76" src="images/quito-street.webp" alt="Calles del Centro Histórico de Quito" />
          <img className="ml-window ml-quito-image" data-window="0.72:1.00" src="images/quito-panorama.webp" alt="Panorama de Quito" />
          <div className="ml-quito-mask" />
          <div className="ml-route"><i /></div>
          <p className="ml-window ml-quito-label" data-window="0.03:0.26"><small>3 {english ? 'blocks' : 'cuadras'}</small>Plaza Grande</p>
          <p className="ml-window ml-quito-label" data-window="0.28:0.49">Catedral Metropolitana</p>
          <p className="ml-window ml-quito-label" data-window="0.52:0.73">La Compañía · Teatro Sucre</p>
          <p className="ml-window ml-quito-label" data-window="0.76:0.98">{english ? 'Walk the Historic Centre.' : 'Camina el Centro Histórico.'}</p>
          <b className="ml-quito-word">QUITO</b>
        </div>
      </section>

      <section className="ml-thesis" data-scene="thesis">
        <div className="ml-stage ml-thesis-stage">
          <p className="ml-window ml-thesis-line l1" data-window="0.04:0.35">MIA LETICIA</p>
          <p className="ml-window ml-thesis-line l2" data-window="0.25:0.57">{english ? 'IS NOT' : 'NO ES'}</p>
          <p className="ml-window ml-thesis-line l3" data-window="0.48:0.76">{english ? 'THE DESTINATION.' : 'EL DESTINO.'}</p>
          <p className="ml-window ml-thesis-small" data-window="0.72:0.98">{english ? 'It is where Ecuador begins.' : 'Es donde comienza Ecuador.'}</p>
        </div>
      </section>

      <section className="ml-ecuador" id="ecuador" data-scene="ecuador">
        <div className="ml-stage ml-ecuador-stage">
          {ecuador.map(([name, image], index) => {
            const start = index / ecuador.length;
            const end = (index + 1) / ecuador.length + 0.02;
            return <img key={name} className="ml-window ml-ecuador-image" data-window={`${Math.max(0, start - 0.015)}:${Math.min(1, end)}`} src={image} alt={name} />;
          })}
          <div className="ml-ecuador-shade" />
          <p className="ml-kicker">04 — {english ? 'BEYOND QUITO' : 'MÁS ALLÁ DE QUITO'}</p>
          <div className="ml-ecuador-track">
            {ecuador.map(([name], index) => (
              <button
                key={name}
                className={activeDestination === index ? 'active' : ''}
                onMouseEnter={() => { destinationRef.current = index; setActiveDestination(index); }}
              >{name}</button>
            ))}
          </div>
          <p className="ml-ecuador-copy">{english ? 'From this house, the country opens.' : 'Desde esta casa, el país se abre.'}</p>
          <span className="ml-ecuador-index">0{activeDestination + 1} / 05</span>
        </div>
      </section>

      <section className="ml-scale" data-scene="scale">
        <div className="ml-stage ml-scale-stage">
          <h2 className="ml-window" data-window="0.08:0.74">{english ? 'And this is only the beginning.' : 'Y esto recién empieza.'}</h2>
          <div className="ml-regions">
            <span>ANDES</span><span>AMAZONÍA</span><span>COSTA</span><span>GALÁPAGOS</span>
          </div>
        </div>
      </section>

      <section className="ml-return" id="reserva" data-scene="return">
        <div className="ml-stage ml-return-stage">
          <div className="ml-return-frame ml-photo-crop ml-crop-return">
            <img
              loading="lazy"
              src={hotelPhotos.returnCouple}
              alt="Pareja de huéspedes en Mia Leticia"
              onError={(event) => fallbackPhoto(event, 'images/reading-area.webp')}
            />
          </div>
          <div className="ml-return-shade" />
          <h2 className="ml-window ml-return-one" data-window="0.06:0.48">{english ? 'Go out and discover.' : 'Sales a descubrir.'}</h2>
          <h2 className="ml-window ml-return-two" data-window="0.43:0.82">{english ? 'Come back home.' : 'Vuelves a casa.'}</h2>
          <div className="ml-window ml-return-info" data-window="0.72:0.99">
            <p>{english ? 'Historic Centre · 24-hour reception · breakfast included' : 'Centro Histórico · recepción 24 horas · desayuno incluido'}</p>
            <a href="https://wa.me/593982023389" target="_blank" rel="noreferrer">{english ? 'BOOK YOUR ARRIVAL' : 'RESERVAR LA LLEGADA'} ↗</a>
          </div>
          <footer>
            <b>MIA LETICIA</b>
            <span>Montúfar N5-91 y Mejía · Quito</span>
            <span>+593 98 202 3389 · info@mialeticia.com</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
