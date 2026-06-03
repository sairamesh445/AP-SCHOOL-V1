import ImageDiagram from './DiagramHotspot';
import { ASSEMBLY_HOTSPOTS } from '../config/diagramSlots';

export default function AssemblyDiagram({ positions }) {
  return (
    <ImageDiagram
      bgImage="/images/assembly-chamber.png?v=20260522"
      alt="Andhra Pradesh Legislative Assembly chamber — isometric seating layout"
      positions={positions}
      defaults={ASSEMBLY_HOTSPOTS}
      variant="assembly"
    />
  );
}
