import socket
import ssl
import threading
import json
from urllib.parse import parse_qs

from database import get_all_leagues, update_leagues
from encryption import encrypt, decrypt

HOST = '0.0.0.0'
PORT = 3339
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://172.20.10.14:5173",
    "http://192.168.1.73:5173"
]

def add_cors_headers(headers, origin):
    if origin in ALLOWED_ORIGINS:
        headers.append(f"Access-Control-Allow-Origin: {origin}")
    else:
        headers.append("Access-Control-Allow-Origin: *")
    headers.extend([
        "Access-Control-Allow-Methods: GET, POST, OPTIONS",
        "Access-Control-Allow-Headers: Content-Type"
    ])

def receive_full_http_message(sock):
    data = b""
    while b"\r\n\r\n" not in data:
        chunk = sock.recv(1024)
        if not chunk:
            break
        data += chunk

    if b"\r\n\r\n" not in data:
        return data.decode(errors="ignore")

    headers_part, rest = data.split(b"\r\n\r\n", 1)
    headers_str = headers_part.decode()
    content_length = 0
    origin = "*"

    for line in headers_str.split("\r\n"):
        if line.lower().startswith("content-length:"):
            content_length = int(line.split(":")[1].strip())
        if line.lower().startswith("origin:"):
            origin = line.split(":", 1)[1].strip()

    body = rest
    while len(body) < content_length:
        chunk = sock.recv(1024)
        if not chunk:
            break
        body += chunk

    return headers_str + "\r\n\r\n" + body.decode(errors="ignore"), origin

def build_response(status_code, headers, body=""):
    reason = {
        200: "OK",
        204: "No Content",
        400: "Bad Request",
        404: "Not Found"
    }.get(status_code, "OK")

    response = [
        f"HTTP/1.1 {status_code} {reason}",
        f"Content-Length: {len(body.encode())}",
        "Content-Type: text/plain"
    ] + headers + ["", body]

    return "\r\n".join(response)

def handle_client(sock, addr):
    try:
        request, origin = receive_full_http_message(sock)
        if not request:
            sock.close()
            return

        lines = request.split("\r\n")
        request_line = lines[0].split()
        if len(request_line) < 3:
            sock.close()
            return

        method, path = request_line[0], request_line[1]
        cors_headers = []
        add_cors_headers(cors_headers, origin)

        if method == "OPTIONS":
            response = build_response(204, cors_headers)

        elif method == "GET" and path == "/":
            leagues = get_all_leagues()
            response_data = {"type": "leagues_list", "leagues": leagues}
            encrypted = encrypt(json.dumps(response_data))
            response = build_response(200, cors_headers, encrypted)

        elif method == "POST" and path == "/":
            body = request.split("\r\n\r\n", 1)[1]
            try:
                decrypted = decrypt(body)
                data = json.loads(decrypted)
            except Exception:
                response = build_response(400, cors_headers)
                sock.sendall(response.encode())
                sock.close()
                return

            msg_type = data.get("type")
            if msg_type == "ping":
                response_data = {"type": "pong"}
                encrypted = encrypt(json.dumps(response_data))
                response = build_response(200, cors_headers, encrypted)

            elif msg_type == "get_leagues":
                leagues = get_all_leagues()
                response_data = {"type": "leagues_list", "leagues": leagues}
                encrypted = encrypt(json.dumps(response_data))
                response = build_response(200, cors_headers, encrypted)

            elif msg_type == "update_leagues":
                if "leagues" not in data:
                    response = build_response(400, cors_headers)
                else:
                    update_leagues(data["leagues"])
                    response_data = {"type": "success", "message": "Leagues list updated"}
                    encrypted = encrypt(json.dumps(response_data))
                    response = build_response(200, cors_headers, encrypted)

            else:
                response = build_response(400, cors_headers)

        else:
            response = build_response(404, cors_headers)

        sock.sendall(response.encode())
    except Exception as e:
        print(f"Error handling client {addr}: {e}")
    finally:
        sock.close()

def run_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen()
    print(f"Raw HTTP socket server running on {HOST}:{PORT}")

    while True:
        client_sock, client_addr = server_socket.accept()
        threading.Thread(target=handle_client, args=(client_sock, client_addr), daemon=True).start()
