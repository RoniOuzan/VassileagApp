from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
from database import get_all_ligues, update_ligues
from encryption import encrypt, decrypt
import json

ALLOWED_ORIGINS = ["http://localhost:5173"]  # Your React dev server

def handle_get(handler):
    if handler.path == '/':
        ligues = get_all_ligues()
        response = {"type": "ligues_list", "ligues": ligues}
        encrypted_response = encrypt(json.dumps(response))

        handler.send_response(200)
        handler.send_header('Content-Type', 'text/plain')
        add_cors_headers(handler)
        handler.end_headers()
        handler.wfile.write(encrypted_response.encode())
    else:
        handler.send_response(404)
        add_cors_headers(handler)
        handler.end_headers()

def handle_post(handler):
    if handler.path == '/':
        content_length = int(handler.headers.get('Content-Length', 0))
        encrypted_post_data = handler.rfile.read(content_length)

        try:
            decrypted_data = decrypt(encrypted_post_data.decode())
            data = json.loads(decrypted_data)
        except Exception:
            handler.send_response(400)
            add_cors_headers(handler)
            handler.end_headers()
            return

        print(data)
        # Handle different types of requests:
        msg_type = data.get("type")
        if msg_type == "ping":
            # Respond with a simple pong
            response = {"type": "pong"}
            encrypted_response = encrypt(json.dumps(response))
            handler.send_response(200)
            handler.send_header('Content-Type', 'text/plain')
            add_cors_headers(handler)
            handler.end_headers()
            handler.wfile.write(encrypted_response.encode())
            return
        elif msg_type == "get_ligues":
            ligues = get_all_ligues()
            response = {"type": "ligues_list", "ligues": ligues}
            encrypted_response = encrypt(json.dumps(response))

            print(response)
            handler.send_response(200)
            handler.send_header('Content-Type', 'text/plain')
            add_cors_headers(handler)
            handler.end_headers()
            handler.wfile.write(encrypted_response.encode())
            return
        elif msg_type == "update_ligues":
            if "ligues" not in data:
                handler.send_response(400)
                add_cors_headers(handler)
                handler.end_headers()
                return

            update_ligues(data["ligues"])

            response = {"type": "success", "message": "Ligues list updated"}
            encrypted_response = encrypt(json.dumps(response))

            handler.send_response(200)
            handler.send_header('Content-Type', 'text/plain')
            add_cors_headers(handler)
            handler.end_headers()
            handler.wfile.write(encrypted_response.encode())
            return
        else:
            # Unknown type
            handler.send_response(400)
            add_cors_headers(handler)
            handler.end_headers()
            return
    else:
        handler.send_response(404)
        add_cors_headers(handler)
        handler.end_headers()

        handler.send_response(404)
        add_cors_headers(handler)
        handler.end_headers()

def add_cors_headers(handler):
    origin = handler.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        handler.send_header('Access-Control-Allow-Origin', origin)
    else:
        handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type')

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    pass

def run_server(host='localhost', port=3339):
    class RequestHandler(BaseHTTPRequestHandler):
        def do_OPTIONS(self):
            self.send_response(204)  # No Content
            add_cors_headers(self)
            self.end_headers()

        def do_GET(self):
            handle_get(self)

        def do_POST(self):
            handle_post(self)

        def log_message(self, format, *args):
            return  # suppress default logging

    server = ThreadedHTTPServer((host, port), RequestHandler)
    print(f"Server running on http://{host}:{port}")
    server.serve_forever()
