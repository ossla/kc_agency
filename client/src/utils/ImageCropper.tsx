import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import "../styles/Admin.css"
import { createPortal } from "react-dom";


interface ImageCropperProps {
  imageFile: File;
  aspect?: number;
  onCropped: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageFile,
  aspect = 4 / 5,
  onCropped,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setObjectUrl(url);
    return () => {
      try { URL.revokeObjectURL(url); } catch(e){}
      setObjectUrl(null);
    }
  }, [imageFile]);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(imageFile, croppedAreaPixels);
      onCropped(cropped);
    } catch (err) {
      console.error('ImageCropper: error during getCroppedImg', err);
      onCancel();
    }
  };

  const content = (
    <div className="image-cropper-overlay">
      <div className="cropper-container">
        {objectUrl && (
          <Cropper
            image={objectUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        )}
      </div>

      <div className="cropper-buttons">
        <button onClick={handleCrop} className="cropper-button-confirm" disabled={!croppedAreaPixels}>Обрезать</button>
        <button onClick={onCancel} className="cropper-button-cancel">Отмена</button>
      </div>
    </div>
  );

  // render overlay at document.body to avoid z-index/overflow issues
  try {
    return createPortal(content, document.body);
  } catch (e) {
    // fallback if portal not available
    return content;
  }
}
