import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

export default defineConfig(() => {
  const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const ifaceName in interfaces) {
      const iface = interfaces[ifaceName];
      for (const item of iface) {
        if (item.family === 'IPv4' && !item.internal) {
          return item.address; // Returns the IPv4 address
        }
      }
    }
    return 'localhost'; // Fallback
  };

  const localIp = getLocalIp();

  return {
    plugins: [react()],
    define: {
      LOCAL_IP: JSON.stringify(localIp),
    },
  };
});