'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function WarningScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handlePasswordSubmit = () => {
    if (password === 'sagaratharva') {
      setIsAuthenticated(true);
      setShowDialog(false);
      // Show the main app
      const mainApp = document.getElementById('main-app');
      if (mainApp) {
        mainApp.style.display = 'flex';
      }
      // Hide the warning screen
      const warningScreen = document.getElementById('warning-screen');
      if (warningScreen) {
        warningScreen.style.display = 'none';
      }
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <>      <div 
        id="warning-screen"
        className="fixed inset-0 bg-red-950 flex items-center justify-center z-[9999] relative min-h-screen w-full"
      >
        {/* Hidden Access Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="absolute top-4 right-4 w-2 h-2 bg-transparent border-none cursor-pointer opacity-0 hover:opacity-10 transition-opacity"
          aria-label="Access"
        >
          <div className="w-full h-full bg-red-900 rounded-full"></div>
        </button>

        <div className="text-center space-y-8 px-8 max-w-2xl">
          {/* Warning Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
            <Skull className="w-16 h-16 text-red-600 animate-bounce" />
            <Shield className="w-16 h-16 text-red-500 animate-pulse" />
          </div>

          {/* Main Warning */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4 animate-pulse">
              ⚠️ DANGER ⚠️
            </h1>
            
            <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-red-400">
                WEBSITE NOT AVAILABLE
              </h2>
              
              <div className="text-red-300 space-y-3">
                <p className="text-lg font-semibold">
                  🚨 This website is currently HARMFUL to your device! 🚨
                </p>
                
                <div className="text-left space-y-2">
                  <p>• <strong>Malware Detected:</strong> Potential virus threats</p>
                  <p>• <strong>Data Risk:</strong> Personal information may be compromised</p>
                  <p>• <strong>System Damage:</strong> May cause permanent device damage</p>
                  <p>• <strong>Security Breach:</strong> Unauthorized access attempts detected</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
              <p className="text-yellow-300 font-semibold">
                ⚠️ DO NOT PROCEED - CLOSE THIS WINDOW IMMEDIATELY ⚠️
              </p>
              <p className="text-yellow-400 text-sm mt-2">
                Your antivirus software should block this site automatically.
              </p>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                variant="destructive"
                size="lg"
                onClick={() => window.close()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
              >
                🔒 CLOSE WINDOW
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="border-red-500 text-red-400 hover:bg-red-900/20 px-8 py-3"
              >
                ← GO BACK
              </Button>
            </div>
          </div>

          {/* Fake System Messages */}
          <div className="text-left bg-black/50 rounded-lg p-4 font-mono text-sm">
            <div className="text-red-400 space-y-1">
              <p>[SYSTEM] Threat detected: Trojan.Generic.KD.45832</p>
              <p>[SYSTEM] Blocking malicious scripts...</p>
              <p>[SYSTEM] Quarantine initiated...</p>
              <p>[SYSTEM] <span className="animate-pulse">⚠️ IMMEDIATE ACTION REQUIRED ⚠️</span></p>
            </div>
          </div>
        </div>
      </div>      {/* Password Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md z-[10000] bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Access Control</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the access code to continue:
            </p>
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setPassword('');
                }}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePasswordSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Access
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
