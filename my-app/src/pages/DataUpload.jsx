import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupFilesByType } from '../utils';

export default function DataUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setShowSubmit(true);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    if (selectedFiles.length <= 1) {
      setShowSubmit(false);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    const fileTypes = groupFilesByType(selectedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(fileTypes));

    setTimeout(() => {
      setIsProcessing(false);
      navigate('/dashboard');
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">📂 Data Selection</h1>

        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">

          <div className="text-gray-600 space-y-3">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                If you have chosen to map to your data where it resides currently, our ingestion engine will scan the selected files and identify relevant data.
              </li>
              <li>
                If you selected Cloud-based silo storage, proceed to the next page to upload data to your proprietary cloud storage.
              </li>
            </ol>
          </div>

          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <button
              onClick={handleFileSelect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              disabled={isProcessing}
            >
              Select Files
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Selected Files</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-gray-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-xl"
                      disabled={isProcessing}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSubmit && (
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                When all files are selected, click Submit to begin scanning.
              </p>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scanning files...</span>
                  </div>
                ) : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
