// ===============================
// Quiz.jsx
// ===============================

import React, { useEffect, useState } from "react";
import { 
  CheckCircle, XCircle, AlertCircle, Trophy, 
  TrendingUp, ChevronRight, RefreshCw, 
  Brain, Loader2, Zap
} from "lucide-react";
import { generateQuiz, submitQuizAttempt } from "../services/Api/quizService";

const Quiz = ({ documentId }) => {
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizAttemptId, setQuizAttemptId] = useState(null);

  const fetchQuiz = async () => {
    if (!documentId) {
      setError("No document ID found. Please select a document first.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuiz(null);
    setFinished(false);
    setIndex(0);
    setScore(0);
    setSelected("");

    try {
      const res = await generateQuiz(documentId);

      if (!res.quiz || !res.quiz.questions || res.quiz.questions.length === 0) {
        setError("No quiz questions generated. Please try again.");
        return;
      }

      setQuiz(res.quiz);
    } catch (err) {
      console.error("Quiz generation error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 404) {
        setError("Document not found. Please select a valid document.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to generate quiz. Please check your internet connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [documentId]);

  const submitResult = async () => {
    if (!finished || !quiz) return;

    try {
      const response = await submitQuizAttempt({
        quizId: quiz._id,
        documentId,
        score,
        total: quiz.questions.length,
      });

      if (response.attemptId) {
        setQuizAttemptId(response.attemptId);
      }
    } catch (err) {
      console.error("Failed to submit quiz result:", err.message);
      // Don't show error to user as quiz is already completed
    }
  };

  useEffect(() => {
    if (finished) {
      submitResult();
    }
  }, [finished]);

  const handleAnswerSelect = (option) => {
    if (showFeedback) return; // Prevent changing answer after selection
    setSelected(option);
  };

  const handleCheckAnswer = () => {
    if (!selected) return;
    
    const isAnswerCorrect = selected === currentQuestion.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Auto move to next question after 1.5 seconds
    setTimeout(() => {
      if (isAnswerCorrect) {
        setScore(prev => prev + 1);
      }
      setSelected("");
      setShowFeedback(false);
      
      if (index + 1 < questionsList.length) {
        setIndex(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    handleCheckAnswer();
  };

  const restartQuiz = () => {
    setFinished(false);
    setIndex(0);
    setScore(0);
    setSelected("");
    setShowFeedback(false);
    setQuizAttemptId(null);
    fetchQuiz(); // Refresh quiz for new questions
  };

  const getScorePercentage = () => {
    if (!quiz) return 0;
    return Math.round((score / quiz.questions.length) * 100);
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return { text: "Excellent! Master level achieved!", icon: Trophy, color: "text-yellow-600" };
    if (percentage >= 70) return { text: "Great job! You know your stuff!", icon: TrendingUp, color: "text-green-600" };
    if (percentage >= 50) return { text: "Good effort! Keep practicing!", icon: Brain, color: "text-blue-600" };
    return { text: "Keep learning! Try again to improve!", icon: RefreshCw, color: "text-orange-600" };
  };

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-red-600 font-semibold text-lg mb-2">Quiz Generation Failed</h3>
          <p className="text-red-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchQuiz}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
            <Brain size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" />
          </div>
          <h3 className="text-green-700 text-lg font-semibold mb-2">Generating AI Quiz</h3>
          <p className="text-gray-500 text-sm">Creating personalized questions based on your document...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="text-center">
          <Zap size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 text-lg">Ready to test your knowledge?</h3>
          <button
            onClick={fetchQuiz}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const questionsList = quiz.questions || [];

  if (questionsList.length === 0) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-gray-700 text-lg font-semibold">No Questions Available</h3>
          <p className="text-gray-500 text-sm mt-2">Unable to generate questions. Please try again.</p>
          <button
            onClick={fetchQuiz}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
          >
            <RefreshCw size={18} />
            Regenerate Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questionsList[index];
  const scoreMessage = getScoreMessage();
  const ScoreIcon = scoreMessage.icon;

  // ===============================
  // FINISHED SCREEN
  // ===============================

  if (finished) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="bg-white shadow-2xl rounded-3xl border border-green-100 max-w-2xl w-full overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <Trophy size={40} className="text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Completed! 🎉</h2>
            <p className="text-green-100">Great work on completing the AI evaluation</p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 mb-6 text-center">
              <div className="relative inline-block">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-green-600 transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - getScorePercentage() / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-4xl font-bold text-gray-800">{getScorePercentage()}%</div>
                  <div className="text-xs text-gray-500 mt-1">Score</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <ScoreIcon size={24} className={scoreMessage.color} />
                  <h3 className={`text-xl font-semibold ${scoreMessage.color}`}>
                    {scoreMessage.text}
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{score}</div>
                    <div className="text-xs text-gray-500 mt-1">Correct</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{questionsList.length - score}</div>
                    <div className="text-xs text-gray-500 mt-1">Incorrect</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restartQuiz}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw size={18} />
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // QUIZ UI
  // ===============================

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
        
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 md:px-8 py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                AI Knowledge Quiz
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Brain size={14} />
                Test your understanding
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Score Badge */}
              <div className="bg-green-50 px-4 py-2 rounded-xl">
                <div className="text-xs text-gray-500">Current Score</div>
                <div className="text-lg font-bold text-green-600">{score}</div>
              </div>
              
              {/* Progress Badge */}
              <div className="bg-blue-50 px-4 py-2 rounded-xl">
                <div className="text-xs text-gray-500">Question</div>
                <div className="text-lg font-bold text-blue-600">
                  {index + 1}/{questionsList.length}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${((index + 1) / questionsList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold mb-4">
              <Zap size={12} />
              Question {index + 1}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            {currentQuestion.options.map((option, idx) => {
              let optionClass = "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 ";
              
              if (showFeedback && selected === option) {
                if (option === currentQuestion.correctAnswer) {
                  optionClass += "bg-green-50 border-green-500 text-green-800 shadow-md";
                } else {
                  optionClass += "bg-red-50 border-red-500 text-red-800";
                }
              } else if (showFeedback && option === currentQuestion.correctAnswer) {
                optionClass += "bg-green-50 border-green-500 text-green-800";
              } else if (selected === option && !showFeedback) {
                optionClass += "bg-green-100 border-green-500 text-green-800 shadow-md";
              } else {
                optionClass += "bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/30 hover:shadow-md";
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={optionClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 ml-3" />
                    )}
                    {showFeedback && selected === option && option !== currentQuestion.correctAnswer && (
                      <XCircle size={20} className="text-red-600 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className={`mb-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} animate-in slide-in-from-top-2 duration-300`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? "Correct! 🎉" : "Incorrect! 📚"}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm mt-1 text-gray-700">
                      Correct answer: <span className="font-semibold">{currentQuestion.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Next/Check Button */}
          <button
            onClick={handleNext}
            disabled={!selected || showFeedback}
            className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2
              ${selected && !showFeedback
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transform hover:scale-[1.02]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {!showFeedback ? (
              <>
                {index + 1 === questionsList.length ? "Finish Quiz" : "Next Question"}
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading next...
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;