import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import DraftLayout from './DraftLayout';

const DraftPage = () => {
  const [room, setRoom] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const buttonTimeoutRef = useRef(null);
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_DRAFT;

  useEffect(() => {
    const query = router.query;
    setRoom(query.id as any);
  }, [router]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleMouseEnter = () => {
    setButtonVisible(true);
    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
      setButtonVisible(false);
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: iframeLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <iframe
          src={`${domain}/room/${room}/spectator`}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
        />
      </motion.div>
      {!iframeLoaded && <div className="absolute inset-0 flex justify-center items-center bg-white">Loading content...</div>}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[50px] flex justify-center items-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {buttonVisible && (
            <motion.div
              initial={{opacity: 0, y: 21 }}
              animate={{ opacity: 1, y: -21 }}
              exit={{ opacity: 0, y:21 }}
              transition={{ duration: 0.2, ease: cubicBezier( 0.42, 0, 0.58, 1)}}
            >
              <Button onClick={() => window.electron.closeWindow()}>Close Window</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

DraftPage.getLayout = function getLayout(page: React.ReactNode) {
  return <DraftLayout>{page}</DraftLayout>;
};

export default DraftPage;
