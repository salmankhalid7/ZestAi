import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocument } from "../services/Api/documentService";

const UploadBox = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await uploadDocument(file);
      setStatusMessage({ type: "success", text: "Document uploaded successfully!" });
      onUpload(res.document);
    } catch (error) {
      setStatusMessage({ type: "error", text: error.message || "Upload failed. Please try again." });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      {/* DROPZONE TARGET */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
          ${isUploading ? "border-gray-200 bg-gray-50 pointer-events-none" : ""}
          ${!isUploading && isDragActive ? "border-green-500 bg-green-50/60 ring-4 ring-green-500/10" : "border-green-200 bg-white hover:border-green-400 hover:bg-green-50/20"}
        `}
      >
        <input {...getInputProps()} />

        {/* CLOUD ICON METAPHOR */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-200
          ${isDragActive ? "bg-green-200 text-green-700" : "bg-green-50 text-green-600"}
        `}>
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          )}
        </div>

        {/* STATUS MESSAGES */}
        {isUploading ? (
          <p className="text-sm font-semibold text-green-800 animate-pulse">
            Analyzing and reading PDF data...
          </p>
        ) : isDragActive ? (
          <p className="text-sm font-semibold text-green-700">
            Drop it right here!
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">
              Drag &amp; drop your PDF here, or <span className="text-green-600 underline decoration-green-500/40 hover:text-green-700 font-bold">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              Only PDF documents are supported
            </p>
          </div>
        )}
      </div>

      {/* INLINE STATUS MESSAGES */}
      {statusMessage.text && (
        <div className={`mt-3 p-3 rounded-lg text-xs font-medium border text-center animate-fadeIn
          ${statusMessage.type === "success" ? "bg-green-50 text-green-800 border-green-100" : "bg-red-50 text-red-800 border-red-100"}
        `}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};

export default UploadBox;