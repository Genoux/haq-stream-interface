import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import ConnectionButton from '@/components/Websocket/ConnectionButton';
import { useOBS } from '@/contexts/OBSContext';
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

type Room = {
  [key: string]: any;
}

interface ItemProps {
  room: Room;
  checkedRoom: Room;
  setCheckedRoom: (room: Room) => void;
}

const RoomItem = ({ room, checkedRoom, setCheckedRoom }: ItemProps) => {
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';
  const timeZone = 'America/New_York'; // EST timezone

  const onCheckedChange = () => {
    if (checkedRoom === room) {
      setCheckedRoom(null); // Uncheck if it's already checked
    } else {
      setCheckedRoom(room); // Check the new one
    }
  };

  const handleOpenDraftWindow = (roomID) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({ id: roomID }).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  function openLinkExternally(url: string) {
    window.ipc.send('open-external-link', url);
  }

  const { game, disconnectOBS } = useOBS();
  const isRoomConnected = game && game.teams.length === 2 &&
    game.teams.some(team => team.name === room.blue.name) &&
    game.teams.some(team => team.name === room.red.name);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'waiting':
        return 'outline';
      case 'done':
        return 'default';
      case 'picking':
        return 'secondary';
      case 'ban':
        return 'secondary';
      default:
        return 'default'; // Default badge color for undefined statuses
    }
  };

  const formatDateToRelative = (dateStr: string) => {
    const date = parseISO(dateStr);
    const zonedDate = toZonedTime(date, timeZone);
    if (isToday(zonedDate)) {
      return `Today at ${format(zonedDate, 'HH:mm')}`;
    } else {
      return `${formatDistanceToNow(zonedDate, { addSuffix: true })}`;
    }
  };


  const handleRowClick = (e) => {
    console.log("handleRowClick - e:", e);
    // Ignore click if it's on an interactive element
    if (
      e.target.tagName === 'BUTTON' ||
      e.target.tagName === 'A' ||
      e.target.tagName === 'INPUT'
    ) {
      return;
    }
    if(checkedRoom === room) {
      setCheckedRoom(null);
    } else {
      setCheckedRoom(room);
    }
   
  };

  return (
    <TableRow onClick={handleRowClick} className={` ${checkedRoom === room ? 'bg-zinc-900 bg-opacity-50 hover:bg-zinc-900 hover:bg-opacity-80' : 'bg-transparent'} `}>
      <TableCell className="w-[125px]">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checkedRoom === room}
            onCheckedChange={onCheckedChange}
          />
          <p className="font-medium">{room.id}</p>
        </div>
      </TableCell>
      <TableCell className="w-[200px] pl-0">
        <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.blue.id}`)} variant="link">{room.blue.name}</Button>
        <span className="text-white opacity-50 font-normal">({room.blue.id})</span>
      </TableCell>
      <TableCell className="w-[200px] pl-0">
        <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.red.id}`)} variant="link">{room.red.name}</Button>
        <span className="text-white opacity-50 font-normal">({room.red.id})</span>
      </TableCell>
      <TableCell className="w-[150px] text-xs text-muted-foreground">{formatDateToRelative(room.created_at)}</TableCell>
      <TableCell>
        <Badge className="min-w-[70px] flex justify-center w-fit" variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right py-4">
        <Button onClick={() => handleOpenDraftWindow(room.id)} variant="outline" size={'sm'}>View</Button>
      </TableCell>
    </TableRow>
  );
};

export default RoomItem;
