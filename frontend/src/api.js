import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
const DEBUG = (process.env.REACT_APP_DEBUG || 'true').toLowerCase() === 'true';

export async function predictImage(file, onProgress) {
  const url = `${BASE_URL}/predict`;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (!evt.total) return;
        const percent = Math.round((evt.loaded * 100) / evt.total);
        if (onProgress) onProgress(percent);
        if (DEBUG) console.debug('Upload progress', percent);
      },
      timeout: 30000,
    });
    return res.data;
  } catch (err) {
    if (DEBUG) console.error('API error', err);
    const msg = err?.response?.data?.message || err.message || 'Upload failed';
    const code = err?.response?.data?.error || 'upload_error';
    throw new Error(`${code}: ${msg}`);
  }
}
