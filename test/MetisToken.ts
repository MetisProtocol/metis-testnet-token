import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MetisToken", function () {
  async function fixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MetisToken = await ethers.getContractFactory("MetisToken");
    const token = await MetisToken.deploy();

    return { token, owner, otherAccount, provider: ethers.provider };
  }

  describe("Deployment", () => {
    it("Initial state", async () => {
      const { token, owner } = await loadFixture(fixture);
      expect(await token.totalSupply()).to.equal(0);
      expect(await token.balanceOf(owner)).to.equal(0);
      expect(await token.isMiner(owner)).to.be.true;
    });
  });

  describe("Miner", () => {
    it("addMiner and removeMiner", async function () {
      const { token, otherAccount } = await loadFixture(fixture);
      expect(await token.isMiner(otherAccount)).to.be.false;
      expect(await token.addMiner([otherAccount]));
      expect(await token.isMiner(otherAccount)).to.be.true;
      expect(await token.removeMiner([otherAccount]));
      expect(await token.isMiner(otherAccount)).to.be.false;

      await expect(token.connect(otherAccount).addMiner([otherAccount]))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
      await expect(token.connect(otherAccount).removeMiner([otherAccount]))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);
    });

    it("mint", async function () {
      const { token, otherAccount } = await loadFixture(fixture);
      const amount = 100;
      expect(await token.mint(otherAccount, amount));
      expect(await token.balanceOf(otherAccount)).to.be.eq(amount);
      await expect(
        token.connect(otherAccount).mint(otherAccount, amount)
      ).to.be.revertedWith("Not miner");
    });
  });

  describe("faucet", () => {
    it("setRate", async () => {
      const { token, otherAccount } = await loadFixture(fixture);

      await expect(token.setRate(0)).to.be.revertedWith("rate == 0");
      await expect(token.connect(otherAccount).setRate(10))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);

      expect(await token.rate()).to.be.eq(100);
      expect(await token.setRate(1000));
      expect(await token.rate()).to.be.eq(1000);
    });

    it("setCharge", async () => {
      const { token, otherAccount } = await loadFixture(fixture);

      await expect(token.connect(otherAccount).setCharge(false))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(otherAccount.address);

      expect(await token.charge()).to.be.true;
      expect(await token.setCharge(false));
      expect(await token.charge()).to.be.false;
    });

    it("receive", async () => {
      const { token, otherAccount, owner, provider } = await loadFixture(
        fixture
      );

      const value = 100n;
      const rate = await token.rate();

      const amount = value * rate;

      const balance1 = await provider.getBalance(owner);

      await otherAccount.sendTransaction({
        to: await token.getAddress(),
        value,
      });

      expect(await token.balanceOf(otherAccount)).to.be.eq(amount);
      const balance2 = await provider.getBalance(owner);

      expect(balance2 - balance1).to.be.eq(value);
    });

    it("receive/freeOfCharge", async () => {
      const { token, otherAccount, owner, provider } = await loadFixture(
        fixture
      );

      await token.setCharge(false);

      const rate = await token.rate();

      await otherAccount.sendTransaction({
        to: await token.getAddress(),
        value: 0n,
      });

      expect(await token.balanceOf(otherAccount)).to.be.eq(rate);

      const balance1 = await provider.getBalance(owner);

      const etherValue = 100n;

      // no rate limits
      await otherAccount.sendTransaction({
        to: await token.getAddress(),
        value: etherValue,
      });
      expect(await token.balanceOf(otherAccount)).to.be.eq(rate * 2n);

      // donate the ethers to the owner
      const balance2 = await provider.getBalance(owner);
      expect(balance2 - balance1).to.be.eq(etherValue);
    });
  });
});
