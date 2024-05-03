import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useOBS
  
 } from '@/contexts/OBSContext';
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { disconnectOBS, obs } = useOBS();
  
  return (
    <div>
      {obs && <Button size='sm' onClick={disconnectOBS}> Disconnect</Button>}
      <header>
        <Link href={'/home'}><Button size='sm'> <ArrowLeftIcon /> </Button>  </Link>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;