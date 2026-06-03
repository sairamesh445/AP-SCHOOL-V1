import { getImageSrc } from '../utils/image';

export default function ContentCard({ item }) {
  return (
    <div className="content-card">
      <img
        className="content-card-img"
        src={getImageSrc(item.imageUrl)}
        alt={item.title}
      />
      <div className="content-card-body">
        <h1>{item.title}</h1>
        <h3>{item.description}</h3>
      </div>
    </div>
  );
}
