// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(address initialOwner)
    ERC20("MyToken", "MTK")
    Ownable(initialOwner)
    {}

    // Function to mint tokens
    // This gives the contract owner the ability to mint more tokens
    // Be careful with this function in real applications as it can affect the token's value
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Optional: Implement a burn function if you want users to be able to destroy their tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
