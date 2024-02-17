// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IMetisToken} from "./interfaces/IMetisToken.sol";

contract MetisToken is ERC20, Ownable, IMetisToken {
    mapping(address => bool) internal miners;

    bool public charge = true;

    uint256 public rate = 100; // rate is ether/metis

    modifier onlyMiner() {
        require(miners[msg.sender], "Not miner");
        _;
    }

    function setRate(uint256 _rate) public onlyOwner {
        require(_rate > 0, "rate == 0");
        rate = _rate;
    }

    function setCharge(bool _charge) public onlyOwner {
        charge = _charge;
    }

    constructor() ERC20("Metis Testnet Token", "METIS") Ownable(msg.sender) {
        miners[msg.sender] = true;
    }

    function mint(address _target, uint256 _amount) public override onlyMiner {
        _mint(_target, _amount);
    }

    function disperse(
        address[] calldata _tos,
        uint256 _amount
    ) external override onlyMiner {
        for (uint i = 0; i < _tos.length; i++) {
            transfer(_tos[i], _amount);
        }
    }

    function isMiner(address _target) public view override returns (bool) {
        return miners[_target];
    }

    function addMiner(address[] calldata _miners) external override onlyOwner {
        for (uint i = 0; i < _miners.length; i++) {
            miners[_miners[i]] = true;
        }
    }

    function removeMiner(
        address[] calldata _miners
    ) external override onlyOwner {
        for (uint i = 0; i < _miners.length; i++) {
            delete miners[_miners[i]];
        }
    }

    receive() external payable {
        uint256 amount = rate;

        if (charge) {
            require(msg.value > 0, "The faucet is not free of charge");
            amount *= msg.value;
        }

        if (msg.value > 0) {
            payable(owner()).transfer(msg.value);
        }

        return _mint(msg.sender, amount);
    }
}
