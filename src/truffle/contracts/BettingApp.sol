pragma solidity >= 0.4.22 < 0.6.0;

contract BettingApp {
    
    address payable _houseAddress;
    uint256 public _totalBetAmount;
    uint256 public _totalBull;
    uint256 public _totalBear;
    uint256 public _amountBull;
    uint256 public _amountBear;
    
    address payable[] public _betsArray;
    
    struct Player {
        string _username;
        string _password;
    }
    
    struct Bet {
        address payable _address;
        uint8 _betType;
        uint256 _amount;
    }
    
    mapping (address => Bet) public _betInfo;
    
    constructor() public {
        _houseAddress = msg.sender; 
        _totalBetAmount = 0;
        _totalBear = 0;
        _totalBull = 0;
        _amountBear = 0;
        _amountBull = 0;
    }
    
    
    function purchaseBet(uint8 _type, uint256 _betAmount) public payable {
        require(msg.sender != _houseAddress);
        require(_type==1 || _type==2);
        
        _betInfo[msg.sender]._betType = _type;
        _betInfo[msg.sender]._amount = _betAmount;
        
        _totalBetAmount += _betAmount;
        
        if(_type == 1) {
            _totalBear++;
            _amountBear += _betAmount;
        }
        else {
            _totalBull++; 
            _amountBull += _betAmount;
        }

        
        _betsArray.push(msg.sender);
    }
    
    function payWinnigBets(uint8 _winningType) public payable {
         require(_winningType==1 || _winningType==2);
         address payable _tempAddress;
         uint256 _ethForWinners;
         uint256 _ethCoefficient;
        
        //10% for the house
        if(_winningType == 1) {
            uint256 _ethForHouse;
            _ethForHouse += (_amountBull * 10) / 100;
            address(_houseAddress).transfer(_ethForHouse);
            _totalBetAmount -= _ethForHouse;
            _ethCoefficient = _totalBetAmount / _totalBear;
        } 
        else {
            uint256 _ethForHouse;
            _ethForHouse += (_amountBear * 10) / 100;
            address(_houseAddress).transfer(_ethForHouse);
            _totalBetAmount -= _ethForHouse;
             _ethCoefficient = _totalBetAmount / _totalBull;
        }
  
        
        for(uint256 i=0; i<_betsArray.length; i++) {
            _tempAddress = _betsArray[i];
            if(_betInfo[_tempAddress]._betType == _winningType) {
                _ethForWinners = _betInfo[_tempAddress]._amount * _ethCoefficient;
                _betsArray[i].transfer(_ethForWinners);
            }
        }
        
        _betsArray.length = 0;
        _totalBetAmount = 0;
        
    }
}