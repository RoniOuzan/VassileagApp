import asyncio
import websockets
import json
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["vassileage"]
games_collection = db["games"]
players_collection = db["players"]


async def get_all_games():
    games_cursor = games_collection.find({})
    games = []
    async for game in games_cursor:
        game["_id"] = str(game["_id"])  # Convert ObjectId to string
        games.append(game)
    return games


async def get_all_players():
    players_cursor = players_collection.find({})
    players = []
    async for player in players_cursor:
        player["_id"] = str(player["_id"])
        players.append(player)
    return players


async def update_games(new_games):
    await games_collection.delete_many({})
    if new_games:
        await games_collection.insert_many(new_games)


async def update_players(new_players):
    await players_collection.delete_many({})
    if new_players:
        await players_collection.insert_many(new_players)


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

            if msg_type == "get_games":
                games = await get_all_games()
                response = {
                    "type": "games_list",
                    "games": games
                }
                await websocket.send(json.dumps(response))

            elif msg_type == "update_games":
                await update_games(data.get("games", []))
                print("Updated games list")
                response = {"type": "success", "message": "Games list updated"}
                await websocket.send(json.dumps(response))

            elif msg_type == "get_players":
                players = await get_all_players()
                response = {
                    "type": "players_list",
                    "players": players
                }
                await websocket.send(json.dumps(response))

            elif msg_type == "update_players":
                await update_players(data.get("players", []))
                print("Updated players list")
                response = {"type": "success", "message": "Players list updated"}
                await websocket.send(json.dumps(response))

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
