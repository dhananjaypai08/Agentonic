import os 
from dotenv import load_dotenv
from eth_account import Account
from web3 import Web3
import requests
import json

base_url = "http://localhost:8000"

load_dotenv()

private_key = os.getenv("PRIVATE_KEY")

SEPOLIA_RPC_URL = os.getenv("SEPOLIA_RPC_URL")
BASE_SEPOLIA_RPC_URL = os.getenv("BASE_SEPOLIA_RPC_URL")

sepolia_web3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))
base_sepolia_web3 = Web3(Web3.HTTPProvider(BASE_SEPOLIA_RPC_URL))

account = Account.from_key(private_key)

def bridge_eth_to_base(amount: int, address: str):
    tx = sepolia_web3.eth.send_transaction({
        "from": account.address,
        "to": address,
        "value": amount
    })
    return tx

def bridge_erc20_to_base(amount: int, address: str, token_address: str):
    tx = base_sepolia_web3.eth.send_transaction({
        "from": account.address,
        "to": address,
        "value": amount
    })
    return tx

def bridge_erc20_to_sepolia(amount: int, address: str):
    tx = {
        'nonce': sepolia_web3.eth.get_transaction_count(account.address),
        'to': account.address,  # Self-transfer to simulate bridging
        'value': Web3.to_wei(1, 'ether'),
        'gas': 21000,
        'gasPrice': sepolia_web3.eth.gas_price,
        'chainId': 11155111,  # Sepolia chain ID
    }

    signed_tx = sepolia_web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = sepolia_web3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return tx_hash
    
def bridge_sonic_to_sepolia(amount: int, address: str):
    tx = bridge_erc20_to_sepolia(amount, address)
    print(f"Transaction sent on Sepolia: {tx.hex()}")
    txh_url = f"https://sepolia.etherscan.io/tx/{tx.hex()}"
    data = requests.post(f"{base_url}/agent/action", json={"connection": "sonic", "action": "transfer", "params": [address, str(amount)]})
    data = data.json()
    print(data)
    data.update({"tx_url": txh_url})
    return data
    



