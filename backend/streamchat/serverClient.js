import { StreamChat } from 'stream-chat';

const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// Lazy initialization - only validate and create client when first accessed
let serverClientInstance = null;

const getServerClient = () => {
  if (!serverClientInstance) {
    // Validate that keys are present in environment only when we actually need them
    if (!apikey || !apiSecret) {
      throw new Error('Stream API key or secret is not defined in environment variables');
    }
    serverClientInstance = new StreamChat(apikey, apiSecret);
  }
  return serverClientInstance;
};

// Create a proxy object that acts like the client but initializes lazily
const serverClient = new Proxy({}, {
  get(target, prop) {
    const client = getServerClient();
    return client[prop];
  },
});

export { serverClient, apikey, apiSecret };
export { getServerClient };
