// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./interfaces/IBridge.sol";

// Open Zeppelin libraries for controlling upgradability and access.
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Bridge is Initializable, UUPSUpgradeable, IBridge {
    address private impl;

    // Declare a state variable to indicate upgrade readiness
    bool private upgradeReady;

    bool public running;
    struct Validator {
        address validatorAddress; // The address of the validator
        uint256 validatorWeight; // The weight of the validator
    }
    // A mapping from address to validator
    mapping(address => Validator) public validators;

    function initialize(Validator[] calldata _validators) public initializer {
        running = true;

        for (uint256 i = 0; i < _validators.length; i++) {
            addValidator(
                _validators[i].validatorAddress,
                _validators[i].validatorWeight
            );
            emit ValidatorAdded(
                _validators[i].validatorAddress,
                _validators[i].validatorWeight
            );
        }

        impl = address(0);
        // Initialize upgradeReady to false
        upgradeReady = false;

        __UUPSUpgradeable_init();
        ///@dev as there is no constructor, we need to initialise the OwnableUpgradeable explicitly
        // __Ownable_init();
    }

    // Write a function to set upgradeReady to true
    function setUpgradeReady() public {
        upgradeReady = true;
    }

    event ValidatorAdded(
        address addr, // The address of the validator
        uint256 weight // The weight of the validator
    );

    function addValidator(address _pk, uint256 _weight) private {
        // Check if the address is not zero
        require(_pk != address(0), "Zero address.");

        // Check if the address is not already a validator
        require(
            validators[_pk].validatorAddress == address(0),
            "Already a validator."
        );

        // Add the validator to the mapping
        validators[_pk] = Validator(_pk, _weight);
    }

    /**
     * @dev Modifier to make a function callable only when the contract is Running.
     */
    modifier whenRunning() {
        require(running, "Bridge is Running");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not Running.
     */
    modifier whenNotRunning() {
        require(!running, "Bridge is Not Running");
        _;
    }

    // Function to pause the bridge
    function pauseBridge() private whenRunning {
        running = false;
    }

    // Function to pause the bridge
    function resumeBridge() private whenNotRunning {
        running = true;
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address newImplementation) internal override {
        // Require upgradeReady to be true
        // require(upgradeReady, "Contract is not ready for upgrade");
    }

    /**

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address newImplementation) internal override {
        assert(impl != address(0));
        assert(impl == address(0x5567f54B29B973343d632f7BFCe9507343D41FCa));

        // assert(impl != address(0));
        // assert(impl == newImplementation);
    }

    function doUpgrade(address newImplementation) public {
        assert(impl == address(0));
        impl = newImplementation;

        _authorizeUpgrade(newImplementation);

        impl = address(0);
    }
*/

    // function doUpgrade(address newImplementation) public {
    //     assert(impl == address(0));
    //     impl = newImplementation;

    //     // upgradeToAndCall(newImplementation);
    //     // this calls _authorizeUpgrade

    //     _authorizeUpgrade(newImplementation);

    //     impl = address(0);
    // }

    // function upgradeTo(address newImplementation) external {
    //     require(_msgSender() == owner(), "Unauthorized access");
    //     console.log("upgradeTo executed for admin:", _msgSender());
    //     console.log("New implementation address:", newImplementation);
    //     _upgradeTo(newImplementation);
    // }

    // function upgradeToAndCall(
    //     address newImplementation,
    //     bytes memory data
    // ) external {
    //     require(_msgSender() == owner(), "Unauthorized access");
    //     console.log("upgradeToAndCall executed for admin:", _msgSender());
    //     console.log("New implementation address:", newImplementation);
    //     _upgradeToAndCall(newImplementation, data);
    // }
}
