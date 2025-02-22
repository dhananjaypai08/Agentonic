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
                    - Format response as a clean, informative JSON object
                    - Don't give 'None' or 'N/A' as a response for anything, if you don't have the data, just search the internet and give the latest data for it and don't ever give `None` as a response for any field
                    - Only give the JSON response, don't give any other text or explanation
                    - Within the prompt, you can find the intent of the user to create an agent and slot fill the JSON structure accordingly based on the prompt and intent
                    - Only change the name, description, bio, traits, examples, and actions to be either from these : "- get_address: Get the address of the wallet
  Parameters:
- get_chain: Get the chain of the wallet
  Parameters:
- get_balance: Get the balance of the wallet
  Parameters:
    - address (required): Parameter address
- get_coin_price: Get the price of a specific coin from CoinGecko
  Parameters:
    - coin_id (required): The ID of the coin on CoinGecko (e.g., 'bitcoin', 'ethereum')
    - vs_currency (required): The target currency to get price in (e.g., 'usd', 'eur', 'jpy')
    - include_market_cap (required): Include market cap data in the response
    - include_24hr_vol (required): Include 24 hour volume data in the response
    - include_24hr_change (required): Include 24 hour price change data in the response
    - include_last_updated_at (required): Include last updated timestamp in the response
- get_trending_coins: Get the list of trending coins from CoinGecko
  Parameters:
    - limit (optional): The number of trending coins to return. Defaults to all coins.
    - include_platform (optional): Include platform contract addresses (e.g., ETH, BSC) in response
- search_coins: Search for coins on CoinGecko
  Parameters:
    - query (required): The search query to find coins (e.g., 'bitcoin' or 'btc')
    - exact_match (required): Only return exact matches for the search query
- approve: Approve an amount of an ERC20 token to an address
  Parameters:
    - tokenAddress (required): The address of the token to get the balance of
    - spender (required): The address to approve the allowance to
    - amount (required): The amount of tokens to approve in base units
- convert_from_base_unit: Convert an amount of an ERC20 token from its base unit to its decimal unit
  Parameters:
    - amount (required): The amount of tokens to convert from base units to decimal units
    - decimals (required): The number of decimals of the token
- convert_to_base_unit: Convert an amount of an ERC20 token to its base unit
  Parameters:
    - amount (required): The amount of tokens to convert from decimal units to base units
    - decimals (required): The number of decimals of the token
- get_token_allowance: Get the allowance of an ERC20 token
  Parameters:
    - tokenAddress (required): The address of the token to get the balance of
    - owner (required): The address to check the allowance of
    - spender (required): The address to check the allowance for
- get_token_balance: Get the balance of an ERC20 token in base units. Convert to decimal units before returning.
  Parameters:
    - wallet (required): The address to get the balance of
    - tokenAddress (required): The address of the token to get the balance of
- get_token_info_by_symbol: Get the ERC20 token info by its symbol, including the contract address, decimals, and name
  Parameters:
    - symbol (required): The symbol of the token to get the info of
- get_token_total_supply: Get the total supply of an ERC20 token
  Parameters:
    - tokenAddress (required): The address of the token to get the balance of
- transfer: Transfer an amount of an ERC20 token to an address
  Parameters:
    - tokenAddress (required): The address of the token to get the balance of
    - to (required): The address to transfer the token to
    - amount (required): The amount of tokens to transfer in base units
- transfer_from: Transfer an amount of an ERC20 token from an address to another address
  Parameters:
    - tokenAddress (required): The address of the token to get the balance of
    - from_ (required): The address to transfer the token from
    - to (required): The address to transfer the token to
    - amount (required): The amount of tokens to transfer in base units"
                    
                    Required JSON Structure for reference(You can use this as a reference to create the agent):
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
                        "network": "mainnet"
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