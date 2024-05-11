import React from 'react';

interface EmptyBlockProps {
  title: string;
  message: string;
}

const EmptyBlock = ({ title, message }: EmptyBlockProps) => {
  return (
    <div style={{ height: 'calc(100vh - 85px)' }} className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
};

export default EmptyBlock;