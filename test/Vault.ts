import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";

describe("Vault contract", () => {

    const deployVaultContract = async () => {

        const [owner, acct1, acct2, acct3] = await ethers.getSigners()

        const Vault = await ethers.getContractFactory("Vault");

        const vault = await Vault.deploy();

        const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

        const cliamTime = await time.latest() + ONE_DAY_IN_SECONDS;

        return {vault, owner, acct1, acct2, cliamTime}
    }

    describe("Offer grant", () => {

        it("should create a new grant", async () => {
            const {vault, owner, acct1} = await loadFixture(deployVaultContract);

            const grantAmount = ethers.parseEther("5");

            const contractBalanceBeforeGrant = await vault.getContractBalance();

            (await vault.connect(owner).offerGrant(acct1, {value: grantAmount})).wait();

            const contractBalanceAfterGrant = await vault.getContractBalance();

            expect(contractBalanceAfterGrant).to.be.greaterThan(contractBalanceBeforeGrant);

        })

    })

    describe("cliam Grant", () => {

        it("should allow beneficiary cliam grant", async () => {
            const {vault, owner, acct1, cliamTime} = await loadFixture(deployVaultContract);

            const grantAmount = ethers.parseEther("5");

            const contractBalanceBeforeGrant = await vault.getContractBalance();

            (await vault.connect(owner).offerGrant(acct1, {value: grantAmount})).wait();

            const contractBalanceBeforeCliam = await vault.getContractBalance();

            await time.increaseTo(cliamTime);
            
            (await vault.connect(acct1).cliamGrant(1)).wait;

            const contractBalanceAfterCliam = await vault.getContractBalance();

            await expect(contractBalanceAfterCliam).to.be.lessThan(contractBalanceBeforeCliam);
        })
    })

})  