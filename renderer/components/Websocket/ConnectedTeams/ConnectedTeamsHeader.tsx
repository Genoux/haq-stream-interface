// app/components/Websocket/ConnectedTeamsHeader.tsx

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import SpinnerCircle from '@/components/common/SpinnerCircle';
import { EyeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { updateObsGameType } from '@/hooks/useObsSceneSetup';
import { useOBS } from '@/contexts/OBSContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type Room = {
  id: string;
  [key: string]: any;
};

interface HeaderProps {
  room: Room;
  inputValue: string;
  handleInputChange: (event: any) => void;
  handleOpenDraftWindow: (roomID: string) => void;
  handleReloadHeroes: () => void;
  isLoading: boolean;
  disconnectOBS: () => void;
}

const DropdownGameType = ({ handleGameTypeChange }) => {
  return (
    <Select onValueChange={(value) => handleGameTypeChange(value)} defaultValue="bo3">
      <SelectTrigger className="w-[120px] h-8">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bo3">
          Best of 3
        </SelectItem>
        <SelectItem value="bo5">
          Best of 5
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

const ConnectedTeamsHeader: React.FC<HeaderProps> = ({
  room, inputValue, handleInputChange, handleOpenDraftWindow, handleReloadHeroes, isLoading, disconnectOBS,
}) => {
  const { obs } = useOBS();

  const handleGameTypeChange = (event: any) => {
    updateObsGameType(obs, event);
  }

  return (
    <div className='flex flex-col gap-6 items-start w-full justify-between border-b pb-4'>
      <div className='flex gap-4'>
        <div className='flex gap-2 items-center'>
          <div className='border border-green-600 rounded-full bg-green-600 bg-opacity-30 p-0.5'>
            <Check size={12} className='text-green-600' />
          </div>
          <h1 className='text-lg font-medium'>Room {room?.id}</h1>
        </div>
        <Badge variant='secondary' className='rounded-full'>{room?.status.capitalize()}</Badge>
      </div>
      <div className='flex gap-1 items-center h-fit justify-start'>
        <DropdownGameType handleGameTypeChange={handleGameTypeChange} />
        <Input className='w-24 h-8 uppercase' placeholder='' onChange={handleInputChange} value={inputValue} />
        <Button className='h-8' onClick={handleReloadHeroes} variant="outline" size={'sm'}>
          {isLoading ? <SpinnerCircle /> : 'Resync'}
        </Button>
        <Button className='h-8' onClick={() => handleOpenDraftWindow(room?.id)} variant="default" size={'sm'}>
          <EyeIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ConnectedTeamsHeader;
