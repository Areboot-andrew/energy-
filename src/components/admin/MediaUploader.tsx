"use client";

import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";

interface MediaUploaderProps {
  value: string;
  type?: string;
  onChange: (url: string, type: "IMAGE" | "VIDEO") => void;
  label?: string;
}

export default function MediaUploader({ value, type = "IMAGE", onChange, label }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 50 МБ");
      return;
    }

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
        onChange(data.url, data.type || "IMAGE");
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

  const isVideo = type === "VIDEO" || value.endsWith(".mp4") || value.endsWith(".webm");

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase text-secondary-fixed-dim">{label}</label>}
      <div className="flex items-center gap-4">
        {value && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container">
            {isVideo ? (
              <video src={value} className="object-cover w-full h-full" muted />
            ) : (
              <img src={value} alt="Uploaded" className="object-cover w-full h-full" />
            )}
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
            {uploading ? "Завантаження..." : "Завантажити Медіа"}
            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
          </label>
          <p className="text-xs text-secondary-fixed-dim mt-2">Підтримувані формати: JPG, PNG, MP4, WEBM (до 50 МБ).</p>
        </div>
      </div>
    </div>
  );
}
