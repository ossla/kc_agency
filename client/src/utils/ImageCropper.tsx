import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import "../styles/Admin.css"


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

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    const cropped = await getCroppedImg(imageFile, croppedAreaPixels);
    onCropped(cropped);
  };

  return (
    <div className="image-cropper-overlay">
      <div className="cropper-container">
        <Cropper
          image={URL.createObjectURL(imageFile)}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
        />
      </div>

      <div className="cropper-buttons">
        <button onClick={handleCrop} className="cropper-button-confirm">Обрезать</button>
        <button onClick={onCancel} className="cropper-button-cancel">Отмена</button>
      </div>
    </div>
  );
}
