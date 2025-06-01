from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["vassileage"]
ligues_collection = db["ligues"]

def get_all_ligues():
    ligues = list(ligues_collection.find({}))
    for ligue in ligues:
        ligue["_id"] = str(ligue["_id"])
    return ligues

def update_ligues(new_ligues):
    ligues_collection.delete_many({})
    if new_ligues:
        ligues_collection.insert_many(new_ligues)
