"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface Point { x: number; y: number }
interface Area { width: number; height: number; x: number; y: number }

interface ImageCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspect?: number;
}

export default function ImageCropperModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspect = 4 / 3,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert("Помилка при обрізці зображення");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high z-10 shrink-0">
          <h3 className="text-lg font-bold text-white">Кадрування фото</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-grow bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-6 bg-surface-container-high border-t border-outline-variant/20 space-y-4 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-secondary-fixed-dim text-sm font-bold">Zoom:</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary-fixed"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-surface-container border border-outline-variant/30 text-white font-bold rounded-lg hover:bg-surface-container-highest transition-colors"
            >
              Скасувати
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 bg-primary-fixed text-on-primary-fixed font-bold rounded-lg hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(213,240,0,0.3)]"
            >
              <Check size={18} /> Зберегти та Завантажити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility to extract cropped image as Blob
export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) resolve(file);
      else reject(new Error("Canvas is empty"));
    }, "image/jpeg", 0.9);
  });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid CORS issues
    image.src = url;
  });
