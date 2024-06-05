import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EmptyBlockProps {
  title: string;
  message: string;
}

const EmptyBlock = ({ title, message }: EmptyBlockProps) => {

  const router = useRouter();

  return (
    <div className=" top-0 left-0  w-full flex flex-1 items-center justify-center rounded-lg shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
        <Button onClick={() => {router.refresh()}}>Refresh</Button>
      </div>
    </div>
  );
};

export default EmptyBlock;