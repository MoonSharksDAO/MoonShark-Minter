const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoonShark NFT Minter", function () {
  let owner,odko,michael,bilguun
  let moonSharkNFTContract,moonSharkMinterContract

  beforeEach(async function () {
    [owner,odko,michael,bilguun] = await ethers.getSigners()

    const MoonSharkNFT = await ethers.getContractFactory("MoonSharkNFT")
    moonSharkNFTContract = await MoonSharkNFT.deploy('https://moonsharks.mypinata.cloud/ipfs/bafybeiaciubfyuwfxcpqkkoll2donez3ckc5pcdad3fhmrp4yuinltyucu/json/')
    moonSharkNFTContract.deployed()

    const MoonSharkMinter = await ethers.getContractFactory("MoonSharkMinter");
    moonSharkMinterContract = await MoonSharkMinter.deploy(moonSharkNFTContract.address,20);
    await moonSharkMinterContract.deployed();
  })

  it("Minter Mint", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()

    console.log("ID 1 - ",await moonSharkNFTContract.tokenURI(1))
    console.log("ID 2 - ",await moonSharkNFTContract.tokenURI(2))

    console.log("Total Supply - ",await moonSharkNFTContract.totalSupply())
    console.log("Odko NFT Balance - ",await moonSharkNFTContract.balanceOf(odko.address))
  })

  it("Minter BatchMint", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await moonSharkMinterContract.connect(odko).batchMint(10)

    console.log("Total Supply - ",await moonSharkNFTContract.totalSupply())
    console.log("Odko NFT Balance - ",await moonSharkNFTContract.balanceOf(odko.address))
  })

  it("Minter BatchMint - Max Cap Reached Revert", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await expect(moonSharkMinterContract.connect(odko).batchMint(30))
      .to.be.revertedWith('MAX_CAP Reached');
  })

  it("Minter Mint - Member Mint Cap Reached Revert", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()
    await moonSharkMinterContract.connect(odko).mint()

    await expect(moonSharkMinterContract.connect(odko).mint())
      .to.be.revertedWith('MEMBER WHITELIST CAP REACHED');
  })

  it("Minter BatchMint - Member Mint Cap Reached Revert", async function () {
    await moonSharkNFTContract.setMintRole(moonSharkMinterContract.address)

    await moonSharkMinterContract.addToWhitelist(odko.address)
    await expect(moonSharkMinterContract.connect(odko).batchMint(11))
      .to.be.revertedWith('MEMBER WHITELIST CAP REACHED');
  })

  it("Batch Add To Whitelist", async function () {
    let whiteListArray = [odko.address,michael.address,bilguun.address]
    await moonSharkMinterContract.batchAddToWhitelist(whiteListArray)

    expect((await moonSharkMinterContract.whitelists(odko.address)).memberAddress).to.equal(odko.address);
    expect((await moonSharkMinterContract.whitelists(michael.address)).memberAddress).to.equal(michael.address);
    expect((await moonSharkMinterContract.whitelists(bilguun.address)).memberAddress).to.equal(bilguun.address);
  })

});

