import React, { useEffect, useMemo, useState } from 'react';
import UploadArea from './components/UploadArea';
import ResultCard from './components/ResultCard';
import { predictImage } from './api';

const DEBUG = (process.env.REACT_APP_DEBUG || 'true').toLowerCase() === 'true';
const MAX_BYTES = (8 * 1024 * 1024); // keep in sync with backend default
const ACCEPTED = ['image/jpeg','image/png','image/webp','image/bmp','image/tiff'];

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFileSelected = (f) => {
    setError('');
    setResult(null);

    if (!f) return;

    if (!ACCEPTED.includes(f.type)) {
      setError('Unsupported file type. Please select a JPG, PNG, WEBP, BMP, or TIFF image.');
      return;
    }
    if (f.size <= 0) {
      setError('Selected file is empty.');
      return;
    }
    if (f.size > MAX_BYTES) {
      setError('File exceeds the 8 MB limit.');
      return;
    }

    setFile(f);
  };

  const onPredict = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setError('');
      const data = await predictImage(file, (p) => setProgress(p));
      setResult(data);
    } catch (e) {
      setError(e.message || 'Prediction failed');
    } finally {
      setUploading(false);
    }
  };

  const onReset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-semibold text-slate-800">Cattle & Buffalo Breed Recognition</h1>
          <div className="text-xs text-slate-500">Prototype</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid gap-6">
        <section className="grid gap-4">
          <UploadArea file={file} onFileSelected={onFileSelected} previewUrl={previewUrl} disabled={uploading} />
          <div className="flex items-center gap-3">
            <button
              onClick={onPredict}
              disabled={!file || uploading}
              className={`px-4 py-2 rounded-md text-white ${uploading ? 'bg-sky-300' : 'bg-sky-600 hover:bg-sky-700'}`}
            >
              {uploading ? 'Predicting…' : 'Predict Breed'}
            </button>
            <button
              onClick={onReset}
              disabled={uploading && !file}
              className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Reset
            </button>
          </div>
          {uploading && (
            <div className="flex items-center gap-3">
              <div className="spinner" />
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-600 h-2" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-sm text-slate-600 min-w-[3rem] text-right">{progress}%</div>
            </div>
          )}
          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}
        </section>

        <section>
          <ResultCard result={result} onReset={onReset} />
        </section>

        <section className="text-xs text-slate-500">
          <div>
            Note: This is a demonstration prototype using a mock model. For production, integrate a real ML model and proper authentication/storage.
          </div>
        </section>
      </main>
    </div>
  );
}
