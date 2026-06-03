import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const handleBackToHome = () => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <div className="text-8xl sm:text-9xl font-bold text-gray-900 tracking-tighter">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button
            onClick={handleBackToHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Home size={16} />
            {isLoggedIn() ? 'Go to Dashboard' : 'Go to Home'}
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-3">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-3">
            {isLoggedIn() ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Dashboard
                </button>
                <span className="text-gray-300 text-xs">•</span>
                <button
                  onClick={() => navigate('/dashboard/documents')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Documents
                </button>
                <span className="text-gray-300 text-xs">•</span>
                <button
                  onClick={() => navigate('/dashboard/favorites')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Favorites
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Home
                </button>
                <span className="text-gray-300 text-xs">•</span>
                <button
                  onClick={() => navigate('/about')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  About
                </button>
                <span className="text-gray-300 text-xs">•</span>
                <button
                  onClick={() => navigate('/contactus')}
                  className="text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Contact
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;