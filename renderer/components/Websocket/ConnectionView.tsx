import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useOBS } from '@/contexts/OBSContext';
import { Input } from '@/components/ui/input';
import SpinnerCircle from '@/components/common/SpinnerCircle';
import { useToast } from "@/components/ui/use-toast"

const ConnectionView = () => {
  const { connectToOBS, loading } = useOBS();
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const handleConnect = async () => {
    const connectionUrl = url || 'ws://localhost:4455';
    const result = await connectToOBS(connectionUrl);

    if (result.error) {
      toast({
        title: "Connection Failed",
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: "Connection Successful",
        description: "You are now connected to OBS.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='z-50 absolute h-screen top-0 left-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    >
      {loading ? (
        <div className="flex gap-2 items-center justify-center h-screen">
          <p className='text-foreground opacity-25 text-xs'>Loading</p>
          <SpinnerCircle />
        </div>
      ) : (
        <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }} className='flex h-full w-full flex-col items-center justify-center gap-2'>
          <div className='flex flex-col items-center justify-center gap-4 text-center h-full w-fit'>
            <h1 className='text-xl font-bold'>Connect to OBS</h1>
            <Input
              placeholder='ws://localhost:4455'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleConnect}>Connect</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConnectionView;
