import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const timeZone = 'America/New_York'; // EST timezone
  window.open('http://localhost:3000/room/1/1', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
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

  return (
    <TableRow>
      <TableCell className="w-[150px]">
        <div className="font-medium">{room.id}</div>
        <p className="hidden text-xs text-muted-foreground">
          {room.name}
        </p>
      </TableCell>
      <TableCell className="w-[130px]">{room.blue.name}</TableCell>
      <TableCell className="w-[130px]">{room.red.name}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateToRelative(room.created_at)}</TableCell>
      <TableCell>
        <Badge className="align-middle flex justify-center items-center w-full" variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right py-4">
        <div className="flex gap-2 justify-end">
          {isRoomConnected ? (
            <Button className='min-w-32' size="sm" variant="outline" onClick={disconnectOBS}>Disconnect</Button>
          ) : (
            <OBSConnection className='min-w-32' selectedTeams={[room.blue, room.red]} />
          )}
          <Button onClick={() => openLinkExternally(`${process.env.NEXT_PUBLIC_SUPABASE_API}/room/${room.id}/spectator`)} variant="outline" size={'sm'}>View</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RoomItem;
