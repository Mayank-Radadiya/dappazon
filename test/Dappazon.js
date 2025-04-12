// This file user for test Solodity code.
// Command: npx hardhat test

// This code for test solidity code in your Mechanic.
// If you want easy testing go to remix.ethereum.org. It this website no need to write test code.It will make easy testing. No need to understand this code. Just write Solidity code and test blockchain.

const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ID = 1;
const NAME = "Tv";
const CATEGORY = "Electronic";
const IMAGE = "ImgUrl1";
const PRICE = tokens(1);
const STOCK = 2;
const RATING = 4;

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;

  // Run before every test. Connect to smart contract....
  beforeEach(async () => {
    // Hardhat run a test Blockchain in owr system.It has some dummy account in that blockchain.
    // It have 20 different accounts.
    [deployer, buyer] = await ethers.getSigners();

    //  Connect smart contract to this file.
    const Dappazon = await ethers.getContractFactory("Dappazon");
    // deploy contract to test blockchain
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", async () => {
    //  owner test...
    it("Sets the Owner", async () => {
      const owner = await dappazon.owner();
      expect(owner).to.equal(deployer.address);
    });
  });

  describe("Listing Item", async () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, PRICE, STOCK, RATING);

      await transaction.wait();
    });

    it("List", async () => {
      const item = await dappazon.items(ID);
      expect(item.id).to.equal(ID);
    });
  });

  describe("Buying", async () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, PRICE, STOCK, RATING);

      await transaction.wait();

      // Buy item
      transaction = await dappazon.connect(buyer).buy(ID, { value: PRICE });
    });

    it("Update contract Balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(PRICE);
    });

    it("Buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    });

    it("Emit buy event", async () => {
      expect(transaction).to.emit(dappazon, "BuyItem");
    });
  });
});
