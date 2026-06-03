import React, { useEffect, useState } from "react";
import { getDocuments } from "../services/Api/documentService";
import { MessageSquare, Sparkles, FileText } from "lucide-react";

import DocumentCard from "../components/DocumentCard";

const AiChatPage = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchDocs = async () => {
    try {
      setIsLoading(true);
      const data = await getDocuments();
      setDocs(data.documents || []);
    } catch (err) {
      console.error("Documents fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDocs();
}, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-6 mb-10 shadow-sm">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-40" />

        <div className="relative flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Document Chat
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Ask questions and chat with your uploaded documents
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />

            <span className="text-sm font-semibold text-gray-700">
              {docs.length} Documents
            </span>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />

          <p className="text-sm text-gray-400">
            Loading documents...
          </p>
        </div>
      ) : docs.length === 0 ? (

        /* EMPTY STATE */
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 px-6 text-center">

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
            <FileText className="w-9 h-9 text-gray-300" />
          </div>

          <h2 className="text-xl font-bold text-gray-700 mb-2">
            No Documents Found
          </h2>

          <p className="text-gray-400 max-w-md mx-auto">
            Upload documents to start chatting with AI and ask questions about your files.
          </p>
        </div>

      ) : (

        /* DOCUMENT GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
            />
          ))}
        </div>

      )}
    </div>
  );
};

export default AiChatPage;