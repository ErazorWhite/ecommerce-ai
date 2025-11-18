import { useApiMode } from '../../contexts/ApiModeContext';
import './ApiModeSwitcher.css';

export const ApiModeSwitcher = () => {
  const { mode, setMode } = useApiMode();

  return (
    <div className="api-mode-switcher">
      <span className="api-mode-label">API Protocol:</span>
      <div className="api-mode-buttons">
        <button
          className={`api-mode-button ${mode === 'REST' ? 'active' : ''}`}
          onClick={() => setMode('REST')}
        >
          REST
        </button>
        <button
          className={`api-mode-button ${mode === 'gRPC' ? 'active' : ''}`}
          onClick={() => setMode('gRPC')}
        >
          gRPC (Connect-Web)
        </button>
      </div>
    </div>
  );
};
