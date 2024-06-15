import React, { useState } from 'react';
import RoomsRowItem from '@/components/Rooms/RoomsRowItem';
import RoomsTable from '@/components/Rooms/RoomsTable';
import { RoomsProvider } from '@/contexts/RoomsContext';
import TitleBar from '@/components/common/TitleBar';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoomsDropdownFilter = ({ options, onSelect, defaultValue }) => {
  return (
    <Select onValueChange={(value) => onSelect(value)} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option.toLowerCase()}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const RoomsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filterAllRooms = (rooms) => {
    if (selectedStatus === 'all') {
      return rooms;
    }
    return rooms.filter(room => room.status.toLowerCase() === selectedStatus);
  };

  return (
    <RoomsProvider>
      <div className={`flex flex-col relative`}>
        <TitleBar title='Rooms' > 
        <RoomsDropdownFilter 
              options={['all', 'waiting', 'ban', 'select', 'done']}
              onSelect={setSelectedStatus} 
              defaultValue="all"
          />
          </TitleBar>
        <AnimatePresence mode='wait'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
         
            <RoomsTable filterRooms={filterAllRooms}>
              {(filteredRooms) => filteredRooms.map(room => (
                <RoomsRowItem key={room.id} room={room} />
              ))}
            </RoomsTable>
          </motion.div>
        </AnimatePresence>
      </div>
    </RoomsProvider>
  );
};

export default RoomsPage;
