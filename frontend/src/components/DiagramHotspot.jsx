import { useState, useEffect } from 'react';
import { getImageSrc } from '../utils/image';
import { getHotspotStyle, getAssemblyHotspotClass, getCourtHotspotClass } from '../config/diagramSlots';

function HoverCardPhoto({ photo, alt, fallbackLabel }) {
  const [failed, setFailed] = useState(false);
  const src = photo ? getImageSrc(photo) : '';

  useEffect(() => {
    setFailed(false);
  }, [photo]);

  const showPhoto = Boolean(src && !failed);

  return (
    <div
      className={`hover-card-image-wrap${showPhoto ? ' has-photo' : ''}`}
      role={showPhoto ? 'img' : undefined}
      aria-label={showPhoto ? alt : undefined}
      style={showPhoto ? { backgroundImage: `url("${src}")` } : undefined}
    >
      {showPhoto && (
        <img
          className="hover-card-image-probe"
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setFailed(true)}
        />
      )}
      {!showPhoto && (
        <div className="hover-card-image-placeholder">
          {(fallbackLabel || '?').charAt(0)}
        </div>
      )}
    </div>
  );
}

export function HoverDetailCard({ data, mousePos, photoField = 'personPhoto' }) {
  if (!data) return null;
  const photo = data[photoField];
  const label = data.personName || data.name || data.title;
  return (
    <div
      className="hover-card hover-card-with-image"
      style={{
        left: Math.min(mousePos.x, window.innerWidth - 340),
        top: Math.min(mousePos.y, window.innerHeight - 400)
      }}
    >
      <HoverCardPhoto photo={photo} alt={label} fallbackLabel={label} />
      <div className="hover-card-text">
        <h3>{data.personName || data.name || '—'}</h3>
        <h4>
          {data.title}
          {data.designation ? ` — ${data.designation}` : ''}
        </h4>
        <p>{data.responsibilities || 'No details available.'}</p>
      </div>
    </div>
  );
}

function HotspotButton({ data, style, onHover, onLeave, variant = '' }) {
  const photo = data?.personPhoto || data?.photoUrl;
  const slotClass =
    variant === 'assembly'
      ? getAssemblyHotspotClass(data?.slot)
      : variant === 'court'
        ? getCourtHotspotClass(data?.slot)
        : '';
  return (
    <button
      type="button"
      className={`diagram-hotspot ${slotClass}`.trim()}
      style={style}
      data-slot={data?.slot}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(data)}
      onBlur={onLeave}
    >
      {photo && (
        <span className="hotspot-thumb">
          <img src={getImageSrc(photo)} alt="" />
        </span>
      )}
      <span className="hotspot-label">{data?.title || 'Position'}</span>
      {data?.personName && <span className="hotspot-name">{data.personName}</span>}
    </button>
  );
}

export default function ImageDiagram({ bgImage, alt, positions, defaults, variant = '' }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="image-diagram-wrap"
      onMouseMove={(e) => setMousePos({ x: e.clientX + 15, y: e.clientY + 15 })}
    >
      <div className="image-diagram-bg">
        <img src={bgImage} alt={alt} className="diagram-reference-img" />
        <div className="diagram-hotspots-layer">
          {positions.map((pos) => (
            <HotspotButton
              key={pos.id}
              data={pos}
              style={getHotspotStyle(pos, defaults)}
              variant={variant}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
      <p className="diagram-hint">💡 Hover on highlighted cards to see photo and role details</p>
      <HoverDetailCard data={hovered} mousePos={mousePos} />
    </div>
  );
}
