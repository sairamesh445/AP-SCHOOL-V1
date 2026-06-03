import ImageDiagram from './DiagramHotspot';
import { COURT_HOTSPOTS } from '../config/diagramSlots';

export default function CourtDiagram({ positions }) {
  return (
    <ImageDiagram
      bgImage="/images/courtroom-layout.png?v=20260522hc"
      alt="High Court of Andhra Pradesh — courtroom seating layout"
      positions={positions}
      defaults={COURT_HOTSPOTS}
      variant="court"
    />
  );
}
