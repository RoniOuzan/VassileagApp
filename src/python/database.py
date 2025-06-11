from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["vassileage"]
leagues_collection = db["leagues"]

def get_all_leagues():
    leagues = list(leagues_collection.find({}))
    for league in leagues:
        league["_id"] = str(league["_id"])
    return leagues

def update_leagues(new_leagues):
    leagues_collection.delete_many({})
    if new_leagues:
        leagues_collection.insert_many(new_leagues)
