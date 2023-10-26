// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextProps {
  loggedAddress: string[];
  clearLoggedAddress: () => void; // 新增的方法
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedAddress, setLoggedAddress] = useState<string[]>([]);

  //
  const clearLoggedAddress = () => {
    setLoggedAddress([]);
  };

  useEffect(() => {
    const chainId = 'coreum-testnet-1';

    // Uncomment the line below once the Keplr extension is properly configured
    // await window.keplr.enable(chainId);
    if (window.keplr) {
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      offlineSigner.getAccounts().then((response: any) => {
        setLoggedAddress(response.map((x: { address: string }) => x.address));
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedAddress, clearLoggedAddress }}>
      {children}
    </AuthContext.Provider>
  );
};
