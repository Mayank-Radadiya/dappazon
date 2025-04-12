// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    // define Item object type.
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 price;
        uint256 stock;
        uint256 rating;
    }

    // Crete a struct of Order

    struct Order {
        uint256 time;
        Item item;
    }

    // map each item with Id
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event ItemCreated(
        uint256 id,
        string name,
        string category,
        uint256 price,
        uint256 stock
    );
    event BuyItem(address buyer, uint256 orderId, uint256 itemId);

    constructor() {
        owner = msg.sender;
    }

    modifier OnlyOwner() {
        // first check if the caller is the owner
        require(msg.sender == owner, "Only owner can list items");
        _;
    }

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _price,
        uint256 _stock,
        uint256 _rating
    ) public OnlyOwner {
        // Crete a item object
        Item memory newItem = Item(
            _id,
            _name,
            _category,
            _image,
            _price,
            _stock,
            _rating
        );

        // store newItem Obj into blockchain
        items[_id] = newItem;

        // Emit event
        emit ItemCreated(_id, _name, _category, _price, _stock);
    }

    function buy(uint256 _id) public payable {
        // first fetch the item
        Item memory item = items[_id];

        // send enough ETH to buy item
        require(msg.value >= items[_id].price, "Not enough ether sent");

        // Crete a order object
        Order memory order = Order(block.timestamp, item);

        orderCount[msg.sender]++;

        orders[msg.sender][orderCount[msg.sender]] = order;

        require(items[_id].stock > 0, "Out of Stock");
        items[_id].stock--;

        emit BuyItem(msg.sender, orderCount[msg.sender], items[_id].id);
    }

    // windraw ether from contract
    function withdraw() public OnlyOwner {
        // transfer ether to owner
        payable(owner).transfer(address(this).balance);
    }
}
