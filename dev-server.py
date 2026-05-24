"""Tiny dev server that disables caching so iteration always shows fresh code."""
import http.server
import os
import socketserver
import sys

PORT = int(os.environ.get('PORT') or (sys.argv[1] if len(sys.argv) > 1 else 3000))

# Always serve from this script's directory (core-app/)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        pass  # quiet

with socketserver.TCPServer(('127.0.0.1', PORT), NoCacheHandler) as httpd:
    print(f'Serving on http://127.0.0.1:{PORT}')
    httpd.serve_forever()
