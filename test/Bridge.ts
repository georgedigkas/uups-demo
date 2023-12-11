import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expectRevert } from "@openzeppelin/test-helpers";

// Define the contract name and the interface
const CONTRACT_NAME = "Bridge";

// Define an enum for the Message Types
enum MessageType {
  TOKEN,
  COMMITTEE_BLOCKLIST,
  EMERGENCY_OP,
}

// Define an enum for the chain IDs
enum ChainID {
  SUI,
  ETH,
}

// Define an enum for the token IDs
enum TokenID {
  SUI,
  BTC,
  ETH,
  USDC,
  USDT,
}

// Write a test suite for the contract
describe(CONTRACT_NAME, () => {
  let validators: { validatorAddress: string; validatorWeight: number }[];
  let hardhatEthersSigners: HardhatEthersSigner[];
  let others;

  // Deploy the contract before each test
  async function beforeEach() {
    // Get the signers from the hardhat network
    let [tmpValidator] = await ethers.getSigners();

    // Get the contract factory and deploy the contract
    const Bridge = await ethers.getContractFactory("Bridge");
    const BridgeV2 = await ethers.getContractFactory("BridgeV2");

    // Create the new validator object
    const defaultValidator = {
      validatorAddress: "0x5567f54B29B973343d632f7BFCe9507343D41FCa",
      validatorWeight: 1000,
    };

    validators = [
      defaultValidator,
      {
        validatorAddress: await tmpValidator.getAddress(),
        validatorWeight: 1000,
      },
    ];

    const proxy = await upgrades.deployProxy(Bridge, [validators], {
      initializer: "initialize",
      kind: "uups",
    });
    await proxy.waitForDeployment();

    return { Bridge, BridgeV2, proxy };
  }

  it("should initialize correctly", async () => {
    const { proxy } = await loadFixture(beforeEach);

    // // Check if the validators were initialized correctly
    for (let i = 0; i < validators.length; i++) {
      const validator = await proxy.validators(validators[i].validatorAddress);
      expect(validator.validatorAddress).to.equal(
        validators[i].validatorAddress
      );
      expect(validator.validatorWeight).to.equal(validators[i].validatorWeight);
    }

    // await expectRevert(
    //   proxy.initialize(validators),
    //   "Initializable: contract is already initialized"
    // );
  });

  it("should upgrade", async function () {
    const { proxy, BridgeV2 } = await loadFixture(beforeEach);

    const newProxy = await upgrades.upgradeProxy(
      await proxy.getAddress(),
      BridgeV2
    );

    console.log("proxy", await proxy.getAddress());
    console.log("newProxy", await newProxy.getAddress());

    expect(await proxy.getAddress()).to.equal(await newProxy.getAddress());

    // Check if the validators were initialized correctly
    for (let i = 0; i < validators.length; i++) {
      const validator = await newProxy.validators(
        validators[i].validatorAddress
      );
      expect(validator.validatorAddress).to.equal(
        validators[i].validatorAddress
      );
      expect(validator.validatorWeight).to.equal(validators[i].validatorWeight);
    }
    newProxy.removeValidator("0x5567f54B29B973343d632f7BFCe9507343D41FCa");

    expect(await newProxy.getVersion()).to.equal(2n);
  });

  // it("should keep the storage intact", async () => {
  //   const { proxy } = await loadFixture(beforeEach);

  //   expect(await proxyContract.get()).be.equal(198);
  // });
});
