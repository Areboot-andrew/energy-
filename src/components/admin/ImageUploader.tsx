"use client";

import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        alert("Помилка завантаження");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка завантаження");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase text-secondary-fixed-dim">{label}</label>}
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container">
            <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
          </div>
        )}
        {!value && (
          <div className="w-24 h-24 rounded-lg border border-outline-variant/30 bg-surface-container flex items-center justify-center text-secondary-fixed-dim">
            <ImageIcon />
          </div>
        )}
        <div className="flex-1">
          <label className="cursor-pointer bg-surface-container-high hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-outline-variant/30 text-white w-fit">
            {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Завантаження..." : "Вибрати файл"}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
          <p className="text-xs text-secondary-fixed-dim mt-2">Підтримувані формати: JPG, PNG. Буде конвертовано у WEBP.</p>
        </div>
      </div>
    </div>
  );
}
