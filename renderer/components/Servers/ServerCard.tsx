import { DollarSign } from "lucide-react"
import { ServerInfo } from "@/data/servers";
import ServerStatusDot from "@/components/common/ServerStatusDot";
import { ExternalLink } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type ServerCardProps = {
  server: ServerInfo;
  
}


export default function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className={`${!server.status ? 'border border-red-600 border-opacity-50 bg-red-600 bg-opacity-5 hover:bg-opacity-10' : 'hover:bg-zinc-800 hover:bg-opacity-15'} transition-all`} >
      <CardHeader className="flex flex-col justify-start items-start pb-2 gap-2">
      <div className="flex justify-between w-full">

        <Badge variant="outline"> {server.type} </Badge>
          <ServerStatusDot serverStatus={server.status} />
        </div>
          
        <CardTitle className="text-sm font-medium hidden">{server.status === true ? 'Online' : 'Offline'}</CardTitle>
        <CardTitle className="text-sm font-medium">{server.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{server.description}</p>
        <Link href={`https://${server.host}`} target="_blank">  <Button className="p-0 text-zinc-500 flex gap-1" variant="link" size="sm" > {server.host} <ExternalLink size={12} /> </Button> </Link>
      </CardContent>
    </Card>
  )
}
