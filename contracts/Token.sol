// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MetisToken is ERC20, Ownable {
    bool public charge = true;

    uint256 public rate = 100; // rate is ether/metis

    function setRate(uint256 _rate) public onlyOwner {
        require(_rate > 0, "rate == 0");
        rate = _rate;
    }

    function setCharge(bool _charge) public onlyOwner {
        charge = _charge;
    }

    constructor() ERC20("Metis Stub", "METIS") Ownable(msg.sender) {
        _mint(msg.sender, 1e8 ether);
    }

    function mint(address _target, uint256 _amount) public onlyOwner {
        _mint(_target, _amount);
    }

    function airdrop(
        address[] calldata _tos,
        uint256 _amount
    ) external onlyOwner {
        for (uint i = 0; i < _tos.length; i++) {
            _mint(_tos[i], _amount);
        }
    }

    function disperse(address[] calldata _tos, uint256 _amount) external {
        for (uint i = 0; i < _tos.length; i++) {
            _transfer(msg.sender, _tos[i], _amount);
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
