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
SONIC_RPC_URL = os.getenv("SONIC_RPC_URL")

sepolia_web3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))
base_sepolia_web3 = Web3(Web3.HTTPProvider(BASE_SEPOLIA_RPC_URL))
w3 = Web3(Web3.HTTPProvider(SONIC_RPC_URL))

account = Account.from_key(private_key)
contract_address = os.getenv("CONTRACT_ADDRESS")
with open("../agentonic-contracts/artifacts/contracts/Agentonic.sol/Agentonic.json", "r") as f:
    contract_abi = json.load(f)["abi"]
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

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
    txh_url = f"https://sepolia.etherscan.io/tx/0x{tx.hex()}"
    data = requests.post(f"{base_url}/agent/action", json={"connection": "sonic", "action": "transfer", "params": [address, str(amount)]})
    data = data.json()
    print(data)
    data.update({"tx_url": txh_url})
    return data
    
def mint_sbt(uri: str, walletAddress: str):
    nonce = w3.eth.get_transaction_count(account.address)
    estimated_gas = contract.functions.safeMint(1, uri, uri, walletAddress).estimate_gas({
            "from": account.address
    })
    print("Estimated Gas:", estimated_gas)
        
        # Add a safety buffer to the gas estimate
    gas_limit = int(estimated_gas * 1.3)
    print("Using Gas Limit:", gas_limit)

    tx = contract.functions.safeMint(1, uri, uri, walletAddress).build_transaction({
            "from": account.address,
            "gas": gas_limit,  # Adjust gas based on network
            "gasPrice": w3.eth.gas_price,
            "nonce": nonce,
    })

    # Sign and Send Transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
    print(f"Mint transaction sent! Tx Hash: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction confirmed in block {receipt.blockNumber}")
    return tx_hash.hex()



