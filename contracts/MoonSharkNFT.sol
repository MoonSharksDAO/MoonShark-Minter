// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract MoonSharkNFT is ERC721A {
  string private ipfsBase;

  constructor(string memory _ipfs) ERC721A("MoonShark", "MOONSHARK") {
    ipfsBase = _ipfs;
  }

  function mint(uint256 quantity) external payable {
    _mint(msg.sender, quantity);
  }

  function _baseURI() override internal view returns (string memory){
    return ipfsBase;
  }

  function setIpfs(string memory _ipfs) external {
    ipfsBase = _ipfs;
  }

}
