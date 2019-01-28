pragma solidity >= 0.5.0 < 0.6.0;

contract BettingApp {
    address payable public contractOwner;
    uint public unusedAddressId;
    uint public availableAddresses;
    uint public newAddressId;
    uint public totalBetAmount;
    uint public totalBetUpAmount;
    uint public totalBetDownAmount;

    constructor() public {
        contractOwner = msg.sender;
        availableAddresses = 0;
        unusedAddressId = 0;
        newAddressId = 0;
        totalBetAmount = 0;
        totalBetUpAmount = 0;
        totalBetDownAmount = 0;
    }
    
    struct User {
        string password;
        address assignedAddress;
        string addressPassword;
        bool exist;
    }
    mapping (string => User) users;
    
    struct AddressesPool {
        address addressToAsign;
        string password;
    }
    mapping (uint => AddressesPool) addresses;
    
    function registerUser(string memory _username, string memory _password) public returns (string memory) {
        if (!users[_username].exist) {
            if (availableAddresses > 0) {
                users[_username].password = _password;
                users[_username].assignedAddress = addresses[unusedAddressId].addressToAsign;
                users[_username].addressPassword = addresses[unusedAddressId].password;
                users[_username].exist = true;
                unusedAddressId++;
                availableAddresses--;
                return "You have been successfully registered";
            } else {
                return "There are no available addresses, please try again later.";
            }
        } else {
            return "Username already exist";
        }
    }

    function checkIfUserExist(string memory _username) public view returns (bool) {
        return users[_username].exist;
    }
    
    function createNewAddress(address _addressToAsign, string memory _password) public returns (string memory){
        addresses[newAddressId].addressToAsign = _addressToAsign;
        addresses[newAddressId].password = _password;
        newAddressId = newAddressId + 1;
        availableAddresses = availableAddresses + 1;
        return "New address created successfuly";
    }

    function didaKralj() public pure returns (string memory){
        return "Stvarno kralj";
    }

    function getAvailableAddresses() public view returns (uint number) {
        return availableAddresses;
    }
    
    struct Bet {
        address payable playerAddress;
        uint8 betType;
        uint amount;
    }
    
    Bet[] public Bets;
    
    function purchaseBet(uint8 _type) public payable {
        require(msg.sender != contractOwner);
        require(_type == 1 || _type == 2);
        
        Bet memory newBet;
        newBet.playerAddress = msg.sender;
        newBet.betType = _type;
        newBet.amount = msg.value;
        
        totalBetAmount += msg.value;
        
        if (_type == 1)
            totalBetDownAmount += msg.value;
        else
            totalBetUpAmount += msg.value;

        Bets.push(newBet);
    }
    
    function payWinnigBets(uint8 _winningType) public {
        require(_winningType == 1 || _winningType == 2);
        uint reward;
        uint rewardCoefficient;
        uint ethForHouse;
        
        if (_winningType == 1) {
            ethForHouse = totalBetUpAmount * 10 / 100;
            contractOwner.transfer(ethForHouse);
            totalBetAmount -= ethForHouse;
            rewardCoefficient = totalBetAmount * 10000 / totalBetDownAmount;
        } else {
            ethForHouse = totalBetDownAmount * 10 / 100;
            contractOwner.transfer(ethForHouse);
            totalBetAmount -= ethForHouse;
            rewardCoefficient = totalBetAmount * 10000 / totalBetUpAmount;
        }
  
        for (uint i = 0; i < Bets.length; i++) {
            if(Bets[i].betType == _winningType) {
                reward = Bets[i].amount * rewardCoefficient / 10000;
                Bets[i].playerAddress.transfer(reward);
            }
        }
        
        Bets.length = 0;
        totalBetAmount = 0;
        totalBetUpAmount = 0;
        totalBetDownAmount = 0;
    }
}