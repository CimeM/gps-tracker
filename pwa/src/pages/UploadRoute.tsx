import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, FileCheck, AlertCircle, Loader } from 'lucide-react';
import { useRoutes } from '../context/RouteContext';

const UploadRoute: React.FC = () => {
  const navigate = useNavigate();
  const { addRoute, loading } = useRoutes();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setError('Only GPX files are supported');
      return false;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return false;
    }
    
    return true;
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setFile(file);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setFile(file);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      const success = await addRoute(file);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Failed to parse GPX file');
      }
    } catch (error) {
      setError('An error occurred while processing the file');
      console.error(error);
    }
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Upload Route</h1>
        <p className="text-text-light">Upload a GPX file to add a new route</p>
      </div>
      
      <div className="card mb-6">
        <div
          className={`
            p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
            transition-all duration-200
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{ minHeight: '16rem' }}
        >
          {file ? (
            <div className="fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{file.name}</h3>
              <p className="text-text-light mb-4">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Upload Route'
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-primary" />
              </div>
              
              {error ? (
                <div className="mb-4 text-red-500 flex items-center gap-2 font-medium">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              ) : (
                <h3 className="text-lg font-semibold mb-4">
                  Drag & Drop your GPX file here
                </h3>
              )}
              
              <p className="text-text-light mb-6">
                or click to browse your files
              </p>
              
              <button
                className="btn btn-primary"
                onClick={openFileSelector}
              >
                Browse Files
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".gpx"
                className="hidden"
                onChange={handleChange}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">About GPX Files</h3>
        <p className="text-text-light mb-4">
          GPX (GPS Exchange Format) is a common file format for GPS data. 
          You can export GPX files from popular fitness apps and GPS devices such as:
        </p>
        
        <ul className="list-disc pl-6 text-text-light space-y-2">
          <li>Garmin Connect</li>
          <li>Strava</li>
          <li>Komoot</li>
          <li>MapMyRun</li>
          <li>RunKeeper</li>
          <li>Most GPS watches and bike computers</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadRoute;