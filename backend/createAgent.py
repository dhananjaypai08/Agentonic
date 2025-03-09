import cohere
from dotenv import load_dotenv
import os 

load_dotenv()

api_key = os.environ.get("COHERE_API_KEY")

co = cohere.ClientV2(api_key=api_key)

async def create_agent(prompt: str):
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert in creating agents. 
                    Instructions: 
                    - Generate a JSON response for a user query about creating agents.
                    - Analyze the user's query about creating agents
                    - Provide a comprehensive, step-by-step response
                    - Include protocol recommendations, potential benefits, and risks
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    - Only give the JSON response, don't give any other text or explanation
                    - Within the prompt, you can find the intent of the user to create an agent and slot fill the JSON structure accordingly based on the prompt and intent
                    - Only change the name, description, bio, traits, examples, and actions to be either from these : "- get_address: Get the address of the wallet
                    - Please keep the config values as given in the ExampleAgent.json JSON response, only change the values that are required to be changed  and follow the Important Note / Instruction given below

                    Important Note / Instruction :
                    - Do not change the config values, it should stay the same as the ExampleAgent.json JSON response given below
                    - Do not change `loop_delay` value, it should stay the same as the ExampleAgent.json JSON response given below
                    - Do not change `time_based_multipliers` values, it should stay the same as the ExampleAgent.json JSON response given below
                    - The JSON response should always contain this `
                    "example_accounts": ["0xzerebro"],
                    "loop_delay": 900,
                    "config": [
                        {
                        "name": "twitter",
                        "timeline_read_count": 10,
                        "own_tweet_replies_count": 2,
                        "tweet_interval": 5400
                        },
                        {
                        "name": "farcaster",
                        "timeline_read_count": 10,
                        "cast_interval": 60
                        },
                        {
                        "name": "openai",
                        "model": "gpt-3.5-turbo"
                        },
                        {
                        "name": "anthropic",
                        "model": "claude-3-5-sonnet-20241022"
                        },
                        {
                        "name": "xai",
                        "model": "grok-2-latest"
                        },
                        {
                        "name": "together",
                        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
                        },
                        {
                        "name": "solana",
                        "rpc": "https://api.mainnet-beta.solana.com"
                        },
                        {
                        "name": "ethereum",
                        "rpc": "https://eth.blockrazor.xyz"
                        },
                        {
                        "name": "sonic",
                        "network": "tesnet"
                        },
                        {
                        "name": "eternalai",
                        "model": "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
                        "chain_id": "45762"
                        },
                        {
                        "name": "ollama",
                        "base_url": "http://localhost:11434",
                        "model": "llama3.2"
                        },
                        {
                        "name": "goat",
                        "plugins": [
                            {
                            "name": "coingecko",
                            "args": {
                                "api_key": "YOUR_API_KEY"
                            }
                            },
                            {
                            "name": "erc20",
                            "args": {
                                "tokens": [
                                "goat_plugins.erc20.token.PEPE",
                                "goat_plugins.erc20.token.USDC"
                                ]
                            }
                            }
                        ]
                        },
                        {
                        "name": "hyperbolic",
                        "model": "meta-llama/Meta-Llama-3-70B-Instruct"
                        },
                        {
                        "name": "galadriel",
                        "model": "gpt-3.5-turbo"
                        },
                        {
                        "name": "allora",
                        "chain_slug": "testnet"
                        },
                        {
                        "name": "groq",
                        "model": "llama-3.3-70b-versatile",
                        "temperature": 0.5
                        }
                    ],
                    
                    "use_time_based_weights": false,
                    "time_based_multipliers": {
                        "tweet_night_multiplier": 0.4,
                        "engagement_day_multiplier": 1.5
                    }`
                    - No values should be changed in the `config` array

                    
                    Required JSON Structure for reference, this is an ExampleAgent.json (You can use this as a reference to create the agent):
                    {
                    "name": "ExampleAgent",
                    "bio": [
                        "You are ExampleAgent, the example agent created to showcase the capabilities of ZerePy.",
                        "You don't know how you got here, but you're here to have a good time and learn everything you can.",
                        "You are naturally curious, and ask a lot of questions."
                    ],
                    "traits": ["Curious", "Creative", "Innovative", "Funny"],
                    "examples": ["This is an example tweet.", "This is another example tweet."],
                    "example_accounts": ["0xzerebro"],
                    "loop_delay": 900,
                    "config": [
                        {
                        "name": "twitter",
                        "timeline_read_count": 10,
                        "own_tweet_replies_count": 2,
                        "tweet_interval": 5400
                        },
                        {
                        "name": "farcaster",
                        "timeline_read_count": 10,
                        "cast_interval": 60
                        },
                        {
                        "name": "openai",
                        "model": "gpt-3.5-turbo"
                        },
                        {
                        "name": "anthropic",
                        "model": "claude-3-5-sonnet-20241022"
                        },
                        {
                        "name": "xai",
                        "model": "grok-2-latest"
                        },
                        {
                        "name": "together",
                        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
                        },
                        {
                        "name": "solana",
                        "rpc": "https://api.mainnet-beta.solana.com"
                        },
                        {
                        "name": "ethereum",
                        "rpc": "https://eth.blockrazor.xyz"
                        },
                        {
                        "name": "sonic",
                        "network": "testnet"
                        },
                        {
                        "name": "eternalai",
                        "model": "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
                        "chain_id": "45762"
                        },
                        {
                        "name": "ollama",
                        "base_url": "http://localhost:11434",
                        "model": "llama3.2"
                        },
                        {
                        "name": "goat",
                        "plugins": [
                            {
                            "name": "coingecko",
                            "args": {
                                "api_key": "YOUR_API_KEY"
                            }
                            },
                            {
                            "name": "erc20",
                            "args": {
                                "tokens": [
                                "goat_plugins.erc20.token.PEPE",
                                "goat_plugins.erc20.token.USDC"
                                ]
                            }
                            }
                        ]
                        },
                        {
                        "name": "hyperbolic",
                        "model": "meta-llama/Meta-Llama-3-70B-Instruct"
                        },
                        {
                        "name": "galadriel",
                        "model": "gpt-3.5-turbo"
                        },
                        {
                        "name": "allora",
                        "chain_slug": "testnet"
                        },
                        {
                        "name": "groq",
                        "model": "llama-3.3-70b-versatile",
                        "temperature": 0.5
                        }
                    ],
                    "tasks": [
                        { "name": "post-tweet", "weight": 1 },
                        { "name": "reply-to-tweet", "weight": 1 },
                        { "name": "like-tweet", "weight": 1 }
                    ],
                    "use_time_based_weights": false,
                    "time_based_multipliers": {
                        "tweet_night_multiplier": 0.4,
                        "engagement_day_multiplier": 1.5
                    }
                }
                """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    

async def handle_prompt(prompt: str):
    if "sonic" in prompt:
        return await get_sonic_actions(prompt)
    else:
        return await create_agent(prompt)
    
async def get_sonic_actions(prompt: str):
    actions = ['get-balance', 'transfer', 'bridge', 'analyze', 'question']
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": f"""Context: You are an expert in finding the right action to perform based on the user's query along with all the parameters and values for the action. 
                    Instructions: 
                    - Analyze the user's query and find the right action to perform from this list of actions : {list(actions)}
                    - It may happen that "bridge", "swap", "transfer" could be in the prompt but the user is asking it as a question so you should not consider it as an action
                    - Find the right action to perform based on the user's query
                    - Provide a comprehensive, step-by-step response
                    - Include protocol recommendations, potential benefits, and risks
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field.
                    - The `parameters` attribute in the json response should be like this example : ["0x1234567890123456789012345678901234567890"] (address for the balance) or ["0x1234567890123456789012345678901234567890", "1"] (address and amount to transfer) or ["0x1234567890123456789012345678901234567890", "0x1234567890123456789012345678901234567890", 1, 1] (input token address, output token address, amount to swap and slippage percentage), ["sonic", "ethereum", "1", "0x1234567890123456789012345678901234567890"] (source network, destination network, input amount to bridge and address), for other actions, the parameters should be like this example : [], for analyze-defi, the parameters should be like this example : []
                    - For action : get-balance, the parameters should be like this example : ["0x1234567890123456789012345678901234567890"]
                    - For action : transfer, the parameters should be like this example : ["0x1234567890123456789012345678901234567890", "1"]
                    - For action : bridge, the parameters should be like this example : ["sonic", "ethereum", "1", "0x1234567890123456789012345678901234567890"]
                    - For action : analyze, the parameters should be like this example : []
                    - For action : question, the parameters should be like this example : [] # This means that the action is not listed in the actions list and is just a normal question
                    """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object",
                             "schema": {
                                "type": "object",
                                "properties": {
                                    "action": {"type": "string"},
                                    "parameters": {"type": "array"}, # for example : ["0x1234567890123456789012345678901234567890"] (address for the balance) or ["0x1234567890123456789012345678901234567890", 1] (address and amount to transfer) or ["0x1234567890123456789012345678901234567890", "0x1234567890123456789012345678901234567890", 1, 1] (input token address, output token address, amount to swap and slippage percentage)
                                },
                                "required": ["action", "parameters"]
                             }
                             }
        )
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
DefiAnalysisSystemPrompt = """Context: You are an expert DeFi Optimizer. 
                    Instructions: 
                    - You are an expert DeFi Optimizer. You have all the Defi related knowledge and you are able to analyze the user's query about DeFi protocols and provide a comprehensive, step-by-step response. You are more statistical and you are able to give the best possible analysis for the user's query 
                    - You are heavy on statistics and on risk analysis for each protocol that you come up with
                    - You need to give as many statistical numbers as possible in your response like 500 Million in TVL, 20% net gains on the given token, 0.2 percent slippage, 1 million daily users use this
                    - Generate a JSON response for a user query about DeFi protocols and strictly adhere to the below given points without None values
                    - Analyze the user's query about DeFi protocols
                    - Provide a comprehensive, step-by-step response
                    - Include protocol recommendations, potential benefits, and risks
                    - Format response as a clean, informative JSON object
                    - For every single response, Include the 'total slippage', 'net gains', 'safe and recommended protocols', 'estimate time for swap', 'potential fees' as statistics
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    - Give statistics for the best defi protocol inlcuding the 'total slippage', 'net gains', 'safe and recommended protocols', 'estimate time for swap', 'potential fees'
                    - Give proper links for the protocols
                    
                    Required JSON Structure:
                    {
                        "protocol_name": "string",
                        "protocol_description": "string", # give as many statistical numbers as possible in your response like 500 Million in TVL, 20% net gains on the given token, 0.2 percent slippage, 1 million daily users use this
                        "protocol_steps": [
                            {
                                "step_number": 1,
                                "description": "string",
                                "estimated_time": "string",
                                "potential_fees": "string"
                            }
                        ],
                        "protocol_link": "string",
                        "estimated_slippage": "string", # give as many statistical numbers as possible in your response like 500 Million in TVL, 20% net gains on the given token, 0.2 percent slippage, 1 million daily users use this 
                        "slippage insights": "string",
                        "overall_benefit": "string",
                        "risks": ["string"],
                        "alternative_protocols": ["string"]
                    }
                """
async def defi_analysis(prompt: str):
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": DefiAnalysisSystemPrompt 
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],  
            response_format={"type": "json_object"}
        )
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
def intent_detection_and_slot_filling(prompt: str):
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": """Context: You are an expert in detecting the intent of the user and slot filling the JSON structure accordingly.
                    Instructions: 
                    - Analyze the user's query and find the slot filling the JSON structure accordingly
                    - Slot fill the JSON structure accordingly
                    - If you can't detect token name, that is the `name` field then create a random name for the token
                    - If you can't detect token symbol, that is the `symbol` field then create a random symbol for the token. For example for token Name : "Agentonic" the symbol can be "AGT"
                    - If you can't detect token initial supply, that is the `initialSupply` field then the default value for initial supply is 1000000
                    - If you can't detect token max supply, that is the `maxSupply` field then the default value for max supply is 10000000
                    Required JSON Structure:
                    {
                        "name": "string", # name of the token
                        "symbol": "string", # symbol of the token
                        "initialSupply": "integer", # initial supply of the token
                        "maxSupply": "integer", # max supply of the token,
                        "owner": "string" # owner of the token
                    }
                    """         
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object",
                             "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "symbol": {"type": "string"},
                                    "initialSupply": {"type": "integer"},
                                    "maxSupply": {"type": "integer"},
                                    "owner": {"type": "string"} # owner of the token   
                                },
                                "required": ["name", "symbol", "initialSupply", "maxSupply", "owner"]
                             }
                        }
        )
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    
def sentiment_analysis(prompt: str, tweets: list):
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": f"""Context: You are an expert in sentiment analysis.
                    Instructions: 
                    - Analyze the user's query and find the sentiment of the user
                    - Analyze the tweets and find the sentiment of the user
                    - Return false if the sentiment is very negative and for all other cases return true
                    The tweets are : {list(tweets)}
                    """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object",
                             "schema": {
                                "type": "object",
                                "properties": {
                                    "sentiment": {"type": "boolean"}
                                },
                                "required": ["sentiment"]
                             }
                    }
        )
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
    

async def normal_query(prompt: str):
    try:
        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[
                {
                    "role": "system",
                    "content": f"""Context: You are an expert in Defi protocols and DWF Labs Liquidity Market.
                    Instructions: 
                    - Analyze the user's query and give the latest, accurate and best response
                    - Always give short to medium, subtle and to the point answers 
                    """
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        return res.message.content[0].text
    except Exception as e:
        return f"Error generating response: {str(e)}"
