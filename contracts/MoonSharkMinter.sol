// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IMoonSharkNFT.sol";

contract MoonSharkMinter {
  IMoonSharkNFT public moonSharkNFT;
  uint public MAX_CAP;
  
  constructor(address _moonSharkNFT,uint maxCap) {
    moonSharkNFT = IMoonSharkNFT(_moonSharkNFT);
    MAX_CAP = maxCap;
  }

  function batchMint(uint quantity) external {
    uint supply = moonSharkNFT.totalSupply();
    require(supply+quantity <= MAX_CAP,"MAX_CAP Reached");

    moonSharkNFT.mintTo(quantity,msg.sender);
  }

  function mint() external {
    uint supply = moonSharkNFT.totalSupply();
    require(supply+1 <= MAX_CAP,"MAX_CAP Reached");

    moonSharkNFT.mintTo(1,msg.sender);
  }

}
