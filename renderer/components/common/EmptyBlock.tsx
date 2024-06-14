import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EmptyBlockProps {
  title: string;
  message: string;
  handleRefresh?: () => void;
}

const EmptyBlock = ({ title, message, handleRefresh }: EmptyBlockProps) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className=" top-0 left-0  w-full flex flex-1 items-center justify-center rounded-lg shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className='flex flex-col gap-1'>
        <h3 className="text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
        </div>
        <Button size={'sm'} onClick={handleRefresh}>Refresh</Button>
      </div>
    </motion.div>
  );
};

export default EmptyBlock;