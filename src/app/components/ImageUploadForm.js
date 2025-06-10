"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageUploadForm({ productId, onUploaded }) {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      await fetch("/api/update-image", {
        method: "POST",
        body: JSON.stringify({ productId, imageUrl: data.url }),
        headers: { "Content-Type": "application/json" },
      });
      onUploaded?.(data.url);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded transition-colors">
          Выберите файл
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
          />
        </label>
        {file && (
          <span className="text-sm text-gray-600">{file.name}</span>
        )}
      </div>

      {preview && (
        <div className="mt-2">
          <Image
            src={preview}
            alt="preview"
            width={192}
            height={192}
            className="h-48 w-48 object-cover rounded border border-gray-300"
          />
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm"
        >
          {loading ? "Загрузка..." : "Загрузить"}
        </button>
      )}
    </div>
  );
}
