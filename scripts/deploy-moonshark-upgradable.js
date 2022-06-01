const { ethers, upgrades } = require('hardhat');

async function main() {
  const MoonSharkNFTUpgradable = await ethers.getContractFactory("MoonSharkNFTUpgradable");

  // https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#deploy-proxy
  const moonSharkNFTUpgradableContract = await upgrades.deployProxy(
    MoonSharkNFTUpgradable, 
    ['ipfs://QmP7cNFhnAqLiCLhQkCJQ9TCSenRb3jkYzvQKoqj7GUCXC/'], 
    { initializer: 'initialize' }
  );

  await moonSharkNFTUpgradableContract.deployed();

  const addresses = {
    proxy: moonSharkNFTUpgradableContract.address,
    admin: await upgrades.erc1967.getAdminAddress(moonSharkNFTUpgradableContract.address), 
    implementation: await upgrades.erc1967.getImplementationAddress(
      moonSharkNFTUpgradableContract.address)
  };

  console.log('Addresses:', addresses);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
