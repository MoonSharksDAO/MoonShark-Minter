// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IMoonSharkNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract MoonSharkPrivateMinter is Ownable,Pausable {
  IMoonSharkNFT public moonSharkNFT;
  mapping(address => WhiteList) public whitelists;

  uint public MAX_CAP;
  uint public constant MAX_MINT_AMOUNT = 5;
  uint public constant SINGLE_MINT_FEE = 0.05 ether;

  struct WhiteList {
    uint mintedAmount;
    address memberAddress;
  }
  
  constructor(address _moonSharkNFT,uint maxCap) {
    moonSharkNFT = IMoonSharkNFT(_moonSharkNFT);
    MAX_CAP = maxCap;
  }

  function mint() external payable whenNotPaused() {
    require(msg.value == SINGLE_MINT_FEE,"FEE ISN'T CORRECT");
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+1 <= MAX_CAP,"MAX_CAP REACHED");

    WhiteList storage member = whitelists[msg.sender];

    require(member.mintedAmount+1 <= MAX_MINT_AMOUNT,"MEMBER WHITELIST CAP REACHED");
    moonSharkNFT.mintTo(1,msg.sender);
    member.mintedAmount += 1;
  }

  function batchMint(uint quantity) external payable whenNotPaused() {
    require(msg.value == SINGLE_MINT_FEE*quantity,"FEE ISN'T CORRECT");
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    WhiteList storage member = whitelists[msg.sender];
    require(member.mintedAmount+quantity <= MAX_MINT_AMOUNT,"MEMBER WHITELIST CAP REACHED");

    uint supply = moonSharkNFT.totalSupply();
    require(supply+quantity <= MAX_CAP,"MAX_CAP REACHED");

    moonSharkNFT.mintTo(quantity,msg.sender);
    member.mintedAmount += quantity;
  }


  function addToWhitelist(address member) external onlyOwner {
    require(whitelists[msg.sender].memberAddress == address(0),"ALREADY WHITELISTED");

    whitelists[member] = WhiteList({
      mintedAmount: 0,
      memberAddress: member
    });
  }

  function batchAddToWhitelist(address[] calldata members) external onlyOwner {
    require(whitelists[msg.sender].memberAddress == address(0),"ALREADY WHITELISTED");

    for(uint i=0; i < members.length; i++){
      whitelists[members[i]] = WhiteList({
        mintedAmount: 0,
        memberAddress: members[i]
      });
    }
  }


  function removeFromWhitelist(address member) external onlyOwner {
    require(whitelists[msg.sender].memberAddress != address(0),"NOT IN WHITELIST");

    WhiteList memory emptyWhiteList;
    whitelists[member] = emptyWhiteList;
  }

  function retrieveFund(address treasury) external onlyOwner whenPaused {
    (bool success, ) = treasury.call{value: address(this).balance }("");
    require(success, "FAILED TO SEND FUND TO TREASURY");
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unPause() external onlyOwner {
    _unpause();
  }

}
