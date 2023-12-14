// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMetisToken is IERC20 {
    function mint(address _target, uint256 _amount) external;

    function isMiner(address _target) external view returns (bool);

    function addMiner(address[] calldata _miners) external;

    function removeMiner(address[] calldata _miners) external;
}
