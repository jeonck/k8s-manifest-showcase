import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

const manifestTypes = ['Deployment', 'Service', 'Pod', 'Ingress', 'ConfigMap', 'Secret', 'StatefulSet', 'Job'];

function App() {
  const [manifestType, setManifestType] = useState(manifestTypes[0]);
  const [manifestContent, setManifestContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchManifest = async () => {
      if (!manifestType) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/${manifestType.toLowerCase()}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setManifestContent(yaml.dump(data));
      } catch (error) {
        console.error("Failed to fetch manifest:", error);
        setManifestContent('Failed to load manifest.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManifest();
  }, [manifestType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2">🚀 Kubernetes Manifest Showcase</h1>
          <p className="text-lg text-gray-300">Explore common K8s manifest examples</p>
        </header>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-black/20 border-b border-white/10 flex justify-between items-center">
            <div className="flex space-x-2">
              {manifestTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setManifestType(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                    manifestType === type
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 relative">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="relative">
                <button 
                  onClick={handleCopy}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs transition-all"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <pre className="bg-gray-900/70 rounded-lg p-4 overflow-auto text-sm font-mono leading-relaxed">
                  <code>{manifestContent}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Vite & React. Styled with Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
