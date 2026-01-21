import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import eslint from 'vite-plugin-eslint';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    base: '/wave-bard-sample-loader/',
    build: {
        chunkSizeWarningLimit: 1024,
    },
    resolve: {
        alias: {
            '@bastl-react': path.resolve(__dirname, '../shared/bastl-react'),
        },
    },
    plugins: [
        react(),
        eslint({
            overrideConfigFile: './eslint.config.js', // Point to eslint.config.js
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
                suppressWarnings: true
            },
            injectRegister: 'auto',
            workbox: {
                disableDevLogs: true,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,wavebard,uf2,mp4,json,jpg}'],
                maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB,
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            },
                        }
                    }
                ]
            },
            includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
            manifest: {
                name: 'Wave Bard Sample Loader',
                short_name: 'Sample Loader',
                description: 'Load your own samples into Bastl Instruments Kastle 2 Wave Bard',
                theme_color: '#272727',
                screenshots: [
                    {
                        src: 'wave-bard-sample-loader.png',
                        sizes: '1200x630',
                        type: 'image/png',
                        form_factor: 'wide',
                        label: 'Wave Bard Sample Loader',
                        platform: 'web'
                    },
                ],
                icons: [
                    {
                        src: 'icon-192x192.png',
                        sizes: '192x192',
                        purpose: 'any',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        purpose: 'any',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-192x192.png',
                        sizes: '192x192',
                        purpose: 'maskable',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512x512.png',
                        sizes: '512x512',
                        purpose: 'maskable',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});
