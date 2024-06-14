// components/Rooms/RoomsTable.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyBlock from '@/components/common/EmptyBlock';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRooms } from '@/contexts/RoomsContext';
import { Room } from '@/types/global'; // Adjust the path to where you defined the Room type
import SpinnerCircle from '@/components/common/SpinnerCircle';

interface RoomsTableProps {
  children: (filteredRooms: Room[]) => React.ReactNode;
  filterRooms: (rooms: Room[]) => Room[];
}

const RoomsTable: React.FC<RoomsTableProps> = ({ children, filterRooms }) => {
  const { rooms, loading, fetchRooms } = useRooms();
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  const handleRefresh = () => {
    console.log('Refreshing rooms...');
    fetchRooms();
  };

  useEffect(() => {
    setFilteredRooms(filterRooms(rooms));
  }, [rooms, filterRooms]);

  return (
    <div className={`flex flex-col px-3 py-4`} style={{ height: `calc(100vh - 110px)` }}>
      {loading ? (
        <div className='flex flex-col justify-center items-center h-full'>
          <SpinnerCircle />
        </div>
      ) : (
        <>
          {rooms.length === 0 ? (
            <div className='p-4 flex justify-center items-center h-full'>
              <EmptyBlock handleRefresh={handleRefresh} title='No rooms' message="There's no room in the database yet." />
            </div>
          ) : (
            <ScrollArea className='flex-grow h-[100px] relative'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>
                      <div className='flex gap-1 items-center'>
                        <span className='w-2 h-2 rounded-full bg-blue-600'></span>
                        <p>Blue</p>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className='flex gap-1 items-center'>
                        <span className='w-2 h-2 rounded-full bg-red-600'></span>
                        <p>Red</p>
                      </div>
                    </TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'></TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children(filteredRooms)}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </>
      )}

    </div>
  );
};

export default RoomsTable;
