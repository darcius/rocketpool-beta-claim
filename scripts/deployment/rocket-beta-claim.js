// Dependencies
const Web3 = require('web3');

// Contract data
const rocketBetaClaimAbi = JSON.parse('[{"constant":false,"inputs":[{"name":"_rplTotal","type":"uint256"}],"name":"setRplTotal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_participant","type":"address"}],"name":"getParticipantClaimed","outputs":[{"name":"claimed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"claimEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"close","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"closed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addressList","type":"address[]"}],"name":"addParticipants","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getParticipantAddress","outputs":[{"name":"account","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"address"}],"name":"removeParticipant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getClaimAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claimRpl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"claimPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getParticipantCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_claimStart","type":"uint256"}],"name":"setClaimStart","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"claimStartDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rplTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"address"}],"name":"addParticipant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_participant","type":"address"}],"name":"getParticipantExists","outputs":[{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"claimStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_tokenAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"created","type":"uint256"}],"name":"Withdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"balanceSentTo","type":"address"},{"indexed":false,"name":"balance","type":"uint256"},{"indexed":false,"name":"created","type":"uint256"}],"name":"Close","type":"event"}]');
const rocketBetaClaimBytecode = '60806040526004805460ff1916905560078054600160a060020a031916905534801561002a57600080fd5b50604051602080610e6e833981016040525160008054600160a060020a031990811633179091554262127500810160025562375f000160035560078054600160a060020a0390931692909116919091179055610de38061008b6000396000f3006080604052600436106101065763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632896ef0f811461010b5780633106bc9e146101255780633ccfa92f1461015a57806343d726d614610181578063597e1fb5146101965780635b4ccc9d146101ab578063635c06f214610200578063668a20011461023457806371127ed214610255578063724de9be1461026a5780637dc2cd981461027f5780638da5cb5b14610294578063ad605729146102a9578063b0aa1e04146102be578063b17193da146102d6578063d6362189146102eb578063dfafe10f14610300578063e07fc2f314610321578063f04d688f14610342575b600080fd5b34801561011757600080fd5b50610123600435610357565b005b34801561013157600080fd5b50610146600160a060020a0360043516610424565b604080519115158252519081900360200190f35b34801561016657600080fd5b5061016f61044e565b60408051918252519081900360200190f35b34801561018d57600080fd5b50610123610454565b3480156101a257600080fd5b50610146610631565b3480156101b757600080fd5b50604080516020600480358082013583810280860185019096528085526101239536959394602494938501929182918501908490808284375094975061063a9650505050505050565b34801561020c57600080fd5b5061021860043561083c565b60408051600160a060020a039092168252519081900360200190f35b34801561024057600080fd5b50610123600160a060020a0360043516610868565b34801561026157600080fd5b5061016f6109eb565b34801561027657600080fd5b50610123610a15565b34801561028b57600080fd5b5061016f610ba0565b3480156102a057600080fd5b50610218610ba7565b3480156102b557600080fd5b5061016f610bb6565b3480156102ca57600080fd5b50610123600435610bbc565b3480156102e257600080fd5b5061016f610bf0565b3480156102f757600080fd5b5061016f610bf7565b34801561030c57600080fd5b50610123600160a060020a0360043516610bfd565b34801561032d57600080fd5b50610146600160a060020a0360043516610d44565b34801561034e57600080fd5b5061016f610d6a565b60008054600160a060020a0316331461036f57600080fd5b600254421061037d57600080fd5b600754604080517f70a082310000000000000000000000000000000000000000000000000000000081523060048201529051600160a060020a03909216916370a08231916024808201926020929091908290030181600087803b1580156103e357600080fd5b505af11580156103f7573d6000803e3d6000fd5b505050506040513d602081101561040d57600080fd5b505190508082111561041e57600080fd5b50600155565b600160a060020a031660009081526005602052604090205460a060020a900460ff16151560011490565b60035481565b60008054600160a060020a0316331461046c57600080fd5b60035442101561047b57600080fd5b60045460ff161561048b57600080fd5b600754604080517f70a082310000000000000000000000000000000000000000000000000000000081523060048201529051600160a060020a03909216916370a08231916024808201926020929091908290030181600087803b1580156104f157600080fd5b505af1158015610505573d6000803e3d6000fd5b505050506040513d602081101561051b57600080fd5b5051905060008111156105d85760075460008054604080517fa9059cbb000000000000000000000000000000000000000000000000000000008152600160a060020a039283166004820152602481018690529051919093169263a9059cbb9260448083019360209390929083900390910190829087803b15801561059e57600080fd5b505af11580156105b2573d6000803e3d6000fd5b505050506040513d60208110156105c857600080fd5b505115156001146105d857600080fd5b6004805460ff19166001179055600054604080518381524260208201528151600160a060020a03909316927f9d801553d397b8274b513890b6fc73f1a5edcf9ab99ee408d64b6e36889433e0929181900390910190a250565b60045460ff1681565b60008054600160a060020a0316331461065257600080fd5b600254421061066057600080fd5b5060005b815181101561083857818181518110151561067b57fe5b60209081029091010151600160a060020a0316151561069957600080fd5b6005600083838151811015156106ab57fe5b6020908102909101810151600160a060020a031682528101919091526040016000206002015460ff16156106de57600080fd5b60806040519081016040528083838151811015156106f857fe5b90602001906020020151600160a060020a0316815260200160001515815260200160068054905081526020016001151581525060056000848481518110151561073d57fe5b602090810291909101810151600160a060020a039081168352828201939093526040918201600020845181549286015173ffffffffffffffffffffffffffffffffffffffff1990931694169390931774ff0000000000000000000000000000000000000000191660a060020a9115159190910217825582015160018201556060909101516002909101805460ff191691151591909117905581516006908390839081106107e657fe5b602090810291909101810151825460018082018555600094855292909320909201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039093169290921790915501610664565b5050565b600060068281548110151561084d57fe5b600091825260209091200154600160a060020a031692915050565b6000805481908190600160a060020a0316331461088457600080fd5b600254421061089257600080fd5b600160a060020a03841660009081526005602052604090206002015460ff1615156001146108bf57600080fd5b600160a060020a038416600090815260056020526040902060010154600680549194506000198201935090839081106108f457fe5b600091825260209091200154600160a060020a0316905082821461098a57600160a060020a03808216600090815260056020526040902054600680549190921691908590811061094057fe5b6000918252602080832091909101805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0394851617905591831681526005909152604090206001018390555b600160a060020a0384166000908152600560205260408120805474ffffffffffffffffffffffffffffffffffffffffff191681556001810191909155600201805460ff191690556006805460001901906109e49082610d70565b5050505050565b60065460009015156109ff57506000610a12565b600654600154811515610a0e57fe5b0490505b90565b3360009081526005602052604081206002015460ff161515600114610a3957600080fd5b600254421015610a4857600080fd5b60045460ff1615610a5857600080fd5b3360009081526005602052604090205460a060020a900460ff1615610a7c57600080fd5b610a846109eb565b600754604080517fa9059cbb000000000000000000000000000000000000000000000000000000008152336004820152602481018490529051929350600160a060020a039091169163a9059cbb916044808201926020929091908290030181600087803b158015610af457600080fd5b505af1158015610b08573d6000803e3d6000fd5b505050506040513d6020811015610b1e57600080fd5b50511515600114610b2e57600080fd5b33600081815260056020908152604091829020805474ff0000000000000000000000000000000000000000191660a060020a1790558151848152429181019190915281517fdf273cb619d95419a9cd0ec88123a0538c85064229baa6363788f743fff90deb929181900390910190a250565b6224ea0081565b600054600160a060020a031681565b60065490565b600054600160a060020a03163314610bd357600080fd5b6002544210610be157600080fd5b60028190556224ea0001600355565b6212750081565b60015481565b600054600160a060020a03163314610c1457600080fd5b6002544210610c2257600080fd5b600160a060020a0381161515610c3757600080fd5b600160a060020a03811660009081526005602052604090206002015460ff1615610c6057600080fd5b60408051608081018252600160a060020a0392831680825260006020808401828152600680548688019081526001606088018181528787526005909552978520965187549351151560a060020a0274ff00000000000000000000000000000000000000001991909a1673ffffffffffffffffffffffffffffffffffffffff19948516171698909817865596518587015590516002909401805494151560ff199095169490941790935584549384018555939093527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f90910180549091169091179055565b600160a060020a031660009081526005602052604090206002015460ff16151560011490565b60025481565b815481835581811115610d9457600083815260209020610d94918101908301610d99565b505050565b610a1291905b80821115610db35760008155600101610d9f565b50905600a165627a7a7230582044540de1037888f42da306d3161fb3db65c13cb653a0cad3ba3dc9ec49edbd720029';

// Parameters
const web3Url = 'https://mainnet.infura.io/v3/d690a0156a994dd785c0a64423586f52';
const rplTokenAddress = '0xb4efd85c19999d84251304bda99e90b92300bd93';

// Connect
const web3 = new Web3(web3Url);

// Initialise contract
const rocketBetaClaim = new web3.eth.Contract(rocketBetaClaimAbi);

// Create deployment transaction
let deployTx = rocketBetaClaim.deploy({
	data: rocketBetaClaimBytecode,
	arguments: [rplTokenAddress],
});

// Log transaction data
console.log(deployTx.encodeABI());
