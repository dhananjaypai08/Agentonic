from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, set_key
from createAgent import create_agent, get_sonic_actions, handle_prompt, defi_analysis
import json
import requests
import os
from bridgeAgent import bridge_sonic_to_sepolia, mint_sbt
load_dotenv() 
from createAgent import DefiAnalysisSystemPrompt
app = FastAPI()

origins = [
    "*"
]
allow_credentials = True
allow_methods = ["*"]
allow_headers = ["*"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=allow_credentials, allow_methods=allow_methods, allow_headers=allow_headers)
base_url = "http://localhost:8000"

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/createAgentFile")
async def create_agent_file(request: Request):
    body = await request.json()
    prompt = body["prompt"]
    response = await create_agent(prompt)
    print(response)
    return response 

@app.post("/createAgent")
async def create_config(request: Request):
    body = await request.json()
    config = body["agentConfig"]
    print(config)
    agent_name = config["name"]

    with open(f"../ZerePy/agents/{agent_name}.json", "w") as f:
        json.dump(config, f, indent=4)
    return config

@app.get("/listAgents")
async def list_agents():
    response = requests.get(f"{base_url}/agents")
    return response.json()

@app.get("/loadAgent")
async def load_agent(agent_name: str):
    response = requests.post(f"{base_url}/agents/{agent_name}/load")
    return response.json()

@app.get("/listConnections")
async def list_connections():
    response = requests.get(f"{base_url}/connections")
    return response.json()

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    prompt = body["prompt"]
    if "my" in prompt:
        address = requests.post(f"{base_url}/agent/action", json={"connection": "ethereum", "action": "get-address"})
        address = address.json()
        print(address)
        prompt = prompt.replace("my", address["result"])
    response = await get_sonic_actions(prompt)
    data = json.loads(response)
    print(data)
    if data['action'] != 'other':
        if data['action'] == 'analyze':
            # response = requests.post(f"{base_url}/agent/action", json={"connection": "galadriel", "action": "generate-text", "params": [prompt, DefiAnalysisSystemPrompt]})
            # return response.json()
            response = await defi_analysis(prompt)
            return response.json()
        if data['action'] == 'bridge':
            data = bridge_sonic_to_sepolia(data['parameters'][2], data['parameters'][3])
            
            return data
        response = requests.post(f"{base_url}/agent/action", json={"connection": "sonic", "action": data["action"], "params": data['parameters']})
        print(response.json())
        return response.json()
    else:
        response = requests.post(f"{base_url}/agent/action", json={"connection": "galadriel", "action": "generate-text", "params": [prompt, "You are a defi expert with all the knowledge of defi and crypto including protocols, latest news, slippage charges, social sentiments on twitter. You give statistical insights with values and risk analysis on each of the prompts. Give stepy by step response with bullet points and numbers which can be easily parsed by the frontend."]})
        print(response.json())
        return response.json()
    
@app.post("/mintSbt")
async def handle_sbt(request: Request):
    body = await request.json()
    uri = body["uri"]
    walletAddress = body["walletAddress"]
    response = mint_sbt(uri, walletAddress)
    return response

@app.get("/readAgent")
async def read_agent(agent_name: str):
    with open(f"../ZerePy/agents/{agent_name}.json", "r") as f:
        agent_config = json.load(f)
    return agent_config

@app.post("/performAction")
async def perform_action(request: Request):
    body = await request.json()
    connection = body["connection"]
    action = body["action"]
    params = body["text"]
    response = requests.post(f"{base_url}/agent/action", json={"connection": connection, "action": action, "params": [params]})
    return response.json()

@app.get("/env-vars")
async def get_env_vars():
    env_path = "../ZerePy/.env"
    env_vars = {}
    
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    
    return env_vars

@app.post("/env-vars")
async def add_env_var(request: Request):
    body = await request.json()
    key = body["key"]
    value = body["value"]
    
    env_path = "../ZerePy/.env"
    
    set_key(env_path, key, value)
    
    return {"message": "Environment variable added successfully"}

@app.put("/env-vars")
async def update_env_var(request: Request):
    body = await request.json()
    key = body["key"]
    value = body["value"]
    
    env_path = "../ZerePy/.env"
    
    # Update variable in .env file
    set_key(env_path, key, value)
    
    return {"message": "Environment variable updated successfully"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
