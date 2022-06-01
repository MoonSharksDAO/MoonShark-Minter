const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoonShark NFT Minter", function () {
  let owner,odko,michael
  let moonSharkNFTContract,moonSharkMinterContract

  beforeEach(async function () {
    [owner,odko,michael] = await ethers.getSigners()

    const MoonSharkNFT = await ethers.getContractFactory("MoonSharkNFT")
    moonSharkNFTContract = await MoonSharkNFT.deploy('ipfs://QmP7cNFhnAqLiCLhQkCJQ9TCSenRb3jkYzvQKoqj7GUCXC/')
    moonSharkNFTContract.deployed()

    const MoonSharkMinter = await ethers.getContractFactory("MoonSharkMinter");
    moonSharkMinterContract = await MoonSharkMinter.deploy(moonSharkNFTContract.address,10);
    await moonSharkMinterContract.deployed();
  })

  it("Minter Mint", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await moonSharkMinterContract.connect(odko).mint()

    console.log("Total Supply - ",await moonSharkNFTContract.totalSupply())
    console.log("#0 URI - ",await moonSharkNFTContract.tokenURI(0))
    console.log("Owner of #0 - ",await moonSharkNFTContract.ownerOf(0))
    console.log("Odko NFT Balance - ",await moonSharkNFTContract.balanceOf(odko.address))
  })

  it("Minter BatchMint", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await moonSharkMinterContract.connect(odko).batchMint(10)

    console.log("Total Supply - ",await moonSharkNFTContract.totalSupply())
    console.log("#0 URI - ",await moonSharkNFTContract.tokenURI(0))
    console.log("Owner of #0 - ",await moonSharkNFTContract.ownerOf(0))
    console.log("Odko NFT Balance - ",await moonSharkNFTContract.balanceOf(odko.address))
  })

  it("Minter BatchMint - Max Cap Reached Revert", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await expect(moonSharkMinterContract.connect(odko).batchMint(11))
      .to.be.revertedWith('MAX_CAP Reached');
  })

});

