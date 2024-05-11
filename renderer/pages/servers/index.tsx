import ServerStatusList from "@/components/Servers/ServerStatusList";
import TitleBar from "@/components/common/TitleBar";
const ServerStatusPage = () => {

  return (
    <div className="w-full">
      <TitleBar title='Servers' />
      <div className="px-2 py-4">
        <ServerStatusList />
      </div>
    </div>
  );
};

export default ServerStatusPage;
