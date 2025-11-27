import bcrypt

hashed = b"$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2"
password = b"password"

print(f"Verifying password '{password}' against hash '{hashed}'")
try:
    result = bcrypt.checkpw(password, hashed)
    print(f"Result: {result}")
except Exception as e:
    print(f"Error: {e}")
