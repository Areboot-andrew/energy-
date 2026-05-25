"use client";

import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import ImageCropperModal from "./ImageCropperModal";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setSelectedImageSrc(reader.result?.toString() || null);
      setCropModalOpen(true);
    });
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropModalOpen(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped.jpg");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Append timestamp to force browser to ignore cache just in case
        onChange(`${data.url}?t=${Date.now()}`);
      } else {
        alert("Помилка завантаження");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка завантаження");
    } finally {
      setUploading(false);
      setSelectedImageSrc(null);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase text-secondary-fixed-dim">{label}</label>}
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container shrink-0">
            <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
          </div>
        )}
        {!value && (
          <div className="w-24 h-24 rounded-lg border border-outline-variant/30 bg-surface-container flex items-center justify-center text-secondary-fixed-dim shrink-0">
            <ImageIcon />
          </div>
        )}
        <div className="flex-1">
          <label className="cursor-pointer bg-surface-container-high hover:bg-surface-container-highest transition-colors px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-outline-variant/30 text-white w-fit shadow-sm">
            {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Завантаження..." : "Вибрати фото"}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
          </label>
          <p className="text-[11px] text-secondary-fixed-dim mt-2 leading-relaxed max-w-xs">
            Виберіть фото для завантаження. Ви зможете візуально обрізати його перед збереженням на сервер.
          </p>
        </div>
      </div>

      {selectedImageSrc && (
        <ImageCropperModal
          imageSrc={selectedImageSrc}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setSelectedImageSrc(null);
          }}
          onCropComplete={handleCropComplete}
          aspect={4 / 3} // Default aspect ratio for portfolio and generic images
        />
      )}
    </div>
  );
}
