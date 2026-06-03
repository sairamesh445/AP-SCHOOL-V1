import { useState, useEffect } from 'react';
import { getImageSrc } from '../utils/image';

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides?.length) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides?.length) {
    return (
      <div className="carousel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg,#1B4965,#FF6B35)' }}>
        <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Welcome to AP Civic Education Portal</span>
      </div>
    );
  }

  return (
    <div className="carousel">
      {slides.map((slide, i) => (
        <div key={slide.id} className={`carousel-slide${i === current ? ' active' : ''}`}>
          <img src={getImageSrc(slide.imageUrl)} alt={slide.caption || 'Slide'} />
          {slide.caption && <div className="carousel-caption">{slide.caption}</div>}
        </div>
      ))}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
