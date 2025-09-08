from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.marketpet  # nombre de la base de datos
mascotas_collection = db.mascotas
usuarios_collection = db.usuarios

