// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MetisToken is ERC20, Ownable {
    mapping(address => bool) internal miners;

    modifier onlyMiner() {
        require(miners[msg.sender], "403");
        _;
    }

    constructor(
        uint256 initialSupply
    ) ERC20("Metis Testnet Token", "METIS") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        miners[msg.sender] = true;
    }

    function mint(address _target, uint256 _amount) public onlyMiner {
        _mint(_target, _amount);
    }

    function isMiner(address _target) public view returns (bool) {
        return miners[_target];
    }

    function addMiner(address[] calldata _miners) external onlyOwner {
        for (uint i = 0; i < _miners.length; i++) {
            miners[_miners[i]] = true;
        }
    }

    function removeMiner(address[] calldata _miners) external onlyOwner {
        for (uint i = 0; i < _miners.length; i++) {
            delete miners[_miners[i]];
        }
    }
}
