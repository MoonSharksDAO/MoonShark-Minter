// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "erc721a/contracts/ERC721A.sol";

contract MoonSharkNFT is ERC721A,AccessControl {
  string private ipfsBase;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");


  constructor(string memory _ipfs) ERC721A("MoonShark", "MOONSHARK") {
    ipfsBase = _ipfs;
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  function mint(uint256 quantity) external payable {
    require(hasRole(MINTER_ROLE, msg.sender), "NOT MINTER");

    _mint(msg.sender, quantity);
  }

  function _baseURI() override internal view returns (string memory){
    return ipfsBase;
  }

  function setIpfs(string memory _ipfs) external {
    require(hasRole(ADMIN_ROLE, msg.sender), "NOT ADMIN");

    ipfsBase = _ipfs;
  }

  function setAdminRole(address adminAddress) external {
    require(hasRole(ADMIN_ROLE, msg.sender), "NOT ADMIN");

    _setupRole(ADMIN_ROLE, adminAddress);
  }

  function setMintRole(address mintAddress) external {
    require(hasRole(ADMIN_ROLE, msg.sender), "NOT ADMIN");

    _setupRole(MINTER_ROLE, mintAddress);
  }

  function supportsInterface(bytes4 interfaceId) public pure override(ERC721A,AccessControl) returns (bool){
        return
            interfaceId == type(IAccessControl).interfaceId || 
            interfaceId == 0x01ffc9a7 || // ERC165 interface ID for ERC165.
            interfaceId == 0x80ac58cd || // ERC165 interface ID for ERC721.
            interfaceId == 0x5b5e139f; // ERC165 interface ID for ERC721Metadata.
  }

}
