// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../MoonSharkNFTUpgradable.sol";

contract MoonSharkNFTUpgradableV2 is MoonSharkNFTUpgradable {

  function version() pure override virtual external returns( string memory ) {
    return '2';
  }

}
