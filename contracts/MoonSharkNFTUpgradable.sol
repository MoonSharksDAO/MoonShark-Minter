// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'erc721a-upgradeable/contracts/ERC721AUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract MoonSharkNFTUpgradable is ERC721AUpgradeable, OwnableUpgradeable {
  string private ipfsBase;

  function initialize(string memory _ipfs) initializerERC721A initializer public {
    __ERC721A_init('MoonShark', 'MOONSHARK');
    __Ownable_init();
    ipfsBase = _ipfs;
  }

  function mint(uint256 quantity) external payable {
    _mint(msg.sender, quantity);
  }

  function adminMint(uint256 quantity) external payable onlyOwner {
    _mint(msg.sender, quantity);
  }

  function _baseURI() override internal view returns (string memory){
    return ipfsBase;
  }

  function setIpfs(string memory _ipfs) external {
    ipfsBase = _ipfs;
  }

}
