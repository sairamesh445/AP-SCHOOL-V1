import { useState, useRef } from 'react';
import { getImageSrc } from '../utils/image';

export default function ImageUpload({
  label = 'Upload Image',
  required = false,
  currentUrl = '',
  onFileChange,
  hint = 'JPG, PNG, GIF or WEBP — max 5MB'
}) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      onFileChange?.(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileChange?.(file);
  };

  const displaySrc = preview || (currentUrl ? getImageSrc(currentUrl) : null);

  return (
    <div className="form-group image-upload-group">
      <label>{label}{required ? ' *' : ''}</label>
      {displaySrc && (
        <div className="image-upload-preview">
          <img src={displaySrc} alt="Preview" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleChange}
        required={required && !currentUrl}
      />
      <p className="image-upload-hint">{hint}</p>
      {currentUrl && !preview && (
        <p className="image-upload-hint">Current image kept unless you choose a new file.</p>
      )}
    </div>
  );
}
