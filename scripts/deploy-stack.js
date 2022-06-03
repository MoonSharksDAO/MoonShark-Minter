const hre = require("hardhat");

async function main() {
  const ipfsBase = "https://moonsharks.mypinata.cloud/ipfs/QmQrWoXpstG2VjjjNacYr92kb7jgaoQynNAcKuvziVcKVf/json/"

  const MoonSharkNFT = await hre.ethers.getContractFactory("MoonSharkNFT");
  const moonSharkNFTContract = await MoonSharkNFT.deploy(ipfsBase);
  await moonSharkNFTContract.deployed();

  const MoonSharkPrivateMinter = await hre.ethers.getContractFactory("MoonSharkPrivateMinter");
  const privateMinterContract = await MoonSharkPrivateMinter.deploy(moonSharkNFTContract.address,1111);
  await privateMinterContract.deployed();

  const MoonSharkPublicMinter = await hre.ethers.getContractFactory("MoonSharkPublicMinter");
  const publicMinterContract = await MoonSharkPublicMinter.deploy(moonSharkNFTContract.address,1111);
  await publicMinterContract.deployed();

  // Grant Public/Private Minter Mint Role
  await moonSharkNFTContract.setMintRole(publicMinterContract.address)
  await moonSharkNFTContract.setMintRole(privateMinterContract.address)

  // Pause Public/Private Minter
  await publicMinterContract.pause()
  await privateMinterContract.pause()

  console.log("moonSharkNFTContract deployed to:", moonSharkNFTContract.address);
  console.log("publicMinterContract deployed to:", publicMinterContract.address);
  console.log("privateMinterContract deployed to:", privateMinterContract.address);
  console.log("Gave Mint Roles to Private/Public Minter & Paused Them");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
