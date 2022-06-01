const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoonShark NFT", function () {
  let owner,odko,michael
  let moonSharkNFTContract

  beforeEach(async function () {
    [owner,odko,michael] = await ethers.getSigners()

    const MoonSharkNFT = await ethers.getContractFactory("MoonSharkNFT")
    moonSharkNFTContract = await MoonSharkNFT.deploy('ipfs://QmP7cNFhnAqLiCLhQkCJQ9TCSenRb3jkYzvQKoqj7GUCXC/')
    moonSharkNFTContract.deployed()
  })

  it("Minting", async function () {
    await moonSharkNFTContract.setMintRole(odko.address)

    await moonSharkNFTContract.connect(odko).mint(10)
    console.log("Total Supply - ",await moonSharkNFTContract.totalSupply())
    console.log("#0 URI - ",await moonSharkNFTContract.tokenURI(0))
    console.log("#1 URI - ",await moonSharkNFTContract.tokenURI(1))
    console.log("#2 URI - ",await moonSharkNFTContract.tokenURI(2))
    console.log("Owner of #0 - ",await moonSharkNFTContract.ownerOf(0))
    console.log("Odko NFT Balance - ",await moonSharkNFTContract.balanceOf(odko.address))
  })

});

