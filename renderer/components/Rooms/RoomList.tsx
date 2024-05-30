import React, { useState, useEffect } from 'react';
import RoomItem from './RoomItem';
import { useRooms } from '@/contexts/RoomsContext';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import EmptyBlock from '@/components/common/EmptyBlock';
import { ScrollArea } from "@/components/ui/scroll-area"
import DropdownFilter from '@/components/common/DropdownFilter';

const Rooms = () => {
  const { rooms } = useRooms();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all'); // Initialize selectedStatus with 'all'

  useEffect(() => {
    setFilteredRooms(filterRoomsByStatus(selectedStatus)); // Filter rooms when rooms or selectedStatus change
  }, [rooms, selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const sortedRooms = [...rooms].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filterRoomsByStatus = (status: string) => {
    if (status === 'all' || !status) {
      return sortedRooms;
    } else {
      return sortedRooms.filter(room => room.status === status); // Filter rooms by status
    }
  };

  const statusOptions = ['all', ...Array.from(new Set(rooms.map(room => room.status)))];

  return (
    <div className={`flex flex-col px-3.5 py-4`} style={{ height: `calc(100vh - 52px)` }}>
      {rooms.length === 0 && (
        <EmptyBlock title='No rooms' message="There's no room in the database yet." />
      )}
      <Card className="flex flex-col flex-grow pr-2 py-4 rounded-sm">
        <CardHeader>
          <div className='flex w-full justify-between items-center'>
            <div>
              <CardTitle>Rooms: {rooms.length}</CardTitle>
              <CardDescription>Recent aram draft pick rooms</CardDescription>
            </div>
            <DropdownFilter options={statusOptions} onSelect={handleStatusFilter} defaultValue="all" />
          </div>
        </CardHeader>
        <ScrollArea className='flex-grow h-[100px]' >
          <CardContent className="flex-grow flex flex-col  px-4 py-0">
            <Table>
              <TableHeader>
                <TableRow >
                  <TableHead>ID</TableHead>
                  <TableHead >
                    <div className='flex gap-1 items-center'>
                      <span className='w-2 h-2 rounded-full bg-blue-600'></span>
                      <p>Blue</p>
                    </div>
                  </TableHead>
                  <TableHead >
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
                {filteredRooms.map((room) => (
                  <RoomItem
                    key={room.id}
                    room={room}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Rooms;
