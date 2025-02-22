// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Agentonic is ERC721URIStorage, Ownable{
    mapping(address => uint256) public reputation_score;
    mapping(address => uint256) public rewards_earned;
    mapping(address => uint256) public percentile;
    mapping(address => BARNNFT[]) public games_of_user;
    mapping(address => string) public AIResponse;
    uint256 public tokenId;
    address[] public all_users;

    event mint(address to, string uri);
    event reward_add(address user, uint256 score);

    struct BARNNFT {
        address owner;
        uint256 reputation_score;
        uint256 ai_rewards;
        string image_asset;
        string doppleganger_asset;
        uint256 tokenId;
    }


    constructor() ERC721("Agentonic", "AGT") Ownable(msg.sender){}


    function safeMint(uint256 rewards_earnedUser, string memory uri, string memory dopplegangeruri,  address to) public {
        reputation_score[to] += 1;
        rewards_earned[to] += rewards_earnedUser;
        tokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit reward_add(to, rewards_earnedUser);
        emit mint(to, uri);
        all_users.push(to);
        BARNNFT memory newBarnnft = BARNNFT(to, reputation_score[to], rewards_earned[to], uri, dopplegangeruri, tokenId);
        games_of_user[to].push(newBarnnft);
    }

    function getAllUsers() public view returns(address[] memory){
        return all_users;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal {
        require(from == address(0), "Err: token transfer is BLOCKED");   
        _beforeTokenTransfer(from, to, firstTokenId, batchSize);  
    }

    function saveResponse(address user, string memory data) public {
        AIResponse[user] = data;
    }

    function getNFTs(address user) public view returns(BARNNFT[] memory){
        return games_of_user[user];
    }


}