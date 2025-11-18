import { createContext, useContext, useState, ReactNode } from 'react';

export type ApiMode = 'REST' | 'gRPC';

interface ApiModeContextType {
  mode: ApiMode;
  setMode: (mode: ApiMode) => void;
}

const ApiModeContext = createContext<ApiModeContextType | undefined>(undefined);

export const ApiModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ApiMode>('REST');

  return (
    <ApiModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ApiModeContext.Provider>
  );
};

export const useApiMode = () => {
  const context = useContext(ApiModeContext);
  if (!context) {
    throw new Error('useApiMode must be used within ApiModeProvider');
  }
  return context;
};
