// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract MoonSharkNFT is ERC721A {
  string private uri;

  constructor(string memory _uri) ERC721A("MoonShark", "MOONSHARK") {
    uri = _uri;
  }

  function mint(uint256 quantity) external payable {
    _mint(msg.sender, quantity);
  }

  function _baseURI() override internal view returns (string memory){
    return uri;
  }

}
