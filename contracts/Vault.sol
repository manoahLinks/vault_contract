// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Vault {

    constructor () {
        grantId ++;
    }

    struct Grant {
        uint256 id;
        address beneficiary;
        uint256 amount;
        uint256 cliamTime;
        bool isCliamed;
    }

    mapping(uint256 => Grant) grants;
    mapping(address => mapping(uint256 => bool)) isBeneficiary;

    uint256 grantId;

    function offerGrant (address _beneficiary) external payable  {

        require(msg.sender != address(0), "address zero cant call this func");

        uint256 _cliamTime = block.timestamp + 1 days;

        isBeneficiary[_beneficiary][grantId] = true;

        grants[grantId] = Grant(grantId, _beneficiary, msg.value, _cliamTime, false);

        payable(address(this)).transfer(msg.value);

        grantId ++;
    }

    function cliamGrant (uint256 _grantId) external {

        require(isBeneficiary[msg.sender][_grantId], "cant cliam you are not a benficiary");

        require(block.timestamp >= grants[_grantId].cliamTime, "you cant cliam yet");

        require(grants[_grantId].isCliamed == false, "the grant has been cliamed");

        payable(msg.sender).transfer(grants[_grantId].amount);

        grants[_grantId].isCliamed = true;
    }

    receive() external payable { }
}