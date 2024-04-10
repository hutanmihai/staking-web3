import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  async function deployTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(owner.address);

    return { myToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { myToken, owner } = await deployTokenFixture();

      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { myToken, owner } = await deployTokenFixture();

      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should let the owner mint tokens", async function () {
      const { myToken, owner } = await deployTokenFixture();
      const otherAccount = ethers.Wallet.createRandom().connect(
        ethers.provider,
      );
      const mintAmount = ethers.parseUnits("100", 18);

      await expect(myToken.mint(otherAccount.address, mintAmount))
        .to.emit(myToken, "Transfer")
        .withArgs(ethers.ZeroAddress, otherAccount.address, mintAmount);

      expect(await myToken.balanceOf(otherAccount.address)).to.equal(
        mintAmount,
      );
    });

    it("Should fail if non-owner tries to mint tokens", async function () {
      const { myToken, otherAccount } = await deployTokenFixture();
      const mintAmount = ethers.parseUnits("100", 18);

      await expect(
        myToken.connect(otherAccount).mint(otherAccount.address, mintAmount),
      ).to.be.reverted;
    });

    it("Should allow users to burn their tokens", async function () {
      const { myToken, owner } = await deployTokenFixture();
      const burnAmount = ethers.parseUnits("50", 18);

      // Owner mints tokens to themselves before burning
      await myToken.mint(owner.address, ethers.parseUnits("100", 18));
      await expect(myToken.burn(burnAmount))
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      const finalBalance = await myToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(ethers.parseUnits("50", 18));
    });
  });
});
