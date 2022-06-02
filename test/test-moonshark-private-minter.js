const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");
const { deployContract } = waffle;

describe("MoonShark NFT Private Minter", function () {
  let owner,odko,michael,bilguun,treasury
  let moonSharkNFTContract,minterContract

  beforeEach(async function () {
    [owner,odko,michael,bilguun,treasury] = await ethers.getSigners()

    const MoonSharkNFT = await ethers.getContractFactory("MoonSharkNFT")
    moonSharkNFTContract = await MoonSharkNFT.deploy('https://moonsharks.mypinata.cloud/ipfs/QmQrWoXpstG2VjjjNacYr92kb7jgaoQynNAcKuvziVcKVf/json/')
    moonSharkNFTContract.deployed()

    const MoonSharkPrivateMinter = await ethers.getContractFactory("MoonSharkPrivateMinter");
    minterContract = await MoonSharkPrivateMinter.deploy(moonSharkNFTContract.address,10);
    await minterContract.deployed();

    await moonSharkNFTContract.setMintRole(minterContract.address)
  })

  

  //
  /// MINT
  //

  it("Solo Mint", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.connect(odko).mint({ value: ethers.utils.parseEther('0.05') })

    console.log("ID 1 - ",await moonSharkNFTContract.tokenURI(1))

    expect(await moonSharkNFTContract.totalSupply()).to.equal(1);
    expect(await moonSharkNFTContract.balanceOf(odko.address)).to.equal(1);

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.05'));
  })

  it("Solo Mint - revert message 'FEE ISN'T CORRECT' ", async function () {
    await expect(minterContract.connect(odko).mint())
      .to.be.revertedWith("FEE ISN'T CORRECT");
  })

  it("Solo Mint - revert message 'NOT IN WHITELIST' ", async function () {
    await expect(minterContract.connect(odko).mint({ value: ethers.utils.parseEther('0.05') }))
      .to.be.revertedWith("NOT IN WHITELIST");
  })

  it("Solo Mint - revert message 'MEMBER WHITELIST CAP REACHED' ", async function () {
    await minterContract.addToWhitelist(odko.address)

    for (let i = 0; i < 5; i++) {
      await minterContract.connect(odko).mint({ value: ethers.utils.parseEther('0.05') })
    }
    
    await expect(minterContract.connect(odko).mint({ value: ethers.utils.parseEther('0.05') }))
      .to.be.revertedWith("MEMBER WHITELIST CAP REACHED");

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.25'));
  })

  it("Solo Mint - revert message 'MAX_CAP REACHED' ", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.addToWhitelist(michael.address)
    await minterContract.addToWhitelist(bilguun.address)

    for (let i = 0; i < 5; i++) {
      await minterContract.connect(odko).mint({ value: ethers.utils.parseEther('0.05') })
    }

    for (let i = 0; i < 5; i++) {
      await minterContract.connect(michael).mint({ value: ethers.utils.parseEther('0.05') })
    }
    
    await expect(minterContract.connect(bilguun).mint({ value: ethers.utils.parseEther('0.05') }))
      .to.be.revertedWith("MAX_CAP REACHED");

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.5'));
  })

  //
  /// Add To WhiteList
  //
  
  it("Add To WhiteList", async function () {
    await minterContract.addToWhitelist(odko.address)
    expect((await minterContract.whitelists(odko.address)).memberAddress).to.equal(odko.address);
  })

  //
  /// Add To WhiteList
  //
  
  it("Batch Add To WhiteList", async function () {
    let addressArray = [odko.address,michael.address,bilguun.address]

    await minterContract.batchAddToWhitelist(addressArray)

    expect((await minterContract.whitelists(odko.address)).memberAddress).to.equal(odko.address);
    expect((await minterContract.whitelists(michael.address)).memberAddress).to.equal(michael.address);
    expect((await minterContract.whitelists(bilguun.address)).memberAddress).to.equal(bilguun.address);
  })

  //
  /// BATCH MINT
  //


  it("Batch Mint - 5", async function () {
    await minterContract.addToWhitelist(odko.address)

    await minterContract.connect(odko).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })

    expect(await moonSharkNFTContract.totalSupply()).to.equal(5);
    expect(await moonSharkNFTContract.balanceOf(odko.address)).to.equal(5);

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.25'));
  })

  it("Batch Mint - 2 then 3", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.connect(odko).batchMint(2,{ value: ethers.utils.parseEther((0.05*2).toString()) })

    expect(await moonSharkNFTContract.totalSupply()).to.equal(2);
    expect(await moonSharkNFTContract.balanceOf(odko.address)).to.equal(2);

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.1'));

    await minterContract.connect(odko).batchMint(3,{ value: ethers.utils.parseEther('0.15') })

    expect(await moonSharkNFTContract.totalSupply()).to.equal(5);
    expect(await moonSharkNFTContract.balanceOf(odko.address)).to.equal(5);

    expect(await waffle.provider.getBalance(minterContract.address)).to.equal(ethers.utils.parseEther('0.25'));
  })

  it("Batch Mint - revert message 'FEE ISN'T CORRECT' ", async function () {
    await minterContract.addToWhitelist(odko.address)

    await expect(minterContract.connect(odko).batchMint(5))
      .to.be.revertedWith("FEE ISN'T CORRECT");
  })

  it("Batch Mint - revert message 'MEMBER WHITELIST CAP REACHED' ", async function () {
    await minterContract.addToWhitelist(odko.address)

    await expect(minterContract.connect(odko).batchMint(11,{ value: ethers.utils.parseEther((0.05*11).toString()) }))
      .to.be.revertedWith("MEMBER WHITELIST CAP REACHED");
  })

  it("Batch Mint - revert message 'MAX_CAP REACHED' ", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.addToWhitelist(michael.address)
    await minterContract.addToWhitelist(bilguun.address)

    await minterContract.connect(odko).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })
    await minterContract.connect(bilguun).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })

    await expect(minterContract.connect(michael).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) }))
      .to.be.revertedWith("MAX_CAP REACHED");
  })


  //
  /// RetrieveFund
  //
  
  it("RetrieveFund", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.addToWhitelist(bilguun.address)

    let treasuryBalanceBN = await waffle.provider.getBalance(treasury.address)

    await minterContract.connect(odko).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })
    await minterContract.connect(bilguun).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })

    await minterContract.pause()

    await minterContract.connect(owner).retrieveFund(treasury.address)

    let amountToAdd = ethers.utils.parseEther((0.05*10).toString());
    let resultBN = treasuryBalanceBN.add(amountToAdd)

    expect(await waffle.provider.getBalance(treasury.address)).to.equal(resultBN);
  })

  it("RetrieveFund - Revert Not 'Pausable: not paused' ", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.addToWhitelist(bilguun.address)

    await minterContract.connect(odko).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })
    await minterContract.connect(bilguun).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })

    await expect(minterContract.connect(owner).retrieveFund(treasury.address))
      .to.be.revertedWith("Pausable: not paused");
  })

  it("RetrieveFund - Revert Not 'Ownable: caller is not the owner' ", async function () {
    await minterContract.addToWhitelist(odko.address)
    await minterContract.addToWhitelist(bilguun.address)

    await minterContract.connect(odko).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })
    await minterContract.connect(bilguun).batchMint(5,{ value: ethers.utils.parseEther((0.05*5).toString()) })

    await minterContract.pause()

    await expect(minterContract.connect(michael).retrieveFund(treasury.address))
      .to.be.revertedWith("Ownable: caller is not the owner");
  })

  //
  /// Pause
  //

  it("When Paused , cant Mint or Batch Mint", async function () {
    await minterContract.addToWhitelist(michael.address)

    await minterContract.pause()

    await expect(minterContract.connect(michael).mint())
      .to.be.revertedWith("Pausable: paused");

    await expect(minterContract.connect(michael).batchMint(2))
      .to.be.revertedWith("Pausable: paused");
  })

});

