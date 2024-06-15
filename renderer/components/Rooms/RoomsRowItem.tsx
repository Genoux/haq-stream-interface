// components/Rooms/RoomsRowItem.tsx
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useRooms } from '@/contexts/RoomsContext';

type Room = {
  [key: string]: any;
}

interface ItemProps {
  room: Room;
  onSetRoom?: () => void; // Optional prop for setting match
}

const RoomsRowItem = ({ room, onSetRoom }: ItemProps) => {
  const { setActiveRoom } = useRooms(); // Access setActiveRoom from context
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';
  const timeZone = 'America/New_York'; // EST timezone

  const handleOpenDraftWindow = (roomID) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({ id: roomID }).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  function openLinkExternally(url: string) {
    window.ipc.send('open-external-link', url);
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
        <div className="flex items-center gap-2">
        <Button  onClick={() => openLinkExternally(`${domain}/room/${room.id}/spectator`)} variant="link">{room.id}</Button>
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
      <TableCell className="text-right justify-end py-4 flex gap-1">
        <Button onClick={() => handleOpenDraftWindow(room.id)} variant="outline" size={'sm'}>View</Button>
        {onSetRoom && <Button onClick={onSetRoom} variant="outline" size='sm'>Set Draft</Button>}
      </TableCell>
    </TableRow>
  );
};

export default RoomsRowItem;
