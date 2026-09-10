'use client';

import { useEffect, useRef, useState } from 'react';

const destinations = [
  ['Cotopaxi','/images/cotopaxi.webp'],['Quilotoa','/images/quilotoa.webp'],['Otavalo','/images/otavalo.webp'],
  ['Papallacta','/images/papallacta.webp'],['Baños','/images/banos.webp'],['Cuenca',null],['Guayaquil',null],['Loja',null],['Riobamba',null],
];

export default function Home() {
  const [english,setEnglish] = useState(false);
  const [soundOn,setSoundOn] = useState(false);
  const audio = useRef<AudioContext|null>(null);
  const master = useRef<GainNode|null>(null);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--progress',String(total ? scrollY/total : 0));
      document.documentElement.style.setProperty('--sy',`${scrollY}px`); raf = 0;
      document.querySelectorAll<HTMLElement>('.house,.rooms,.morning,.door,.ecuador,.return').forEach(section=>{
        const r=section.getBoundingClientRect(), span=Math.max(section.offsetHeight-innerHeight,1);
        section.style.setProperty('--scene-progress',String(Math.max(0,Math.min(1,-r.top/span))));
      });
    };
    const scroll = () => { if(!raf) raf=requestAnimationFrame(paint); };
    const pointer = (e:PointerEvent) => {
      document.documentElement.style.setProperty('--mx',String(e.clientX/innerWidth-.5));
      document.documentElement.style.setProperty('--my',String(e.clientY/innerHeight-.5));
    };
    paint(); addEventListener('scroll',scroll,{passive:true}); addEventListener('pointermove',pointer,{passive:true});
    return()=>{removeEventListener('scroll',scroll);removeEventListener('pointermove',pointer);if(raf)cancelAnimationFrame(raf)};
  },[]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.hero h1,.house-copy h2,.morning-title h2,.door-kinetic,.ecuador-head h2,.return h2,.house-main,.house-detail,.house-third,.morning figure,.quito-collage figure,.destination');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-in')), { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const toggleSound=()=>{
    if(!soundOn){
      const ctx=audio.current??new AudioContext(); const gain=ctx.createGain(); gain.gain.value=.018;gain.connect(ctx.destination);
      [55,82.5,110].forEach((frequency,index)=>{const osc=ctx.createOscillator();const g=ctx.createGain();osc.type='sine';osc.frequency.value=frequency;g.gain.value=[.3,.1,.03][index];osc.connect(g).connect(gain);osc.start()});
      audio.current=ctx;master.current=gain;ctx.resume();setSoundOn(true);
    }else{master.current?.gain.setTargetAtTime(.0001,audio.current?.currentTime??0,.2);setSoundOn(false)}
  };

  return <main>
    <div className="progress" />
    <header className="masthead"><a href="#top">MIA LETICIA</a><span>00°13′S · 78°30′W</span><div><button onClick={toggleSound} aria-pressed={soundOn}><i className={soundOn?'live':''}/> {english?'Sound':'Sonido'}</button><button onClick={()=>setEnglish(!english)}>{english?'ES':'EN'}</button></div></header>

    <section className="hero" id="top">
      <img src="images/hero-patio.webp" alt="Patio interior de Mia Leticia" />
      <div className="shade"/><p className="folio">QUITO · ECUADOR · 2026</p>
      <h1><span>{english?'Your door':'Tu puerta'}</span><em>{english?'into':'de entrada'}</em><span>{english?'Ecuador.':'a Ecuador.'}</span></h1>
      <p className="dek">{english?'A colonial house in the heart of the Historic Centre.':'Una casa colonial en el corazón del Centro Histórico.'}<br/>{english?'The first page of your journey.':'La primera página de tu viaje.'}</p>
      <a className="enter" href="#casa">Entrar ↓</a>
    </section>

    <section className="house" id="casa">
      <figure className="house-main"><img src="images/house-gallery.webp" alt="Galería colonial de Mia Leticia"/></figure>
      <figure className="house-detail"><img src="images/reading-area.webp" alt="Espacio interior de la casa"/></figure>
      <div className="house-copy scroll-copy"><p className="eyebrow">01 — {english?'THE HOUSE':'LA CASA'}</p><h2><span>{english?'Come in.':'Entra.'}</span><em>{english?'You are':'Ya estás'}</em><span>{english?'home.':'en casa.'}</span></h2><p>{english?'Wood, wrought iron and adobe. A colonial house holding Quito’s pulse and the warmth of those who live in it.':'Madera, hierro forjado y adobe. Una casa colonial que conserva el pulso de Quito y la calidez de quienes la habitan.'}</p></div>
      <p className="vertical-note">MONTÚFAR N5-91 Y MEJÍA</p>
    </section>

    <section className="rooms" id="habitaciones">
      <div className="rooms-intro"><p className="eyebrow">02 — {english?'ROOMS':'HABITACIONES'}</p><h2>{english?'Stay here':'Hospedarse aquí'}<br/><em>{english?'wake up':'es despertar'}</em><br/>{english?'in Quito.':'en Quito.'}</h2><p>{english?'Single, double and family rooms. All with private bathroom, hot water and breakfast included.':'Habitaciones simples, dobles y familiares. Todas con baño privado, agua caliente y desayuno incluido.'}</p></div>
      <article className="room-scene scene-one"><img src="images/warm-interior.webp" alt="Habitación familiar con vista a Quito"/><div className="room-label"><b>01</b><h3>Familiar</h3><p>Espacio para compartir. Ventanas abiertas hacia la vida del Centro Histórico.</p></div></article>
      <article className="room-scene scene-two"><img src="images/detail.webp" alt="Habitación doble de Mia Leticia"/><div className="room-label"><b>02</b><h3>Doble</h3><p>Dos camas, luz cálida y la tranquilidad de una casa que recibe.</p></div></article>
      <article className="room-scene scene-three"><img src="images/room-gallery.webp" alt="Habitación doble amplia de Mia Leticia"/><div className="room-label"><b>03</b><h3>Doble amplia</h3><p>Madera, color y comodidad para volver después de caminar Quito.</p></div></article>
      <article className="room-scene scene-four"><img src="images/room.webp" alt="Habitación simple de Mia Leticia"/><div className="room-label"><b>04</b><h3>Simple</h3><p>Tu propio refugio en el centro de la ciudad.</p></div></article>
    </section>

    <section className="morning">
      <div className="morning-title"><p className="eyebrow">03 — {english?'MORNING':'LA MAÑANA'}</p><h2>{english?'Wake up.':'Despierta.'}<br/><em>{english?'Quito is':'Quito ya'}</em><br/>{english?'right outside.':'está afuera.'}</h2></div>
      <figure className="morning-a"><img src="images/reading-area.webp" alt="Área de descanso de Mia Leticia"/></figure>
      <figure className="morning-b"><img src="images/detail.webp" alt="Detalle cálido de habitación"/></figure>
      <figure className="morning-c"><img src="images/warm-interior.webp" alt="Luz de mañana en una habitación"/></figure>
      <figure className="morning-d"><img src="images/house-gallery.webp" alt="Galería de Mia Leticia al comenzar el día"/></figure>
    </section>

    <section className="door" id="quito">
      <div className="door-kinetic"><span>{english?'Open':'Abres'}</span><em>{english?'the door.':'la puerta.'}</em><span>Quito</span><em>{english?'happens.':'sucede.'}</em></div>
      <div className="quito-collage">
        <figure className="q1"><img src="images/plaza-grande.webp" alt="Plaza Grande de Quito"/><figcaption>Plaza Grande · 3 cuadras</figcaption></figure>
        <figure className="q2"><img src="images/quito-cathedral.webp" alt="Catedral Metropolitana de Quito"/><figcaption>Catedral Metropolitana</figcaption></figure>
        <figure className="q3"><img src="images/quito-panorama.webp" alt="Panorama del Centro Histórico de Quito"/><figcaption>Centro Histórico</figcaption></figure>
        <figure className="q4"><img src="images/quito-street.webp" alt="Calles del Centro Histórico"/><figcaption>Caminar la ciudad</figcaption></figure>
      </div>
      <p className="quito-line">Plaza Grande · Teatro Sucre · La Compañía · Basílica del Voto Nacional · Museos · Mercados</p>
    </section>

    <section className="ecuador" id="ecuador">
      <div className="ecuador-head"><p className="eyebrow">04 — {english?'BEYOND QUITO':'MÁS ALLÁ DE QUITO'}</p><h2>{english?'From this house,':'Desde esta casa,'}<br/><em>{english?'the country opens.':'el país se abre.'}</em></h2><p>{english?'Mia Leticia is the starting point. The map becomes a road.':'Mia Leticia es el punto de partida. El mapa deja de ser mapa y se convierte en camino.'}</p></div>
      <div className="destination-cloud">{destinations.map(([name,image],i)=><figure className={`destination d${i+1}`} key={name}>{image&&<img src={image} alt={name}/>}<figcaption><span>{String(i+1).padStart(2,'0')}</span>{name}</figcaption></figure>)}</div>
    </section>

    <section className="return" id="reserva">
      <img src="images/hero-patio.webp" alt="Regreso al patio de Mia Leticia"/><div className="shade"/>
      <div className="return-copy"><p className="eyebrow">05 — {english?'RETURN':'REGRESO'}</p><h2>{english?'Go out and discover.':'Sales a descubrir.'}<br/><em>{english?'Come back home.':'Vuelves a casa.'}</em></h2><p>{english?'24-hour reception · Breakfast included · Quito Historic Centre':'Recepción 24 horas · Desayuno incluido · Centro Histórico de Quito'}</p><a href="https://wa.me/593982023389" target="_blank" rel="noreferrer">{english?'Book your arrival':'Reservar la llegada'} ↗</a></div>
      <footer><b>MIA LETICIA</b><span>Montúfar N5-91 y Mejía · Quito</span><span>+593 98 202 3389 · info@mialeticia.com</span></footer>
    </section>
  </main>;
}
