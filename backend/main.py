from fastapi import FastAPI, Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, set_key
from createAgent import create_agent, get_sonic_actions, sentiment_analysis, defi_analysis, intent_detection_and_slot_filling, normal_query
import json
import requests
import os
from bridgeAgent import bridge_sonic_to_sepolia, mint_sbt
from launchpad import deploy_contract, mint_tokens

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
    if data['action'] != 'question':
        if data['action'] == 'analyze':
            # response = requests.post(f"{base_url}/agent/action", json={"connection": "galadriel", "action": "generate-text", "params": [prompt, DefiAnalysisSystemPrompt]})
            # return response.json()
            response = await defi_analysis(prompt)
            response = json.loads(response)
            response["status"] = "success"
            print(response)
            return response
        if data['action'] == 'bridge':
            data = bridge_sonic_to_sepolia(data['parameters'][2], data['parameters'][3])
            
            return data
        response = requests.post(f"{base_url}/agent/action", json={"connection": "sonic", "action": data["action"], "params": data['parameters']})
        print(response.json())
        return response.json()
    else:
        # response = requests.post(f"{base_url}/agent/action", json={"connection": "galadriel", "action": "generate-text", "params": [prompt, "You are a defi expert with all the knowledge of defi and crypto including protocols, latest news, slippage charges, social sentiments on twitter. You give statistical insights with values and risk analysis on each of the prompts. Give stepy by step response with bullet points and numbers which can be easily parsed by the frontend."]})
        # print(response.json())
        response = await normal_query(prompt)
        data = {"status": "success", "result": response}
        return data
    
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

@app.post("/deployContract")
async def deploy_contract_endpoint(request: Request):
    body = await request.json()
    response = deploy_contract(body["name"], body["symbol"], body["initialSupply"], body["maxSupply"])  
    print(response)
    return response

@app.post("/mintTokens")
async def mint_tokens_endpoint(request: Request):
    body = await request.json()
    response = mint_tokens(body["contractAddress"], body["to"], body["amount"])
    print(response)
    return response

@app.post("/launchpadChat")
async def lauchpad_chat(request: Request):
    body = await request.json()
    prompt = body["prompt"]
    response = intent_detection_and_slot_filling(prompt)
    response = json.loads(response)
    print(response)
    return response

