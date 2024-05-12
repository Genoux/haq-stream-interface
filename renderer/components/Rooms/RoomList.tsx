import React from 'react';
import RoomItem from './RoomItem';
import { useRooms } from '@/contexts//RoomsContext';

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

  if (rooms.length === 0) return (
    <EmptyBlock title='No rooms' message="There's no room in the database yet." />
  );

  return (
    <>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Number: {rooms.length}</CardTitle>
          <CardDescription>Recent aram draft pick rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table >
            <TableHeader>
              <TableRow >
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead >
                  <div className='flex gap-1 items-center'>
                    <span className='w-2 h-2 rounded-full bg-blue-600'></span>
                    <p>Blue team</p>
                  </div>
                </TableHead>
                <TableHead >
                  <div className='flex gap-1 items-center'>
                    <span className='w-2 h-2 rounded-full bg-red-600'></span>
                    <p>Red team</p>
                  </div>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Spectator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <RoomItem
                  key={room.id}
                  room={room}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </>
  );
};

export default Rooms;
