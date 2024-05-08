import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type LayoutContextType = {
  dataComponent: ReactNode;
  setDataComponent: Dispatch<SetStateAction<ReactNode>>;
};

const LayoutContext = createContext<LayoutContextType>({
  dataComponent: null, // initial value
  setDataComponent: () => {} // placeholder function
});

export const LayoutProvider = ({ children }) => {
  const [dataComponent, setDataComponent] = useState<ReactNode>(null);

  return (
    <LayoutContext.Provider value={{ dataComponent, setDataComponent }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
