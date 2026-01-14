
import React, { useRef, useState } from 'react';

interface Props {
  onFileUploaded: (url: string | null) => void;
  fileUrl: string | null;
}

const FileUploader: React.FC<Props> = ({ onFileUploaded, fileUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'video/webm' && !file.name.endsWith('.webm')) {
        alert('Please upload a WebM file.');
        return;
      }

      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setIsUploading(true);
      setStatus('Connecting to high-speed node...');
      
      try {
        /**
         * PRIMARY ATTEMPT: Pomf2 (Lain.la)
         * Known for great WebM support and direct links.
         */
        setStatus('Uploading to Pomf Node (Fastest)...');
        const formData = new FormData();
        formData.append('files[]', file);

        const response = await fetch('https://pomf2.lain.la/upload.php', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Primary node rejected request');

        const result = await response.json();
        if (result.success && result.files && result.files[0]) {
          onFileUploaded(result.files[0].url);
          setStatus('');
          setIsUploading(false);
          return;
        } else {
          throw new Error('Malformed response from primary node');
        }
      } catch (err) {
        console.warn('Primary node failed, attempting fallback...', err);
        setStatus('Node 1 busy. Routing to Node 2 (File.io)...');

        try {
          /**
           * FALLBACK 1: File.io
           * Very reliable CORS support, link expires after 1 download/view.
           */
          const fallbackData = new FormData();
          fallbackData.append('file', file);

          const fallbackResponse = await fetch('https://file.io', {
            method: 'POST',
            body: fallbackData,
          });

          if (!fallbackResponse.ok) throw new Error('Fallback node failed');

          const fallbackResult = await fallbackResponse.json();
          if (fallbackResult.success) {
            onFileUploaded(fallbackResult.link);
          } else {
            throw new Error('Secondary node error');
          }
        } catch (fallbackErr) {
          console.error('All nodes failed:', fallbackErr);
          setStatus('Cloud unreachable. Using local preview.');
          alert('Network Error: All cloud nodes are currently rejecting browser-direct uploads. Your file will work as a LOCAL PREVIEW for this session.');
          onFileUploaded(localUrl);
        }
      } finally {
        setIsUploading(false);
        setStatus('');
      }
    }
  };

  const copyToClipboard = () => {
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const reset = () => {
    onFileUploaded(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-up text-indigo-400"></i>
              Bypass Cloud Limits
            </h2>
            <p className="text-slate-400 text-sm mt-1">Direct hotlinks for high-performance OBS alerts.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded uppercase font-bold tracking-widest">
              CDN Ready
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!fileUrl && !isUploading ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".webm" 
              className="hidden" 
            />
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-rocket text-2xl text-slate-400 group-hover:text-indigo-400"></i>
            </div>
            <p className="text-slate-200 font-bold text-center">Upload WebM Alert</p>
            <p className="text-slate-500 text-xs mt-2 text-center max-w-xs">Direct upload bypasses standard platform size restrictions.</p>
          </div>
        ) : isUploading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-400 rounded-full animate-spin"></div>
               <i className="fa-solid fa-shield-cat text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl"></i>
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-200 font-bold">{status}</p>
              <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-indigo-400 w-1/2 animate-[shimmer_1.5s_infinite]"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex justify-between items-center">
                <span>CDN DIRECT LINK (FOR OBS)</span>
                {fileUrl?.startsWith('blob:') ? (
                   <span className="text-amber-500 flex items-center gap-1">
                     <i className="fa-solid fa-triangle-exclamation"></i> LOCAL MODE
                   </span>
                ) : (
                   <span className="text-indigo-400 flex items-center gap-1">
                     <i className="fa-solid fa-circle-check"></i> GLOBAL CDN ACTIVE
                   </span>
                )}
              </label>
              
              <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <input 
                  type="text" 
                  readOnly 
                  value={fileUrl || ''} 
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm font-mono text-indigo-400/90"
                />
                <button 
                  onClick={copyToClipboard}
                  className={`px-6 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${
                    copySuccess ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  {copySuccess ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black uppercase tracking-widest text-slate-500">Alert Visualizer</label>
               <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat">
                  <video 
                    key={previewUrl || fileUrl}
                    src={previewUrl || fileUrl || ''} 
                    autoPlay 
                    loop 
                    muted 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white border border-white/10 flex items-center gap-2">
                      WEBM PREVIEW
                    </span>
                  </div>
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
