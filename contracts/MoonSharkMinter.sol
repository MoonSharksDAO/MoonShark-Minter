// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IMoonSharkNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MoonSharkMinter is Ownable {
  IMoonSharkNFT public moonSharkNFT;
  mapping(address => WhiteList) public whitelists;
  uint public MAX_CAP;

  struct WhiteList {
    uint maxMintAmount;
    uint mintedAmount;
    address memberAddress;
  }
  
  constructor(address _moonSharkNFT,uint maxCap) {
    moonSharkNFT = IMoonSharkNFT(_moonSharkNFT);
    MAX_CAP = maxCap;
  }

  function mint() external {
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+1 <= MAX_CAP,"MAX_CAP Reached");

    WhiteList storage member = whitelists[msg.sender];

    require(member.mintedAmount+1 <= member.maxMintAmount,"MEMBER WHITELIST CAP REACHED");
    moonSharkNFT.mintTo(1,msg.sender);
    member.mintedAmount += 1;
  }

  function batchMint(uint quantity) external {
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+quantity <= MAX_CAP,"MAX_CAP Reached");

    WhiteList storage member = whitelists[msg.sender];

    require(member.mintedAmount+quantity <= member.maxMintAmount,"MEMBER WHITELIST CAP REACHED");
    moonSharkNFT.mintTo(quantity,msg.sender);
    member.mintedAmount += quantity;
  }


  function addToWhitelist(address member,uint cap) external onlyOwner {
    require(whitelists[msg.sender].memberAddress == address(0),"ALREADY WHITELISTED");

    whitelists[member] = WhiteList({
      maxMintAmount: cap,
      mintedAmount: 0,
      memberAddress: member
    });
  }

  function batchAddToWhitelist(WhiteList[] calldata members) external onlyOwner {
    require(whitelists[msg.sender].memberAddress == address(0),"ALREADY WHITELISTED");

    for(uint i=0; i < members.length; i++){
      whitelists[members[i].memberAddress] = members[i];
    }
  }


  function removeFromWhitelist(address member) external onlyOwner {
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    WhiteList memory emptyWhiteList;
    whitelists[member] = emptyWhiteList;
  }

  function batchRemoveFromWhitelist(address[] calldata members) external onlyOwner {
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    WhiteList memory emptyWhiteList;
    for(uint i=0; i < members.length; i++){
      whitelists[members[i]] = emptyWhiteList;
    }
  }

}
