// import React, { useState } from 'react';
// import Loading from '@/components/Loading';
// import SelectionList from '@/components/Websocket/SelectionList';
// import OBSConnection from '@/components/Websocket/ConnectionButton';
// import { useOBS } from '@/contexts/OBSContext';
// import { TeamsProvider } from '@/contexts/TeamsContext';
// import ConnectedTeams from '@/components/Websocket/ConnectedTeams/ConnectedTeams';
// import TitleBar from '@/components/common/TitleBar';
// import { motion, AnimatePresence } from 'framer-motion';

// const WebsocketPage = () => {
//   const [selectedTeams, setSelectedTeams] = useState([]);
//   const { obs, loading } = useOBS();

//   return (
//     <TeamsProvider>
//       <section className='flex flex-col'>
//         {obs ? (
//           <ConnectedTeams />
//         ) : (
//           <>
//             <TitleBar title='Teams' > <OBSConnection selectedTeams={selectedTeams} /> </TitleBar>
//             {loading &&
//               <AnimatePresence>
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                   className='absolute top-0 left-0 w-full h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
//                   <Loading text='Connecting...' />
//                 </motion.div>
//               </AnimatePresence>
//             }
//             <div className='flex flex-col gap-4' >
//               <SelectionList selectedTeams={selectedTeams} onSelectedTeamsChange={setSelectedTeams} />
//             </div>
//           </>
//         )}
//       </section>
//     </TeamsProvider>
//   );
// };

// export default WebsocketPage;
