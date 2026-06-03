import React, { useEffect, useState } from "react";
import { getFlashcards, generateFlashcards } from "../services/Api/flashcardService";

const Flashcards = ({ documentId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [flippedCards, setFlippedCards] = useState({});

  // ===============================
  // FETCH EXISTING FLASHCARDS
  // ===============================
  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await getFlashcards(documentId);
      setFlashcards(res.flashcards?.cards || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GENERATE FLASHCARDS
  // ===============================
  const generateFlashcardsHandler = async () => {
    try {
      setGenerating(true);
      setError("");
      const res = await generateFlashcards(documentId);
      setFlashcards(res.flashcards.cards || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // ===============================
  // FLIP CARD
  // ===============================
  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===============================
  // EMPTY STATE
  // ===============================
  if (flashcards.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-12 max-w-lg w-full text-center">
          <div className="text-6xl mb-5">🧠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Generate AI Flashcards</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
            Instantly create smart study flashcards from your document summary.
          </p>
          <button
            onClick={generateFlashcardsHandler}
            disabled={generating}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg w-full md:w-auto"
          >
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  // ===============================
  // FLASHCARDS UI
  // ===============================
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Flashcards</h1>
          <p className="text-gray-500 mt-2">Master your material with active recall.</p>
        </div>
        <button
          onClick={generateFlashcardsHandler}
          disabled={generating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          {generating ? "Generating..." : "Regenerate Set"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((card, index) => (
          <div key={index} className="group h-64 [perspective:1000px]" onClick={() => toggleFlip(index)}>
            <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${flippedCards[index] ? '[transform:rotateY(180deg)]' : ''}`}>
              <div className="absolute inset-0 bg-white border border-gray-200 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm [backface-visibility:hidden]">
                <span className="absolute top-4 left-4 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded">Question</span>
                <p className="text-lg font-semibold text-gray-800">{card.question}</p>
              </div>
              <div className="absolute inset-0 bg-emerald-600 rounded-3xl p-8 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <span className="absolute top-4 left-4 text-[10px] font-bold text-white uppercase bg-emerald-500 px-2 py-1 rounded">Answer</span>
                <p className="text-lg font-medium text-white">{card.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;