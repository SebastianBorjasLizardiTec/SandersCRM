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
            key: fs.readFileSync(path.resolve(__dirname, '../../Server/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../../Server/cert.pem')),
        },
    },
    base: './',
});
