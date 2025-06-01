import asyncio
import websockets
import json
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["vassileage"]
ligues_collection = db["ligues"]


async def get_all_ligues():
    ligues_cursor = ligues_collection.find({})
    ligues = []
    async for ligue in ligues_cursor:
        ligue["_id"] = str(ligue["_id"])
        ligues.append(ligue)
    return ligues

async def update_ligues(new_ligues):
    await ligues_collection.delete_many({})
    if new_ligues:
        await ligues_collection.insert_many(new_ligues)


async def handler(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            print(f"Received message: {message}")

            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print("Invalid JSON received, skipping...")
                continue

            msg_type = data.get("type")

            # Ligues
            if msg_type == "get_ligues":
                ligues = await get_all_ligues()
                response = {
                    "type": "ligues_list",
                    "ligues": ligues
                }

            elif msg_type == "update_ligues":
                await update_ligues(data.get("ligues", []))
                print("Updated ligues list")
                response = {"type": "success", "message": "Ligues list updated"}

            else:
                response = {"type": "error", "message": "Unknown message type"}

            await websocket.send(json.dumps(response))
    except websockets.ConnectionClosed:
        print("Client disconnected")


async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("Server started on ws://localhost:8765")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
