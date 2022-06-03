const hre = require("hardhat");

async function main() {
  const ipfsBase = "https://moonsharks.mypinata.cloud/ipfs/QmQrWoXpstG2VjjjNacYr92kb7jgaoQynNAcKuvziVcKVf/json/"

  const MoonSharkNFT = await hre.ethers.getContractFactory("MoonSharkNFT");
  const moonSharkNFTContract = await MoonSharkNFT.deploy(ipfsBase);

  await moonSharkNFTContract.deployed();

  console.log("moonSharkNFTContract deployed to:", moonSharkNFTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
