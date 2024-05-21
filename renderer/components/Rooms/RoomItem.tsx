import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from 'date-fns';
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

  const formatDateToRelative = (dateStr) => {
    const date = parseISO(dateStr);
    const zonedDate = toZonedTime(date, timeZone);
    return formatDistanceToNow(zonedDate, { addSuffix: true });
  };

  return (
    <TableRow>
      <TableCell className="w-[200px]">
        <div className="font-medium">{room.id}</div>
        <div className="hidden text-xs text-muted-foreground md:inline">
          {room.name}
        </div>
      </TableCell>
      <TableCell>{room.blue.name}</TableCell>
      <TableCell>{room.red.name}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateToRelative(room.created_at)}</TableCell>
      <TableCell>
        <Badge className="align-middle flex justify-center items-center w-full" variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell>
      </TableCell>
      <TableCell className="text-right flex gap-2 justify-end">
        {isRoomConnected ? (
          <Button size="sm" variant="outline" onClick={disconnectOBS}>Disconnect</Button>
        ) : (
          <OBSConnection selectedTeams={[room.blue, room.red]} />
        )}
        <Button onClick={() => openLinkExternally(`${process.env.NEXT_PUBLIC_SUPABASE_API}/room/${room.id}/spectator`)} variant="outline" size={'sm'}>View</Button>
      </TableCell>
    </TableRow>
  );
};

export default RoomItem;
