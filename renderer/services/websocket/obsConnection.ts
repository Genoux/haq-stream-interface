import OBSWebSocket from 'obs-websocket-js';

export const connectOBS = async (url, password) => {
  const obs = new OBSWebSocket();
  try {
    console.log('Attempting to connect to OBS WebSocket...');
    await obs.connect(url, password).then(() => {
      console.log("awaitobs.connect - obs:", obs);
      console.log('Successfully connected to OBS WebSocket');
    }).catch((error) => {
      throw error;
    });
    return obs;
  } catch (error) {
    console.error('Failed to connect to OBS WebSocket:', error);
    throw error;
  }
};

export const disconnectOBS = async (obs) => {
  if (obs) {
    try {
      await obs.disconnect();
      console.log('Successfully disconnected from OBS WebSocket');
    } catch (error) {
      console.error('Failed to disconnect from OBS WebSocket:', error);
    }
  }
};
