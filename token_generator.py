import secrets

def generate_token(length=32):
    """Generate a cryptographically secure token.
    
    Args:
        length (int): Length of the token.
        
    Returns:
        str: Generated token.
    """
    return secrets.token_hex(length)

if __name__ == "__main__":
    token = generate_token()
    print(f"Generated Token: {token}")
