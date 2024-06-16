// components/Rooms/RoomsRowItem.tsx
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useRooms } from '@/contexts/RoomsContext';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useState } from "react";

type Room = {
  [key: string]: any;
}

interface ItemProps {
  room: Room;
  onSetRoom?: () => void; // Optional prop for setting match
}

const RoomsRowItem = ({ room, onSetRoom }: ItemProps) => {
  const { activeRoom } = useRooms(); // Access setActiveRoom from context
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';
  const timeZone = 'America/New_York'; // EST timezone
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (link: string, itemType: string) => {
    const copy = window.location.href + link;

    try {
      navigator.clipboard
        .writeText(copy)
        .then(() => {
          console.log('Copied to clipboard successfully!');
          setCopiedItem(itemType);
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
          throw new Error('Could not copy text');
        });
    } catch (error) {
      console.error('Error copying text:', error);
    }
    return { message: 'Copied to clipboard' };
  };


  function openLinkExternally(url: string) {
    if (typeof window !== 'undefined' && window.ipc && window.ipc.send) {
      window.ipc.send('open-external-link', url);
    } else {
      console.error('IPC is not available.');
    }
  }

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

  return (
    <TableRow>
      <TableCell className="w-[125px]">
        <ContextMenu onOpenChange={() => setCopiedItem(null)}>
          <ContextMenuTrigger>
            <div className="flex items-center gap-2">
              <Button onClick={() => openLinkExternally(`${domain}/room/${room.id}/spectator`)} variant="link">{room.id}</Button>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => copyToClipboard(`/room/${room.id}/spectator`, 'room')}>
              {copiedItem === 'room' ? 'Copied!' : 'Copy room link'}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </TableCell>
      <TableCell className="w-[200px] pl-0">
        <ContextMenu onOpenChange={() => setCopiedItem(null)}>
          <ContextMenuTrigger>
            <div className="flex items-center gap-2">
              <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.blue.id}`)} variant="link">{room.blue.name}</Button>
              <span className="text-white opacity-50 font-normal">({room.blue.id})</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => copyToClipboard(`/room/${room.id}/${room.blue.id}`, 'blue')}>
              {copiedItem === 'blue' ? 'Copied!' : 'Copy blue team link'}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </TableCell>
      <TableCell className="w-[200px] pl-0">
        <ContextMenu onOpenChange={() => setCopiedItem(null)}>
          <ContextMenuTrigger>
            <div className="flex items-center gap-2">
              <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.red.id}`)} variant="link">{room.red.name}</Button>
              <span className="text-white opacity-50 font-normal">({room.red.id})</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => copyToClipboard(`/room/${room.id}/${room.red.id}`, 'red')}>
              {copiedItem === 'red' ? 'Copied!' : 'Copy red team link'}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </TableCell>
      <TableCell className="w-[150px] text-xs text-muted-foreground">{formatDateToRelative(room.created_at)}</TableCell>
      <TableCell>
        <Badge className="min-w-[70px] flex justify-center w-fit" variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right justify-end py-4 flex gap-1">
        {onSetRoom && <Button onClick={onSetRoom} variant="outline" size='sm'>Set Draft</Button>}
      </TableCell>
    </TableRow>
  );
};

export default RoomsRowItem;
