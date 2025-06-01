from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

# Use a fixed 16-byte key (must be 16 bytes exactly)
KEY = b'mysecretkey12345'  # 16 bytes key
IV = b'0123456789abcdef'  # 16 bytes fixed IV

def encrypt(plaintext: str) -> str:
    cipher = AES.new(KEY, AES.MODE_CBC, IV)
    ct_bytes = cipher.encrypt(pad(plaintext.encode(), AES.block_size))
    return base64.b64encode(ct_bytes).decode()

def decrypt(ciphertext: str) -> str:
    ct = base64.b64decode(ciphertext)
    cipher = AES.new(KEY, AES.MODE_CBC, IV)
    pt = unpad(cipher.decrypt(ct), AES.block_size)
    return pt.decode()
