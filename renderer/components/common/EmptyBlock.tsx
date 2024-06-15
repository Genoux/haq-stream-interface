import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface EmptyBlockProps {
  title: string;
  message: string;
  handleRefresh?: () => void;
  className?: string;
}

const EmptyBlock = ({ title, message, handleRefresh, className }: EmptyBlockProps) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('w-full flex flex-col text-center items-center justify-center rounded-lg gap-4', className)}>
      <div className='flex flex-col'>
        <h3 className="text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
      <Button size={'sm'} onClick={handleRefresh}>Refresh</Button>
    </motion.div>
  );
};

export default EmptyBlock;