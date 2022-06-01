const { expect } = require("chai");
const { ethers, upgrades } = require('hardhat');

describe("MoonShark NFT Upgradable - Update", function () {
  let owner;
  let moonSharkNFTUpgradableContract;

  beforeEach(async function () {
    [owner] = await ethers.getSigners()

    const MoonSharkNFTUpgradable = await ethers.getContractFactory("MoonSharkNFTUpgradable");
 
    moonSharkNFTUpgradableContract = await upgrades.deployProxy(
      MoonSharkNFTUpgradable, 
      ['ipfs://QmP7cNFhnAqLiCLhQkCJQ9TCSenRb3jkYzvQKoqj7GUCXC/',owner.address], 
      { initializer: 'initialize' }
    );

    await moonSharkNFTUpgradableContract.deployed();

  });
  
  it("Upgrade : v1 -> v2", async function () {
    const MoonSharkNFTUpgradableV2 = await ethers.getContractFactory('MoonSharkNFTUpgradableV2');
    let addresses;

    let proxy = moonSharkNFTUpgradableContract.address;
    let implementation = await upgrades.erc1967.getImplementationAddress(moonSharkNFTUpgradableContract.address);

    addresses = {
        proxy: moonSharkNFTUpgradableContract.address,
        admin: await upgrades.erc1967.getAdminAddress(moonSharkNFTUpgradableContract.address), 
        implementation: await upgrades.erc1967.getImplementationAddress(moonSharkNFTUpgradableContract.address)
    };

    console.log(await moonSharkNFTUpgradableContract.version());
    console.log(addresses)

    await upgrades.upgradeProxy(proxy, MoonSharkNFTUpgradableV2);


    addresses = {
        proxy: moonSharkNFTUpgradableContract.address,
        admin: await upgrades.erc1967.getAdminAddress(moonSharkNFTUpgradableContract.address), 
        implementation: await upgrades.erc1967.getImplementationAddress(moonSharkNFTUpgradableContract.address)
    };

    console.log(await moonSharkNFTUpgradableContract.version());
    console.log(addresses)

  });

});

