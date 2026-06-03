import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';
// Import the styles for text and annotation layers
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// This dynamically points to the correct worker in node_modules
// preventing the "API version does not match" error
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PdfViewer = ({ file, onError, className = "" }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Reset state when file changes
  useEffect(() => {
    setPageNumber(1);
    setError(null);
    setIsLoading(true);
    setIsRendering(false);
  }, [file]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pageNumber, numPages, isFullscreen]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF Load Error:", err);
    const errorMessage = err.message || "Failed to load PDF. Please check the file URL or CORS settings.";
    setError(errorMessage);
    setIsLoading(false);
    if (onError) onError(err);
  }, [onError]);

  const onPassword = useCallback((callback) => {
    const password = prompt('This PDF is password protected. Please enter the password:');
    callback(password);
  }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(s + 0.15, 2.5)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(s - 0.15, 0.5)), []);
  const fitToWidth = useCallback(() => setScale(1.2), []);
  const fitToPage = useCallback(() => setScale(1.0), []);

  const goToPrevPage = useCallback(() => {
    if (pageNumber <= 1) return;
    setIsRendering(true);
    setPageNumber(p => Math.max(p - 1, 1));
  }, [pageNumber]);

  const goToNextPage = useCallback(() => {
    if (pageNumber >= (numPages || 1)) return;
    setIsRendering(true);
    setPageNumber(p => Math.min(p + 1, numPages || 1));
  }, [pageNumber, numPages]);

  const handlePageChange = useCallback((e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setIsRendering(true);
      setPageNumber(page);
    }
  }, [numPages]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Memoize file to prevent unnecessary re-renders
  const memoizedFile = useMemo(() => {
    if (!file) return null;
    
    // Handle CORS for external URLs
    if (typeof file === 'string' && file.startsWith('http')) {
      return {
        url: file,
        withCredentials: false,
      };
    }
    return file;
  }, [file]);

  if (!file) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-gray-500">No PDF file available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm ${className}`}
      id="pdf-viewer-container"
    >
      {/* Modern Toolbar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-20 flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Page Navigation */}
          <div className="flex items-center bg-gray-100 rounded-xl px-2 py-1">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading}
              className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Page (←)"
            >
              ←
            </button>
            
            <div className="flex items-center gap-2 px-2">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={handlePageChange}
                disabled={!numPages || isLoading}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-600">
                of {numPages || "—"}
              </span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1) || isLoading}
              className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Page (→)"
            >
              →
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button 
              onClick={zoomOut} 
              className="p-2 hover:bg-white rounded-lg transition-all text-lg font-semibold" 
              title="Zoom Out (-)"
              disabled={scale <= 0.5}
            >
              −
            </button>
            <span className="px-3 text-sm font-semibold text-gray-700 min-w-[52px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={zoomIn} 
              className="p-2 hover:bg-white rounded-lg transition-all text-lg font-semibold" 
              title="Zoom In (+)"
              disabled={scale >= 2.5}
            >
              ＋
            </button>
          </div>

          {/* View Options */}
          <div className="flex items-center gap-1">
            <button
              onClick={fitToWidth}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all"
              title="Fit to Width"
            >
              Fit Width
            </button>
            <button
              onClick={fitToPage}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all"
              title="Fit to Page"
            >
              Fit Page
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
          >
            <span>{isFullscreen ? "🗗" : "🗖"}</span>
            <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
          
          {typeof file === 'string' && (
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
              download
            >
              <span>↓</span>
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 overflow-auto p-8 bg-gray-100 flex items-start justify-center relative">
        {/* Loading Overlay */}
        {(isLoading || isRendering) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-30">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-600">
              {isLoading ? "Loading document..." : "Rendering page..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {error ? (
          <div className="max-w-lg w-full bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Couldn't Load PDF</h3>
            <p className="text-gray-600 text-sm leading-relaxed break-words">{error}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition"
              >
                Reload Page
              </button>
              <button 
                onClick={() => setError(null)}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          /* PDF Document */
          <div className="shadow-2xl border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all">
            <Document
              file={memoizedFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              onPassword={onPassword}
              loading={null} // We handle loading ourselves
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                onRenderSuccess={() => setIsRendering(false)}
                onRenderError={() => setIsRendering(false)}
                className="shadow-inner"
                loading={null}
              />
            </Document>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2.5 text-xs text-gray-500 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span>
            {numPages && `Page ${pageNumber} of ${numPages}`}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            Scale: {Math.round(scale * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">⌨️ Arrow keys to navigate</span>
          <span className="text-emerald-600 font-medium">
            Powered by PDF.js
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;