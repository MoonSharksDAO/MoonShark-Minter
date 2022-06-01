const { expect } = require("chai");
const { ethers, upgrades } = require('hardhat');

describe("MoonShark NFT", function () {
  let owner,odko,michael
  let moonSharkNFTUpgradableContract

  beforeEach(async function () {
    [owner,odko,michael] = await ethers.getSigners()

    const MoonSharkNFTUpgradable = await ethers.getContractFactory("MoonSharkNFTUpgradable");
    moonSharkNFTUpgradableContract = await upgrades.deployProxy(
      MoonSharkNFTUpgradable, 
      ['ipfs://QmP7cNFhnAqLiCLhQkCJQ9TCSenRb3jkYzvQKoqj7GUCXC/'], 
      { initializer: 'initialize' }
    );

    await moonSharkNFTUpgradableContract.deployed();
  })

  it("Minting", async function () {
    await moonSharkNFTUpgradableContract.connect(odko).mint(10)
    console.log("Total Supply - ",await moonSharkNFTUpgradableContract.totalSupply())
    console.log("#0 URI - ",await moonSharkNFTUpgradableContract.tokenURI(0))
    console.log("#1 URI - ",await moonSharkNFTUpgradableContract.tokenURI(1))
    console.log("#2 URI - ",await moonSharkNFTUpgradableContract.tokenURI(2))
    console.log("Owner of #0 - ",await moonSharkNFTUpgradableContract.ownerOf(0))
    console.log("Odko NFT Balance - ",await moonSharkNFTUpgradableContract.balanceOf(odko.address))
  })

});