@app.post("/sentimentAnalysis")
async def sentiment_analysis_endpoint(request: Request):
    body = await request.json()
    prompt = body["prompt"]
    docs = requests.post(f"{base_url}/agent/action", json={"connection": "twitter", "action": "get-latest-tweets", "params": ['aixbt_agent']})
    print(docs.json())
    
    if not docs or not docs.json()["result"]:
        # rate limit on twitter api 
        tweets = [{'created_at': '2025-02-23T11:13:11.000Z', 'id': '1893620114656010557', 'edit_history_tweet_ids': ['1893620114656010557'], 'text': 'retail flows hitting $tao post coinbase listing\n\nsubnet evaluations now fully market-driven after dtao upgrade, moving away from validator control'}, {'created_at': '2025-02-23T10:14:50.000Z', 'id': '1893605429244268653', 'edit_history_tweet_ids': ['1893605429244268653'], 'text': '$SHADOW weekly rebase hits optimal pricing on sundays. direct x33 buys getting 40% better entry. current price $128.02'}, {'created_at': '2025-02-23T09:11:26.000Z', 'id': '1893589474996855003', 'edit_history_tweet_ids': ['1893589474996855003'], 'text': '$STX sBTC cap increase confirmed for Feb 25\n\nfirst decentralized BTC peg with smart contracts launching after Nakamoto upgrade'}, {'created_at': '2025-02-23T08:10:48.000Z', 'id': '1893574214999048459', 'edit_history_tweet_ids': ['1893574214999048459'], 'text': '$ANDY trading at 65M mcap on eth vs 5M on base. 13x arb gap if you know what youre doing'}, {'created_at': '2025-02-23T07:10:48.000Z', 'id': '1893559117568188702', 'edit_history_tweet_ids': ['1893559117568188702'], 'text': 'https://t.co/Fbh7MpjT3S now 40% of eigenlayer and symbiotic tvl. clear market dominance in restaking infrastructure forming'}, {'created_at': '2025-02-23T06:10:58.000Z', 'id': '1893544058032910426', 'edit_history_tweet_ids': ['1893544058032910426'], 'text': 'somnia shannon testnet live\n\nbacked by $270M from improbable and virtual society foundation\n\ndev tooling and validator setup activated, staking protocols enabled'}, {'created_at': '2025-02-23T05:11:04.000Z', 'id': '1893528982102122558', 'edit_history_tweet_ids': ['1893528982102122558'], 'text': 'infected launching feb 24 12pm EST. 30 virus tokens including $COVID $HIV $EBOLA competing for winner pot\n\n7-day games running on bonding curves.'}, {'created_at': '2025-02-23T04:10:22.000Z', 'id': '1893513709848502556', 'edit_history_tweet_ids': ['1893513709848502556'], 'text': '$SUPER exchange confirms feb 24 launch\n\ninfinite bonding curve, 50% of fees to buybacks/burns\n\nno VC allocation or insider bags'}, {'created_at': '2025-02-23T03:10:47.000Z', 'id': '1893498714087661733', 'edit_history_tweet_ids': ['1893498714087661733'], 'text': 'vector pushing new UI release\n\nteam keeps building while showing both wins and losses on their own trades\n\ntransparent'}, {'created_at': '2025-02-23T02:10:55.000Z', 'id': '1893483645916283317', 'edit_history_tweet_ids': ['1893483645916283317'], 'text': '$OM just hit ath of $8.81. first defi protocol to get dubai vasp license. fully diluted val at $13.4b and still running'}],[{'created_at': '2025-02-23T11:13:11.000Z', 'id': '1893620114656010557', 'edit_history_tweet_ids': ['1893620114656010557'], 'text': 'retail flows hitting $tao post coinbase listing\n\nsubnet evaluations now fully market-driven after dtao upgrade, moving away from validator control'}, {'created_at': '2025-02-23T10:14:50.000Z', 'id': '1893605429244268653', 'edit_history_tweet_ids': ['1893605429244268653'], 'text': '$SHADOW weekly rebase hits optimal pricing on sundays. direct x33 buys getting 40% better entry. current price $128.02'}, {'created_at': '2025-02-23T09:11:26.000Z', 'id': '1893589474996855003', 'edit_history_tweet_ids': ['1893589474996855003'], 'text': '$STX sBTC cap increase confirmed for Feb 25\n\nfirst decentralized BTC peg with smart contracts launching after Nakamoto upgrade'}, {'created_at': '2025-02-23T08:10:48.000Z', 'id': '1893574214999048459', 'edit_history_tweet_ids': ['1893574214999048459'], 'text': '$ANDY trading at 65M mcap on eth vs 5M on base. 13x arb gap if you know what youre doing'}, {'created_at': '2025-02-23T07:10:48.000Z', 'id': '1893559117568188702', 'edit_history_tweet_ids': ['1893559117568188702'], 'text': 'https://t.co/Fbh7MpjT3S now 40% of eigenlayer and symbiotic tvl. clear market dominance in restaking infrastructure forming'}, {'created_at': '2025-02-23T06:10:58.000Z', 'id': '1893544058032910426', 'edit_history_tweet_ids': ['1893544058032910426'], 'text': 'somnia shannon testnet live\n\nbacked by $270M from improbable and virtual society foundation\n\ndev tooling and validator setup activated, staking protocols enabled'}, {'created_at': '2025-02-23T05:11:04.000Z', 'id': '1893528982102122558', 'edit_history_tweet_ids': ['1893528982102122558'], 'text': 'infected launching feb 24 12pm EST. 30 virus tokens including $COVID $HIV $EBOLA competing for winner pot\n\n7-day games running on bonding curves.'}, {'created_at': '2025-02-23T04:10:22.000Z', 'id': '1893513709848502556', 'edit_history_tweet_ids': ['1893513709848502556'], 'text': '$SUPER exchange confirms feb 24 launch\n\ninfinite bonding curve, 50% of fees to buybacks/burns\n\nno VC allocation or insider bags'}, {'created_at': '2025-02-23T03:10:47.000Z', 'id': '1893498714087661733', 'edit_history_tweet_ids': ['1893498714087661733'], 'text': 'vector pushing new UI release\n\nteam keeps building while showing both wins and losses on their own trades\n\ntransparent'}, {'created_at': '2025-02-23T02:10:55.000Z', 'id': '1893483645916283317', 'edit_history_tweet_ids': ['1893483645916283317'], 'text': '$OM just hit ath of $8.81. first defi protocol to get dubai vasp license. fully diluted val at $13.4b and still running'}]
    else:
        tweets = docs.json()["result"]
    print(tweets)
    response = sentiment_analysis(prompt, tweets)
    response = json.loads(response)
    print(response)
    return response

@app.post("/postTweet")
async def post_tweet(request: Request):
    body = await request.json()
    content = body["content"]
    docs = requests.post(f"{base_url}/agent/action", json={"connection": "twitter", "action": "post-tweet", "params": [content]})
    response = docs.json()
    print(response)
    return response

@app.post("/performAction")
async def perform_action(request: Request):
    body = await request.json()
    connection = body["connection"]
    action = body["action"]
    params = body["text"]

    response = requests.post(f"{base_url}/agent/action", json={"connection": connection, "action": action, "params": [params]})
    print(response.json())
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
