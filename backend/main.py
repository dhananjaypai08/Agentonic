from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, set_key
from createAgent import create_agent
import json
import requests
import os

load_dotenv() 

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
    
    # Add new variable to .env file
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
