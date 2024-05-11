import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // for timezone conversion

interface TeamItemProps {
  room: {
    [key: string]: any;
  };
}

const RoomItem = ({ room }: TeamItemProps) => {
  const timeZone = 'America/New_York'; // EST timezone

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
    const date = parseISO(dateStr); // Convert the string to a Date object
    const zonedDate = toZonedTime(date, timeZone); // Convert UTC to Eastern Time
    return formatDistanceToNow(zonedDate, { addSuffix: true }); // 'x time ago' format
  };

  return (
    <TableRow>
      <TableCell className="w-[200px]">
        <div className="font-medium">{room.id}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {room.name}
        </div>
      </TableCell>
      <TableCell>{room.blue.name}</TableCell>
      <TableCell>{room.red.name}</TableCell>
      <TableCell>
        <Badge variant={getBadgeVariant(room.status)}>{room.status}</Badge>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{formatDateToRelative(room.created_at)} </TableCell>
      <TableCell className="text-right"><Link href={`draft.tournoishaq.ca/rooms/${room.id}/spectator`}><Button variant="outline" size={'sm'}>View</Button></Link></TableCell>
    </TableRow>

  );
};

export default RoomItem;
