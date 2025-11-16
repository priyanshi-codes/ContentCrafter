import pkg from 'stream-chat';
const { StreamChat } = pkg;

// Lazy initialization to ensure env vars are loaded first
let _serverClient = null;
let _apikey = null;
let _apiSecret = null;

const initializeStreamChat = () => {
  if (_serverClient) return;
  
  _apikey = process.env.STREAM_API_KEY;
  _apiSecret = process.env.STREAM_API_SECRET;

  if(!_apikey || !_apiSecret) {
    throw new Error('Stream API key or secret is not defined in environment variables');
  }

  _serverClient = new StreamChat(_apikey, _apiSecret);
};

export const getServerClient = () => {
  if (!_serverClient) initializeStreamChat();
  return _serverClient;
};

export const getApikey = () => {
  if (!_apikey) initializeStreamChat();
  return _apikey;
};

export const serverClient = new Proxy({}, {
  get: (target, prop) => {
    const client = getServerClient();
    return client[prop];
  }
});