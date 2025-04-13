/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>;
  };
}
