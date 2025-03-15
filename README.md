# Agentonic

A client built on `ZerePy` that lets you create and command adaptive AI agents with natural language, seamlessly bridging wallets, analyzing DeFi protocols, and launching tokens based on real-time social sentiment and dynamic market conditions.

## Table of Contents

- [Flow Chart and System Design](#system-architecture)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Tech stack](#-tech-stack)
- [Local Installation](#-local-installation)
- [Contributing](#-contributing)
- [License](#-license)

## 📐 System Architecture

<img src="./images/Flowchart.png"/>


## Description 
Agentonic is a client-side application built on ZerePy and powered by Sonic, empowering users to create, configure, and interact with AI agents through simple natural language prompts. Users can bridge assets, manage wallets, assess DeFi risks, and identify high-yield opportunities. Agentonic's native social agent even launches tokens autonomously by monitoring market sentiment through X/Twitter analysis — executing mints and deployments when sentiment scores cross a configurable threshold, ensuring decisions align with optimal market conditions.

## 🎯 Problem Statement

users face significant challenges when navigating complex protocols, analyzing market conditions, and seizing timely opportunities and finding the `alpha` using twitter bots.
The key pain points : 

1. **Customizing AI Agents is Hard**
   - To customize AI Agents on `ZerePy` users need to enter a lot of different things to make the Agent work

2. **Overwhelming Complexity of DeFi Protocols**
    - Understanding and interacting with decentralized exchanges, lending platforms, and on-chain assets requires technical expertise, deep research, and constant vigilance. 
    - Users often need to master multiple tools, manually execute transactions, and stay updated with rapidly shifting protocol dynamics.

3. **Complex and Fragmented User Experience**
   - High barrier to entry with wallet setup requirements
   - Fragmented networks 

4. **Limited Access to Autonomous Tools**
  - Creating autonomous agents that can interact with blockchains, monitor social sentiment, and execute on-chain actions typically requires deep coding skills and infrastructure management. 
  - This barrier prevents non-technical users from leveraging powerful AI-driven strategies.

## 💡 Solution

Agentonic democratizes access to advanced Web3 capabilities through:

1. **Creating customizable Agents using prompts**
   - Users can define agent behavior, set API keys, and load agents in seconds.
   - Agents execute actions without user intervention, adapting their behavior over time.
   - All complex transactions are handled by Account abstraction (ERC2771) for gasless transactions

2. **Smart Market Sentiment based Token Launch using prompts**
    - The social agent monitors X/Twitter through `@aixbt_agent` for analyzing market sentiment and finding alpha, automatically deciding token launch timing based on sentiment analysis.
    - Launches and mints some share to your address if the market conditions looks favorable to the Agent on `Sonic Blaze`

3. **Seamless Sonic Interactions**
    - Effortlessly bridge tokens, query balances, and interact using in-client gateway.

4. **Proof of Ownership of ZerePy Agent**
  - Users can tokenize their Agent created using natural language prompts as a Soul Bound Token with its `Agent.json` stored on IPFS network

## 🔧 Technical Deep Dive

### Architecture Components

1. **Agentonic Client**
   - ZerePy-powered agent orchestration
   - Sonic testnet integration for ultra-fast execution
   - On-chain wallet and asset management
   - Adaptive agent lifecycle management

2. **AI Agents**
   - Cohere Agent with RAG for DeFi insights
   - DWF Labs portfolio tracking for complex Liquidity markets for on-chain transactions and yeild farming
   - Twitter agent for market analysis and token tweeting

3. **Smart Automation**
   - ERC2771 for gasless transactions via account abstraction
   - Sonic testnet smart contracts for token mints and swaps
   - Tokenizing Agents for proof of ownership

### Innovation in DeFi Automation
- Adaptive agent evolution based on real-time data
- Autonomous token launches driven by market sentiment
- Future-proof architecture for DeFi protocol integrations


This architecture enables Agentonic to deliver a decentralized, high-speed, and self-sustaining AI-driven DeFi ecosystem, pushing the boundaries of Web3 automation.
 🚀

## 🛠 Tech Stack

- **Frontend**: Tailwindcss, tauri, framer-motion
- **Backend**: FastAPI, Python, Cohere
- **Blockchain**: Ethers, IPFS, Solidity
- **AI/ML**: Cohere, ZerePy, Groq

## 📦 Local Installation

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/dhananjaypai08/Agentonic.git

# Install dependencies
cd frontend
npm install

# Start development server
npm run tauri dev
```

### Contracts setup
Note: This creates an `artifact` folder for automated token launches
```bash
cd agentonic-contracts
npm install
npx hardhat compile
```


### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your configuration

# Start the server
python3 main.py
```

### ZerePy Client Setup
```bash
# Navigate to backend directory
cd ZerePy

# Install dependencies
poetry run pip install -r requirements.txt  # or poetry install --no-root && poetry install --extras server

# Set up environment variables
cp .env.example .env
# Add your configuration

# Start the server
poetry run python main.py --server
```


## 🤝 Contributing

We welcome contributions to Agentonic! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
