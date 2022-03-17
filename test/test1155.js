const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  it("Should return the total supply is equal 0", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("Objects");
    const nft = new GasTracker(await NFTToken.deploy(), {
      logAfterTx: true,
    })

    await nft.deployed();
    expect(await nft.supply('1')).to.equal('100');
    expect(await nft.uri('0')).to.equal("https://ipfs.moralis.io:2053/ipfs/QmbCUjN57GbsPsQhcqjNwSf2DDbRthqy5DYKbqPSwwTBX6/metadata/0.json");
    await expect(nft.uri('4')).to.revertedWith("ERC721Metadata: URI query for nonexistent token");
  });

  it("Should create an item and increase supply", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("Objects");
    const nft = new GasTracker(await NFTToken.deploy(), {
      logAfterTx: true,
    })

    await nft.deployed();
    const minttx = await nft.create(2,2,"0x00");
    await minttx.wait();
    let zeroaddress = '0x0000000000000000000000000000000000000000';
    let URI2 = await nft.uri('2');
    expect(minttx).to.emit(nft, 'TransferSingle').withArgs(deployer.address, zeroaddress,deployer.address, '2',2);
    expect(minttx).to.emit(nft, 'PermanentURI').withArgs(URI2, '2');
    expect(await nft.supply('2')).to.equal('3');
    expect(URI2).to.equal("https://ipfs.moralis.io:2053/ipfs/QmbCUjN57GbsPsQhcqjNwSf2DDbRthqy5DYKbqPSwwTBX6/metadata/2.json");
  });

  it("Must create an item, increase the supply and then give error", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("Objects");
    const nft = new GasTracker(await NFTToken.deploy(), {
      logAfterTx: true,
    })

    await nft.deployed();
    const minttx = await nft.create(0,1,"0x00");
    await minttx.wait();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    expect(minttx).to.emit(nft, 'TransferSingle').withArgs(deployer.address, zeroaddress,deployer.address, '2',2);
    expect(await nft.supply('0')).to.equal('100');

    await expect(nft.create(0,1,"0x00")).to.revertedWith('exceedssupply()');
  });
});