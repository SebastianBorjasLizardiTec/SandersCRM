
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
        https: {
            key: fs.readFileSync('C:/Users/emili/Documents/GitHub/Redes2/SandersCRM/Server/key.pem'),
            cert: fs.readFileSync('C:/Users/emili/Documents/GitHub/Redes2/SandersCRM/Server/cert.pem')
        },
    },
    base: './',
});
