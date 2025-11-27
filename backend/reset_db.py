import asyncio
from database import engine
from sqlmodel import text

async def reset_db():
    async with engine.begin() as conn:
        print("Dropping tables...")
        await conn.execute(text("DROP TABLE IF EXISTS activesession CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS score CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE;"))
        print("Tables dropped.")

if __name__ == "__main__":
    asyncio.run(reset_db())
