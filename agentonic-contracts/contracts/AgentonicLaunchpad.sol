// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract AgentonicLauchpad is ERC20, Ownable, ERC20Burnable {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event RewardsDistributed(address indexed to, uint256 amount);

    // State variables
    uint256 public INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public MAX_SUPPLY = 10000000 * 10**18;    // 10 million tokens
    mapping(address => bool) public blacklisted;
    
    constructor(string memory name, string memory symbol, uint256 initialSupply, uint256 maxSupply) ERC20(name, symbol) Ownable(msg.sender) {
        INITIAL_SUPPLY = initialSupply;
        MAX_SUPPLY = maxSupply;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // Minting function (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        require(!blacklisted[to], "Address is blacklisted");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Override burn function to add event
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    // Distribute rewards
    function distributeRewards(address to, uint256 amount) public onlyOwner {
        require(!blacklisted[to], "Address is blacklisted");
        require(balanceOf(address(this)) >= amount, "Insufficient balance for rewards");
        _transfer(address(this), to, amount);
        emit RewardsDistributed(to, amount);
    }

    // Blacklist functions
    function addToBlacklist(address account) public onlyOwner {
        blacklisted[account] = true;
    }

    function removeFromBlacklist(address account) public onlyOwner {
        blacklisted[account] = false;
    }

    // Override transfer function to check blacklist
    function _update(address from, address to, uint256 value) internal virtual override {
        require(!blacklisted[from] && !blacklisted[to], "Address is blacklisted");
        super._update(from, to, value);
    }
}