// hooks/useElectron.js
import { useCallback } from 'react';

export const useElectron = () => {
  const openLink = useCallback((url) => {
    if (window.electron) {
      window.electron.openLink(url);
    } else {
      console.log("Not running in an Electron environment or electron.shell is not exposed");
    }
  }, []);

  return { openLink };
};
