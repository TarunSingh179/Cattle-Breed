import React, { useRef, useState } from 'react';

const ACCEPTED = ['image/jpeg','image/png','image/webp','image/bmp','image/tiff'];

export default function UploadArea({ file, onFileSelected, previewUrl, disabled }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const openPicker = () => !disabled && inputRef.current?.click();

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    onFileSelected?.(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={openPicker}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={onChange}
        className="hidden"
        disabled={disabled}
      />
      {!file && (
        <div>
          <div className="text-slate-600">
            <strong>Drag & drop</strong> an image here, or <span className="text-sky-600 underline">click to browse</span>
          </div>
          <div className="text-xs text-slate-500 mt-2">Accepted: JPG, PNG, WEBP, BMP, TIFF. Max 8 MB.</div>
        </div>
      )}
      {file && (
        <div className="flex flex-col items-center gap-3">
          {previewUrl && (
            <img src={previewUrl} alt="preview" className="max-h-64 rounded-lg shadow border" />
          )}
          <div className="text-sm text-slate-700">{file.name} ({Math.round(file.size/1024)} KB)</div>
        </div>
      )}
    </div>
  );
}
