import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'maps-resolver-proxy',
        configureServer(server) {
          server.middlewares.use('/api/expand-maps-link', async (req, res) => {
            try {
              const urlObj = new URL(req.url || '', 'http://localhost:3000');
              const targetUrl = urlObj.searchParams.get('url');

              if (!targetUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing url parameter' }));
                return;
              }

              // Fetch target URL with redirect follow and User-Agent
              const response = await fetch(targetUrl, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.9,mr;q=0.8',
                },
              });

              const finalUrl = response.url || targetUrl;
              const html = await response.text();

              // 1. Extract Title from HTML or Final Redirected URL
              let extractedTitle = '';

              // Try URL place / search slug extraction first
              if (finalUrl.includes('/maps/place/')) {
                const rawSlug = finalUrl.split('/maps/place/')[1]?.split('/')[0] || '';
                if (rawSlug) {
                  extractedTitle = decodeURIComponent(rawSlug.replace(/\+/g, ' ')).split(',')[0].split('@')[0].trim();
                }
              } else if (finalUrl.includes('/maps/search/')) {
                const rawSlug = finalUrl.split('/maps/search/')[1]?.split('/')[0] || '';
                if (rawSlug) {
                  extractedTitle = decodeURIComponent(rawSlug.replace(/\+/g, ' ')).split(',')[0].split('@')[0].trim();
                }
              }

              // Try <title> tag or meta og:title
              if (!extractedTitle || extractedTitle.toLowerCase().includes('google maps')) {
                const metaTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                                       html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
                if (metaTitleMatch) {
                  extractedTitle = metaTitleMatch[1].replace(/\s*-\s*Google Maps.*/i, '').replace(/\s*·\s*Google Maps.*/i, '').trim();
                }
              }

              if (!extractedTitle || extractedTitle.toLowerCase().includes('google maps')) {
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                if (titleMatch) {
                  let rawTitle = titleMatch[1];
                  rawTitle = rawTitle.replace(/\s*-\s*Google Maps.*/i, '').replace(/\s*-\s*Google Search.*/i, '').replace(/\s*·\s*Google Maps.*/i, '').trim();
                  if (rawTitle && !rawTitle.toLowerCase().includes('google maps')) {
                    extractedTitle = rawTitle;
                  }
                }
              }

              // Clean extractedTitle
              if (extractedTitle) {
                extractedTitle = extractedTitle
                  .replace(/[\@\?\#].*/, '')
                  .replace(/[-|_].*Google Maps.*/i, '')
                  .trim();
              }

              // 2. Extract Phone Number
              let extractedPhone = '';
              const phoneMatch = html.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
              if (phoneMatch) {
                extractedPhone = phoneMatch[1];
              }

              // 3. Extract Address & Category from og:description
              let extractedAddress = '';
              const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                                 html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
              if (descMatch) {
                let rawDesc = descMatch[1];
                // Remove star rating like ★★★★★ or 4.9 (120)
                rawDesc = rawDesc.replace(/★+/g, '').replace(/[\d\.]+\s*\(\d+\)\s*·?/g, '').trim();
                const parts = rawDesc.split('·').map(p => p.trim()).filter(p => p.length > 0);
                if (parts.length > 0) {
                  // Last part or second part is usually full address
                  extractedAddress = parts[parts.length - 1];
                  if (parts.length > 1 && extractedAddress.length < 5) {
                    extractedAddress = parts.join(', ');
                  }
                } else {
                  extractedAddress = rawDesc;
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                title: extractedTitle,
                phone: extractedPhone,
                address: extractedAddress,
                finalUrl,
              }));
            } catch (err: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: err?.message || 'Failed to expand link',
              }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
