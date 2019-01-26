pragma solidity >= 0.5.0 < 0.6.0;

contract BettingApp {
    address payable public contractOwner;
    uint public totalBetAmount;
    uint public totalBetUpAmount;
    uint public totalBetDownAmount;
    
    struct Player {
        string username;
        string password;
    }
    
    struct Bet {
        address payable playerAddress;
        uint8 betType;
        uint amount;
    }
    
    Bet[] public Bets;
    
    constructor() public {
        contractOwner = msg.sender;
        totalBetAmount = 0;
        totalBetUpAmount = 0;
        totalBetDownAmount = 0;
    }
    
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