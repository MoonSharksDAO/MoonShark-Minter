// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IMoonSharkNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MoonSharkMinter is Ownable {
  IMoonSharkNFT public moonSharkNFT;
  mapping(address => bool) public whitelist;
  uint public MAX_CAP;
  
  constructor(address _moonSharkNFT,uint maxCap) {
    moonSharkNFT = IMoonSharkNFT(_moonSharkNFT);
    MAX_CAP = maxCap;
  }

  function batchMint(uint quantity) external {
    require(whitelist[msg.sender] == true,"NOT IN WHITELIST");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+quantity <= MAX_CAP,"MAX_CAP Reached");

    moonSharkNFT.mintTo(quantity,msg.sender);
  }

  function mint() external {
    require(whitelist[msg.sender] == true,"NOT IN WHITELIST");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+1 <= MAX_CAP,"MAX_CAP Reached");

    moonSharkNFT.mintTo(1,msg.sender);
  }

  function addToWhitelist(address member) external onlyOwner {
    whitelist[member] = true;
  }

  function removeFromWhitelist(address member) external onlyOwner {
    whitelist[member] = false;
  }

  function batchAddToWhitelist(address[] calldata members) external onlyOwner {
    for(uint i=0; i < members.length; i++){
      whitelist[members[i]] = true;
    }
  }

  function batchRemoveFromWhitelist(address[] calldata members) external onlyOwner {
    for(uint i=0; i < members.length; i++){
      whitelist[members[i]] = false;
    }
  }

}
