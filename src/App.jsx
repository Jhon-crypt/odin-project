import React from 'react';
import './App.css';

function App() {
  // Mock user avatars
  const userAvatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b100?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-blue to-purple-900"></div>
      
      {/* Floating geometric elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-accent-green/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent-purple/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 left-16 w-2 h-2 bg-blue-400/50 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      
      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-between min-h-screen px-8 lg:px-16">
        
        {/* Left side - Main content */}
        <div className="flex-1 max-w-lg space-y-8">
          
          {/* Logo */}
          <div className="mb-12">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-accent-purple rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>

          {/* User avatars */}
          <div className="flex items-center space-x-2 mb-6">
            {userAvatars.map((avatar, index) => (
              <div key={index} className="relative">
                <img
                  src={avatar}
                  alt={`User ${index + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                  style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                />
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-bg"></div>
                )}
              </div>
            ))}
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Sophia, Kamil, Emily and 2,012<br />
              others are already here!
            </h1>
            
            <p className="text-lg text-gray-400 max-w-md">
              But... It looks like you don't have access<br />
              to this workspace.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button className="bg-accent-green text-dark-bg font-semibold px-8 py-3 rounded-full hover:bg-accent-green/90 transition-all duration-300 transform hover:scale-105">
              Access request
            </button>
            
            <div className="text-center">
              <span className="text-gray-500 text-sm">or</span>
            </div>
            
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              Back
            </button>
          </div>
        </div>

        {/* Right side - 3D Orb visualization */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="relative">
            
            {/* Central orb */}
            <div className="w-64 h-64 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-green/20 to-accent-purple/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-emerald-400/30 to-purple-500/30 rounded-full"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-green-300/40 to-violet-400/40 rounded-full"></div>
            </div>

            {/* Rotating rings */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 border-2 rounded-full orb-ring animate-rotate-slow"
                style={{
                  width: `${280 + i * 20}px`,
                  height: `${280 + i * 20}px`,
                  marginTop: `-${140 + i * 10}px`,
                  marginLeft: `-${140 + i * 10}px`,
                  animationDuration: `${20 + i * 5}s`,
                  animationDelay: `${i * 0.5}s`,
                  borderImage: `linear-gradient(45deg, 
                    rgba(180, 244, 129, ${0.3 - i * 0.03}), 
                    rgba(139, 92, 246, ${0.3 - i * 0.03})) 1`,
                  transform: `rotate(${i * 22.5}deg)`,
                }}
              ></div>
            ))}

            {/* Floating elements around the orb */}
            <div className="absolute -top-8 -right-8 w-16 h-4 bg-blue-400/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-12 -left-6 w-12 h-12 bg-purple-500/15 rounded-lg animate-float" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-16 -left-12 w-8 h-8 bg-green-400/25 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-sm text-gray-500 z-10">
        <span>Artificium.app © 2023</span>
        <button className="hover:text-gray-400 transition-colors">
          Privacy Policy
        </button>
      </div>
    </div>
  );
}

export default App;
