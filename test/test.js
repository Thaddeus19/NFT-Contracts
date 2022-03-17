const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  it("Should return the total supply is equal 0", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })

    await nft.deployed();
    expect(await nft.totalSupply()).to.equal('0');
    expect(await nft.maxSupply()).to.equal('20');
    await expect(nft.tokenURI('1')).to.revertedWith("ERC721Metadata: URI query for nonexistent token");
  });

  it("Must make mint from an nft", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mint();
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, '1');
    expect(await nft.totalSupply()).to.equal('1');
  });

  it("Must make mint from various nft", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mint();
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const mintTx2 = await nft.connect(addr1).mint();
    await mintTx2.wait();
    expect(mintTx2).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr1.address, '2');
    expect(await nft.totalSupply()).to.equal('2');

    const mintTx3 = await nft.connect(addr3).mint();
    await mintTx3.wait();
    expect(mintTx3).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr3.address, '3');
    expect(await nft.totalSupply()).to.equal('3');
  });

  it("Must make mint from an nft and see the metadata", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mint();
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const metadata = await nft.tokenURI('1');
    expect(metadata).to.equal("http://localhost/1.json");
  });

  it("Must make mint from various nft and see the metadata", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mint();
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const metadata = await nft.tokenURI('1');
    expect(metadata).to.equal("http://localhost/1.json");

    const mintTx2 = await nft.connect(addr1).mint();
    await mintTx2.wait();
    expect(mintTx2).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr1.address, '2');
    expect(await nft.totalSupply()).to.equal('2');

    const metadata2 = await nft.tokenURI('2');
    expect(metadata2).to.equal("http://localhost/2.json");

    const mintTx3 = await nft.connect(addr3).mint();
    await mintTx3.wait();
    expect(mintTx3).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr3.address, '3');
    expect(await nft.totalSupply()).to.equal('3');

    const metadata3 = await nft.tokenURI('3');
    expect(metadata3).to.equal("http://localhost/3.json");
  });

  it("Mint loop to see gas consumption", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    await nft.deployed();
    const max = await nft.maxSupply();
    for(i=1; i<= max; ++i){
      const mintTx = await nft.mint();
      await mintTx.wait();
      expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, i);
    }
    expect(await nft.totalSupply()).to.equal('20');
  });

  it("Must make mintTo from an nft", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mintTo(addr2.address);
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr2.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const balance= await nft.balanceOf(addr2.address);
    expect(balance).to.equal('1');
  });

  it("Must make mintTo from an nft and see the metadata", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    const mintTx = await nft.mintTo(addr2.address);
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr2.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const balance= await nft.balanceOf(addr2.address);
    expect(balance).to.equal('1');

    const metadata = await nft.tokenURI('1');
    expect(metadata).to.equal("http://localhost/1.json");
  });

  it("Should give error when paused", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    
    await nft.setPaused(true);
    expect(await nft.paused()).to.equal(true);
    
    await expect(nft.mint()).to.revertedWith('thecontractispaused()');    
  });

  it("Should give error when paused and mint when not paused", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    await nft.deployed();
    
    await nft.setPaused(true);
    expect(await nft.paused()).to.equal(true);
    
    await expect(nft.mint()).to.revertedWith('thecontractispaused()');    

    await nft.setPaused(false);
    expect(await nft.paused()).to.equal(false);

    let zeroaddress = '0x0000000000000000000000000000000000000000';
    
    const mintTx = await nft.connect(addr4).mint();
    await mintTx.wait();
    expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,addr4.address, '1');
    expect(await nft.totalSupply()).to.equal('1');

    const metadata = await nft.tokenURI('1');
    expect(metadata).to.equal("http://localhost/1.json");
  });

  it("Should give an error when it reaches the maxsupply", async function () {
    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    const nft = new GasTracker(await NFTToken.deploy("http://localhost/"), {
      logAfterTx: true,
    })
    let zeroaddress = '0x0000000000000000000000000000000000000000';

    await nft.deployed();
    const max = await nft.maxSupply();
    for(i=1; i<= max; ++i){
      const mintTx = await nft.mint();
      await mintTx.wait();
      expect(mintTx).to.emit(nft, 'Transfer').withArgs(zeroaddress,deployer.address, i);
    }
    expect(await nft.totalSupply()).to.equal('20');
    await expect(nft.mint()).to.revertedWith('maxsupplyexceeded()');    
  });
});
