// a simple title bar where if a children is in the compoenent parent div it add it to the left side of the title bar

import React from 'react';

interface TitleBarProps {
  children?: React.ReactNode;
  title: string;
}

const TitleBar = ({ children, title }: TitleBarProps) => {
  return (
    <div className={`px-4 border-b border-border/40 w-full h-[52px] flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10`}>
              <h1 className='text-xl font-bold'>{title}</h1>
              {children}
      </div>
  );
};

export default TitleBar;