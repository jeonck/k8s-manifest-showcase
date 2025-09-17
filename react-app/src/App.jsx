import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

const manifestTypes = ['Deployment', 'Service', 'Pod', 'Ingress', 'ConfigMap', 'Secret', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob', 'PersistentVolume', 'PersistentVolumeClaim', 'ServiceAccount', 'Role', 'RoleBinding', 'ClusterRole', 'ClusterRoleBinding'];

const descriptions = {
  Deployment: '상태 비저장(stateless) 애플리케이션 인스턴스를 관리합니다.',
  Service: '파드 집합에서 실행 중인 애플리케이션을 네트워크 서비스로 노출하는 추상적인 방법을 정의합니다.',
  Pod: '쿠버네티스에서 생성하고 배포할 수 있는 가장 작은 컴퓨팅 단위입니다.',
  Ingress: '클러스터 외부에서 클러스터 내부 서비스로의 HTTP 및 HTTPS 경로를 노출합니다.',
  ConfigMap: '기밀이 아닌 데이터를 키-값 쌍으로 저장하는 데 사용합니다.',
  Secret: '비밀번호, OAuth 토큰, ssh 키와 같은 민감한 정보를 저장하고 관리합니다.',
  StatefulSet: '상태 저장(stateful) 애플리케이션의 배포 및 확장을 관리하며, 파드의 순서와 고유성을 보장합니다.',
  DaemonSet: '모든 (또는 일부) 노드가 파드의 복사본을 실행하도록 보장합니다.',
  Job: '하나 이상의 파드를 생성하고, 지정된 수의 파드가 성공적으로 종료될 때까지 재시도합니다.',
  CronJob: '반복되는 일정에 따라 Job을 생성합니다.',
  PersistentVolume: '관리자가 프로비저닝한 클러스터의 스토리지 조각입니다.',
  PersistentVolumeClaim: '사용자가 스토리지를 요청하는 선언입니다.',
  ServiceAccount: '파드에서 실행되는 프로세스에 대한 ID를 제공합니다.',
  Role: '특정 네임스페이스 내에서 권한 집합을 정의하는 규칙을 포함합니다.',
  RoleBinding: 'Role에 정의된 권한을 사용자 또는 사용자 집합에 부여합니다.',
  ClusterRole: '클러스터 범위의 리소스에 대한 권한을 포함하는 규칙을 정의합니다.',
  ClusterRoleBinding: 'ClusterRole에 정의된 권한을 사용자 또는 사용자 집합에 부여합니다.'
};

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
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {manifestTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setManifestType(type)}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
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
              <div>
                <p className="mb-4 text-gray-300 italic">{descriptions[manifestType]}</p>
                <div className="relative">
                  <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs transition-all z-10"
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                  <pre className="bg-gray-900/70 rounded-lg p-4 overflow-auto text-sm font-mono leading-relaxed">
                    <code>{manifestContent}</code>
                  </pre>
                </div>
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
