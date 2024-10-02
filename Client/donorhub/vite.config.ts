import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {},
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
