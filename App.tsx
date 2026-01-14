
import React, { useState } from 'react';
import Header from './components/Header';
import CalculatorCard from './components/CalculatorCard';
import InfoPanel from './components/InfoPanel';
import AIHelper from './components/AIHelper';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  const [targetSizeMB, setTargetSizeMB] = useState<number>(3);
  const [durationSec, setDurationSec] = useState<number>(5);
  const [safetyMargin, setSafetyMargin] = useState<number>(10);
  const [preset, setPreset] = useState<string>('medium');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator & Uploader Section */}
          <div className="lg:col-span-2 space-y-6">
            <CalculatorCard 
              targetSizeMB={targetSizeMB} 
              setTargetSizeMB={setTargetSizeMB}
              durationSec={durationSec}
              setDurationSec={setDurationSec}
              safetyMargin={safetyMargin}
              setSafetyMargin={setSafetyMargin}
              preset={preset}
              setPreset={setPreset}
            />

            <FileUploader 
              onFileUploaded={setUploadedFileUrl} 
              fileUrl={uploadedFileUrl}
            />
            
            <AIHelper 
              targetSizeMB={targetSizeMB} 
              durationSec={durationSec} 
              preset={preset}
            />
          </div>

          {/* Sidebar / Info Section */}
          <div className="lg:col-span-1">
            <InfoPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>
          © {new Date().getFullYear()}{' '}
          <a 
            href="https://bento.me/rabeaz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Rabeaz
          </a>
          . Optimization for the modern creator.
        </p>
      </footer>
    </div>
  );
};

export default App;
