import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, FileText, BarChart3, User, LogOut, 
  ChevronLeft, ChevronRight, Menu, X, Bookmark, 
  MessageSquare 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import ZestLogo from "../../assets/logos/ZestLogo.svg";

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoadingUser(false);
        return;
      }
      
      try {
        setIsLoadingUser(true);
        const response = await api.get("/user/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load user");
        // If token is invalid, clear it and redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.clear();
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call logout API if your backend has one
      if (token) {
        await api.post("/auth/logout").catch(() => {
          // Ignore logout API errors - still clear local data
        });
      }
    } catch (err) {
      // Ignore errors - still need to clear local data
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear any other stored data
      sessionStorage.clear();
      
      // Redirect to login page
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", exact: true },
    { name: "Documents", icon: FileText, path: "/dashboard/documents", exact: false },
    { name: "Favorites", icon: Bookmark, path: "/dashboard/favorites", exact: false },
    { name: "AI Chat", icon: MessageSquare, path: "/dashboard/ai-chat", exact: false },
    { name: "Analytics", icon: BarChart3, path: "/dashboard/analytics", exact: false },
    { name: "Profile", icon: User, path: "/dashboard/profile", exact: false },
  ];

  const isActiveRoute = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  // Get first character of user name
  const getUserFirstChar = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)} 
        className="md:hidden fixed top-5 left-4 z-50 p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Logout</h3>
                <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-amber-800">
                You will need to login again to access your account and documents.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col justify-between z-40 transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[76px]" : "w-[260px]"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-lg md:shadow-none
        `}
      >
        {/* Collapse toggle button - desktop only */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="hidden md:flex absolute -right-3 top-7 w-6 h-6 rounded-full border border-gray-200 bg-white items-center justify-center shadow-md hover:shadow-lg transition-all z-50 hover:bg-gray-50"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo section */}
        <div className={`p-5 flex items-center gap-3 border-b border-gray-100 h-20 ${isCollapsed ? "justify-center" : ""}`}>
          <img src={ZestLogo} alt="Zest AI Logo" className="w-8 h-8 flex-shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-black tracking-tight">ZEST AI</h1>
              <p className="text-[10px] text-gray-400">Learning Suite</p>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item);

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.name : ""}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </div>

        {/* User section with logout button together */}
        <div className="border-t border-gray-100 p-3">
          <div className={`flex items-center gap-2 ${isCollapsed ? "flex-col" : ""}`}>
            {/* Profile button */}
            <button 
              onClick={() => {
                navigate("/dashboard/profile");
                setIsMobileOpen(false);
              }}
              className={`flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 flex-1
                ${isCollapsed ? "justify-center w-full" : ""}
              `}
              disabled={isLoadingUser}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {isLoadingUser ? "..." : getUserFirstChar()}
              </div>
              
              {!isCollapsed && user && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-bold truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              )}

              {!isCollapsed && isLoadingUser && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-bold truncate text-gray-400">Loading...</p>
                </div>
              )}
            </button>

            {/* Logout button - right next to profile */}
            {!isCollapsed ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 flex-shrink-0"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 flex items-center justify-center mt-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;