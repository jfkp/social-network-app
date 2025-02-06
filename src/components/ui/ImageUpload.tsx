"use client";

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  previewUrl?: string;
}

export default function ImageUpload({ onImageSelect, onImageClear, previewUrl }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative aspect-square w-full">
          <Image
            src={previewUrl}
            alt="Upload preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            onClick={onImageClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="h-8 w-8 mb-2 text-gray-400" />
            <span className="text-sm text-gray-500">
              Drop an image here, or click to select
            </span>
          </label>
        </div>
      )}
    </div>
  );
} 