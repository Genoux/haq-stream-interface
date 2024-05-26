import React from 'react';
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

const Rooms = () => {
  const { rooms } = useRooms();
  const sortedRooms = [...rooms].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className='my-4'>

      {rooms.length === 0 && (
        <EmptyBlock title='No rooms' message="There's no room in the database yet." />
      )}

      <Card>
        <CardHeader className="px-7">
          <CardTitle>Number: {rooms.length}</CardTitle>
          <CardDescription>Recent aram draft pick rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table >
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
              {sortedRooms.map((room) => (
                <RoomItem
                  key={room.id}
                  room={room}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default Rooms;
