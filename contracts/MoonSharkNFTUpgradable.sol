// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import 'erc721a-upgradeable/contracts/ERC721AUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";


contract MoonSharkNFTUpgradable is ERC721AUpgradeable, AccessControlUpgradeable {
  string private ipfsBase;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  function initialize(string memory _ipfs,address adminAddress) initializerERC721A initializer public {
    __ERC721A_init('MoonShark', 'MOONSHARK');
    __AccessControl_init();
    _grantRole(ADMIN_ROLE, adminAddress);
    ipfsBase = _ipfs;
  }

  function mint(uint256 quantity) onlyRole(MINTER_ROLE) external payable {
    _mint(msg.sender, quantity);
  }

  function mintTo(uint256 quantity,address to) onlyRole(MINTER_ROLE) external payable {
    _mint(to, quantity);
  }

  function _baseURI() override internal view returns (string memory){
    return ipfsBase;
  }

  function setIpfs(string memory _ipfs) onlyRole(ADMIN_ROLE) external {
    ipfsBase = _ipfs;
  }

  function setAdminRole(address adminAddress) onlyRole(ADMIN_ROLE) external {
    _setupRole(ADMIN_ROLE, adminAddress);
  }

  function setMintRole(address mintAddress) onlyRole(ADMIN_ROLE) external {
    _setupRole(MINTER_ROLE, mintAddress);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

    string memory suffix = '.json';
    string memory baseURI = _baseURI();
    return bytes(baseURI).length != 0 ? string(abi.encodePacked(string(abi.encodePacked(baseURI, _toString(tokenId))),suffix))  : '';
  }

  function supportsInterface(bytes4 interfaceId) public pure override(AccessControlUpgradeable,ERC721AUpgradeable) returns (bool) {
    return
      interfaceId == type(IAccessControlUpgradeable).interfaceId ||
      interfaceId == 0x01ffc9a7 || // ERC165 interface ID for ERC165.
      interfaceId == 0x80ac58cd || // ERC165 interface ID for ERC721.
      interfaceId == 0x5b5e139f; // ERC165 interface ID for ERC721Metadata.
  }

  function version() pure virtual external returns( string memory ) {
    return '1';
  }

}
