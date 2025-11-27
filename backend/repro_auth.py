from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"
password = "password"

print(f"Verifying password '{password}' against hash '{hashed}'")
try:
    result = pwd_context.verify(password, hashed)
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")

# Test with swapped arguments just in case
print(f"Verifying hash against password (swapped)")
try:
    result = pwd_context.verify(hashed, password)
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")
