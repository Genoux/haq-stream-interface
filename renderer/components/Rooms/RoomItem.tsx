import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // for timezone conversion
import OBSConnection from '@/components/Websocket/ConnectionButton';
import { useOBS } from '@/contexts/OBSContext';
interface TeamItemProps {
  room: {
    [key: string]: any;
  };
}

const RoomItem = ({ room }: TeamItemProps) => {
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';
  const timeZone = 'America/New_York'; // EST timezone

  const handleOpenDraftWindow = (roomID) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({id: roomID}).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  function openLinkExternally(url: string) {
    window.ipc.send('open-external-link', url);
  }

  const { connectedTeams, disconnectOBS } = useOBS();

  const isRoomConnected = connectedTeams.length === 2 &&
    connectedTeams.some(team => team.name === room.blue.name) &&
    connectedTeams.some(team => team.name === room.red.name);
  console.log("RoomItem - isRoomConnected:", isRoomConnected);

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
//{`${domain}/room/${room.id}/${room.blue.id}`}
  return (
    <TableRow>
      <TableCell className="w-[150px]">
        <div className="font-medium">{room.id}</div>
        <p className="hidden text-xs text-muted-foreground">
          {room.name}
        </p>
      </TableCell>
      <TableCell className="w-[130px] pl-0"><Button className="px-1" onClick={()=> openLinkExternally(`${domain}/room/${room.id}/${room.blue.id}`)} variant="link">{room.blue.name}</Button><span className="text-white opacity-50 font-normal">({room.blue.id})</span></TableCell>
      <TableCell className="w-[130px] pl-0"><Button className="px-1" onClick={()=> openLinkExternally(`${domain}/room/${room.id}/${room.red.id}`)} variant="link">{room.red.name}</Button><span className="text-white opacity-50 font-normal">({room.red.id})</span></TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateToRelative(room.created_at)}</TableCell>
      <TableCell>
        <Badge className="min-w-[70px] flex justify-center w-fit" variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right py-4">
        <div className="flex gap-2 justify-end">
          {isRoomConnected ? (
            <Button className='min-w-32' size="sm" variant="outline" onClick={disconnectOBS}>Disconnect</Button>
          ) : (
            <OBSConnection className='min-w-32' selectedTeams={[room.blue, room.red]} />
          )}
          <Button onClick={() => handleOpenDraftWindow(room.id)} variant="outline" size={'sm'}>View</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RoomItem;
