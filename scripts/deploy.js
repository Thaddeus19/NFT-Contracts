// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//deploy localhost
/*async function main() {
  [deployer] = await ethers.getSigners();
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  const nft = await NFTToken.deploy("https://gateway.pinata.cloud/ipfs/QmZ8ncNkicBLb8Mz7yuK442b3YaPkMzuUarBYsSgDLNHny/");

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}*/

//deploy testnet o mainnet
async function main() {
[deployer] = await ethers.getSigners();
const NFTToken = await hre.ethers.getContractFactory("NFTToken");
/*I must send in the constructor the url of the IPFS containing the metadata*/
const nft = await NFTToken.deploy("https://gateway.pinata.cloud/ipfs/QmZ8ncNkicBLb8Mz7yuK442b3YaPkMzuUarBYsSgDLNHny/");

await nft.deployed();

console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
