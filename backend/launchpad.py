import os 
from dotenv import load_dotenv
from eth_account import Account
from web3 import Web3
import requests
import json

SONIC_RPC_URL = os.getenv("SONIC_RPC_URL")

w3 = Web3(Web3.HTTPProvider(SONIC_RPC_URL))
private_key = os.getenv("PRIVATE_KEY")
account = Account.from_key(private_key)

def compile_contract():
    with open("../agentonic-contracts/contracts/AgentonicLaunchpad.sol", "r") as f:
        contract_source = f.read()
    compiled_sol = w3.eth.compile_source(contract_source)
    contract_id, contract_interface = compiled_sol.popitem()
    return contract_interface["abi"], contract_interface["bytecode"]

def get_contract_interface():
    with open("../agentonic-contracts/artifacts/contracts/AgentonicLaunchpad.sol/AgentonicLauchpad.json", "r") as f:
        contract_interface = json.load(f)
    return contract_interface

def deploy_contract(name: str, symbol: str, initialSupply: int, maxSupply: int):
    contract_interface = get_contract_interface()
    abi = contract_interface["abi"]
    bytecode = contract_interface["bytecode"]
    
    nonce = w3.eth.get_transaction_count(account.address)
    print(nonce)
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    print(contract)
    initialSupply = initialSupply * 10**18
    maxSupply = maxSupply * 10**18
    gas_estimate = contract.constructor(name, symbol, initialSupply, maxSupply).estimate_gas({"from": account.address})
    print(gas_estimate)

    transaction = {
        'nonce': nonce,
        'gas': gas_estimate * 1.4,
        'gasPrice': w3.eth.gas_price,
        'from': account.address,
    }
    try:
        # Deploy contract
        contract_tx = contract.constructor(name, symbol, initialSupply, maxSupply).build_transaction(transaction)
        
        signed_tx = w3.eth.account.sign_transaction(contract_tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = tx_receipt['contractAddress']
        
        print(f"Contract deployed successfully!")
        print(f"Contract address: {contract_address}")
        print(f"Transaction hash: {tx_hash.hex()}")
        
        return contract_address
        
    except Exception as e:
        print(f"Error deploying contract: {str(e)}")
        return None
    
def mint_tokens(contract_address: str, to: str, amount: int):
    abi = get_contract_interface()["abi"]
    contract = w3.eth.contract(address=contract_address, abi=abi)
    nonce = w3.eth.get_transaction_count(account.address)
    amount = amount * 10**18
    gas_estimate = contract.functions.mint(to, amount).estimate_gas({"from": account.address})
    transaction = {
        'nonce': nonce,
        'gas': gas_estimate * 1.4,
        'gasPrice': w3.eth.gas_price,
        'from': account.address,
    }
    try:
        tx = contract.functions.mint(to, amount).build_transaction(transaction)
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)    
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Tokens minted successfully!")
        print(f"Transaction hash: {tx_hash.hex()}")
        return tx_hash.hex()
    except Exception as e:
        print(f"Error minting tokens: {str(e)}")
        return False