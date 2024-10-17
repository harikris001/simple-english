import { createContext, useState } from 'react';

const ToneContext = createContext();

const ToneProvider = ({ children }) => {
  const [tone, setTone] = useState('normal');

  return (
    <ToneContext.Provider value={{ tone, setTone }}>
      {children}
    </ToneContext.Provider>
  );
};

export { ToneProvider, ToneContext };