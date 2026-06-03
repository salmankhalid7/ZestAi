import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocumentSummary, generateSummary } from "../services/Api/summaryService";

const Summary = ({ documentId, title }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (documentId) {
      fetchSummary();
    }
  }, [documentId]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getDocumentSummary(documentId);
      setSummary(response.summary);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      if (err.response?.status === 404) {
        setError("No summary found. Generate one to get started.");
      } else {
        setError("Failed to load summary. Please try again.");
      }
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setGenerating(true);
      setError(null);
      const response = await generateSummary(documentId);
      setSummary(response.summary);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading summary...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Summary</h1>
                <p className="text-gray-500 mt-1">Powered by intelligent document analysis</p>
              </div>
            </div>

            {(!summary || error) && (
              <button
                onClick={handleGenerateSummary}
                disabled={generating}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Document Title */}
          {title && (
            <div className="mb-8 pb-6 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                DOCUMENT
              </p>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {title}
              </h2>
            </div>
          )}

          {/* Error State */}
          {error && !summary && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleGenerateSummary}
                disabled={generating}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all"
              >
                {generating ? "Generating..." : "Generate Summary"}
              </button>
            </div>
          )}

          {/* Summary Section */}
          {summary && !error && (
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>EXECUTIVE SUMMARY</span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
              </h3>

              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-emerald-600 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
                    p: ({ children }) => <p className="text-[15.5px] leading-relaxed mb-5">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-5">{children}</ol>,
                    li: ({ children }) => <li className="text-[15.5px]">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-5">
                        {children}
                      </blockquote>
                    ),
                    code({ inline, children }) {
                      return inline ? (
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{children}</code>
                      ) : (
                        <code className="block overflow-x-auto p-4 rounded-xl">{children}</code>
                      );
                    },
                  }}
                >
                  {summary}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Insights */}
          {summary && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Summary Ended.
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;