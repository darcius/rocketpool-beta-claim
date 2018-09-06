import { printTitle, assertThrows, printEvent, soliditySha3, TimeController } from './utils';
import { scenarioSetClaimStart, scenarioSetRplTotal, scenarioAddParticipant, scenarioAddParticipants, scenarioRemoveParticipant, scenarioClaimRpl, scenarioClose } from './rocket-beta-claim-scenarios';

// Import artifacts
const DummyRocketPoolToken = artifacts.require('./contract/DummyRocketPoolToken.sol');
const RocketBetaClaim = artifacts.require('./contract/RocketBetaClaim.sol');


// Debug participant list
async function debugParticipants() {
    const rocketBetaClaim = await RocketBetaClaim.deployed();

    // Get count
    let count = parseInt(await rocketBetaClaim.getParticipantCount.call());

    // Get and log participants
    console.log('-----');
    let participant, pi;
    for (pi = 0; pi < count; ++pi) {
        participant = await rocketBetaClaim.getParticipantAddress.call(pi);
        console.log(`participant ${pi}:`, participant);
    }
    console.log('-----');

}


// Participants
// Approx. 84 participants can be added per tx within the 8 million block gas limit
const participantAddresses = [
    "0xbA8c8b04845822C5455Ef64A3618a13aB186cEf1",
    "0x7E466a2bDC19481C634aFB93658c0449CA49870B",
    "0xB6C242A3FcED198213182E2A079A6C1981e8291A",
    "0xad007939a1e3e4f6b1D2f1130FE5Ef61eA851bCa",
    "0xB7738da0d90D4c17d77773fbF519F3D89Db97674",
    "0xC8c9DD7Cd609AaaB116e4C6e0DE251Ad48b9D72d",
    "0xcb08161f1180163E81840410110464f977Cdc6f4",
    "0x174E44329D505C73a41beFD80aC44539A7C6b81c",
    "0x0cfb3a5280c8a24F04C91B282b0874E51E4b9Db7",
    "0x5c38122F3D42a395DeB90E7c3073d392D360D4db",
    "0x46Fcb8D47A767E2A97420249e840a2D9dEeE3d65",
    "0x0edb39cb15f738D26B9b250Da6aec2e044ACeBA5",
    "0x7d97958e57370bb90f38eF0450e46CA995a1969F",
    "0x795d67ea0dfDd28753827608c4C33D50CeB7A74D",
    "0x4d30a3CD1c738Cf64101e699bB19F4f2d96DC24B",
    "0x5b3dcbDA112fE0B00fC3Ce1eEF54205b76998bC2",
    "0xD03614C920A0C334b842320999398e1387791Bf8",
    "0xa75f64112c73CaB70A0175650d937eba11560096",
    "0x7ff8b020C2eCD40613063Ae1D2ee6A2A383793fA",
    "0x55229F6ae9A9AFC419064C3D5e48Ec26Ff4e7e08",
    "0x617096ec92315d6A23a5ebDCf4f1Fc3A8C59E5d5",
    "0x9C93269bF5d6186B3c6705bb36DD62a192E06fBC",
    "0x2d1ae69bED2AC9cbC72C7b63DD36110A806c1013",
    "0x9f245f75b8Ca5914563aE228BbfccF015fb058ef",
    "0x893E8DDEF046F42Df15541009a2ef885f542024C",
    "0xB20C2d3611f04d5D0BF36516a20118c4689FDBDa",
    "0x00115a05aaeAB5a58b478694d74505e480dC1DB2",
    "0xDc94EEeb3260D0b9Bf22849E8f5d236D286CDBa1",
    "0x24Dd242c3c4061b1fCaA5119af608B56afBaEA95",
    "0x63F0d1765160213d65dDB1b1F566c9e87c4C820F",
    "0x1F452E4C49b1af55c08a5237b18E0Cd2D1e1bd85",
    "0xa3E5bA599A34C89Ac64495055dd6218291e12966",
    "0xdE2B7103a2eD2B31dBbbCeBdBaD2387e228defaF",
    "0x3d3EE9a37371394E0b2f00ec625D65d4c361b99d",
    "0x447F4aC0ea7d6378149Ef1AAC7c48572889228ce",
    "0x19762ceB4FF16D9AA7f055Ce55351fEe5EC036A5",
    "0xe6dC7254dc531a1dc098282071988F0F6B0b678f",
    "0x9240D4B5B51Fe17091D74E8BB5BE6655eAAb794B",
    "0xD28f17E3420D730cdd670A4f876A5744313Da4A6",
    "0x481f577d66A2363894E617Eeae19537fD78bc607",
    "0x435c56103453FF5BD93da293309f01AB72B05bf2",
    "0x843Ddbe1b926B756282972340459839556970994",
    "0x4f3a36C91c392781536348C03DFB8F6e265c277D",
    "0x37d185B2997fE7944D0038ad523C9f491e7fa05b",
    "0x9b74b0cC0722e53b780f2193F4C5710B0e5a2E6a",
    "0x713CA86AF3dA0A0474B01A3e0ce0d6DB00cAe99e",
    "0xf317B7C18e63E23fd61b04C9F874F1fEa791678b",
    "0x81659EcF1eF9755e9477Bb892E0b1aC6D1dFbF32",
    "0xfF3BC837783E1C9eA1A15F0aB2896369FdE9f864",
    "0x31c906774Fa676fE97F615C3D5aFea8AEC72Bf78",
    "0x31D04A32F22022Ec66AfE6C2351db768ed32B873",
    "0xDbEaB1A7fe2Fe907FcC0bF3801720836cAb8e5e8",
    "0xBe746B3639af3d3f3a743318F11cE4073e71f42D",
    "0x12a1881bf7866AF3F48181d311DA18888405B035",
    "0xa4932280B37de5fceC32232fB378Cbb24275E8f8",
    "0x0EB22A777EE381DDb6eDCE6f410B84b6A20E87F1",
    "0x99045F200D3503D9D4B20D42A927a8E24Abb53dc",
    "0x10594B019de165B051c2dD99ED484DC9DAA20005",
    "0x853e9248F44625C88975B63293b109907150A745",
    "0x8ae9b4C2642c293f799c90C683B343fDC9915C30",
    "0x545eDeb64fe0db0Da8Ca644C6f0c87ca32460b17",
    "0xDc7413Ac57fC482a042aD609CEc456f36CEEA7f9",
    "0x15703f1B4D9a015a5dAb2E9C8E5893E96B54404A",
    "0x917a51385A02c601929376Fc502Bd5c3f62F5972",
    "0xAF62015635296f595424499C76a7b66f86c9Fe6F",
    "0x4Cf20fC35098F2FfaC45a55320c5f8b1469f3F92",
    "0x2F6102a60813aF809C8dA5f46Ceb1D022dd718f2",
    "0xAA01650703e456819E46E6fC8FcaeaB6A99bB1c1",
    "0x1854340dB62Bf388B0E5673Bb77dc652CA860Ab3",
    "0x51B553a31Cf3027f9F5a212027Ac1717B21782B6",
    "0x71a9467319511C415D92EA57C9e3393A68f0BA09",
    "0x829b904fF5Df67009A82e6121afFecBfbDA94eE6",
    "0x8cC017BFc415DEC41c66B57B9b17b09dD4aaa2Ef",
    "0xf8a099545c0f2c3D3E547C048c2F5589e53B54d5",
    "0x5162c229c48ec8969090b299044da11c48d12A44",
    "0x0d48d845e4CBF226ad8A37E5300B7cBa1AABCd50",
    "0x1989D9a8A43710e6D0509aa3fd4dF7A8E8EF66ed",
    "0x6706E316E8a80A7E3B1fb4Cb8F8480415A4BAE37",
    "0x40D5Df884176d4797c79286736b79a59AaD31b57",
    "0xD1D9dbAd0B07C3ef5FA6167ec7522104dfb1568c",
    "0xEc08fF4bCbff14f16A3b10eC5Bbc2337c6889FC7",
    "0x8Ee4AED31E2141FEb3Ca3D9406BF15b2E9003FA7",
    "0xC668ca66F3D2ad264c4A1dbE8576f210abc1A4f3",
    "0xe86AB671e4b9446BA6EC072735af59912C13Dd7F",
    //"0x1927e08477Fd0A163ca16fe10d82F79A5c54eF41",
    //"0x98d977c8A1Df19637459eE3216E2c0728919E030",
    //"0xe5A16fB5e479378417f4b880AcC554ef87237977",
    //"0x869BbD92B6d45402A0ab448deB7533de519b9BD3",
    //"0x8B1fd6d01479b59AFD1b33E0de2d8A7A4d19cb73",
    //"0xFdf980F992999955603420b02070df4a97Efa651",
    //"0xDd92c357B43906539e3DEae39B573E0b969e69F2",
    //"0xE693b6179C5198D85083C832003D5f519709F86F",
    //"0x111AA7361287DCACFd9F9eC57FBebD6926FAeE64",
    //"0x912106cDa3a3D23a5DD5ED86FCba52aA0C0FE10b",
    //"0x14288773c9df9a1b669de2324187f678d7C1aB4B",
    //"0x4D2a2b14Bd984398862ac52D8824c571FeE291E1",
    //"0xd90A32d559fEF356edC78d3750EDFCA8666a57B3",
    //"0xB6A1B418816B34009470D2Cefb65B4e16039411A",
    //"0x057dC43Af6187a931E78a56b3293912A5b42e5Ec",
    //"0x3904d7DeBCE689933d4E10d245E714cBAdb50c0E",
    //"0x4421fd0794b43BFBd35848D55DC17a9f027F867F",
    //"0xb1072f0b2e2e626EB5f177B7e59f5897ECA086FF",
    //"0x25F67d88267B8d0CfC2Ca31F54ca5F1895ea414f",
    //"0x4b82c89A275199b2d1F4d9bF31B7fCf602C5278C",
    //"0x398da2455431a5de959b25aeF85BAdcA5e394313",
    //"0x34cb604C1B81bdBf6750FaE80022Edf32ff8b298",
    //"0x7641e3e15E6121e87261C4Fd5a6b740C7FE716b6",
    //"0x12b65a6296f03a5A984a818664Ec98aB20bA4DE6",
    //"0xcbf6aA3d6e0AF25e1FA369f465319D2C20fabab4",
    //"0x53768Dac7e840Adf99b9dEb50c5f75e47C8E1876",
    //"0xB1204e2C6B18F2aE0b1F8A53056D7C6EE36247A3",
    //"0x34DA74CE40b5D994B680B585745B35E7D6797719",
    //"0x7A7560269758b80289eeFEef8106571198c40f6d",
    //"0x745cDd429D461033F04D68211443E8be7a8d6231",
    //"0x9a207B80e5b387263Da351D637eE2EEa67125f95",
    //"0x3833D757b8BC418bCec546ced8f444bF7bDfEc33",
    //"0xa7068a061645726c5ffF736e5d43752f4dB38E59",
    //"0xf5Ebcc8bf104ab9778C9Fa4488E06015dB9A0c44",
    //"0xBcDfb1426BA8B4B14F79e9bEa0A267be31a7210E",
    //"0x0DAa6D93859338c99B5B2D473943F39Ac339e5BE",
    //"0xC51Fcbad60CF20d4FBf25ba2F9CdA8734cbe25D6",
    //"0x7c3742b575F2D1F3d0325Fd5690f3612b64175eD",
    //"0xd9BBb9cac6a3aF74dF4C553885aAF213f9822AF0",
    //"0xB6CBc8852e6f9F2C24ec53992628ccf9a351F438",
    //"0xb9Ff1AE8BB3Edcc831C784DeeEd73dD45C1A5b8d",
    //"0x9CB70d46265E586f6e20aBF445672CA6f984Ec36",
    //"0xbc5dC38E5e78E985700C52068417c3c441aeEBbA",
    //"0x2Ad9764d3F704D71385a61155d07B406C5916989",
];


// Start the tests
contract('RocketBetaClaim', (accounts) => {


    // The owner
    const owner = web3.eth.coinbase;

    // Participant accounts
    const participant1 = accounts[1];
    const participant2 = accounts[2];
    const participant3 = accounts[3];
    const participant4 = accounts[4];

    // Claim start time delay
    const day = (60 * 60 * 24); // seconds
    const claimStartDelay = (day * 7 * 3); // seconds

    // Contract dependencies
    let rocketBetaClaim;
    let dummyRocketPoolToken;


    // Initialisation
    before(async () => {

        // Initialise contracts
        rocketBetaClaim = await RocketBetaClaim.deployed();
        dummyRocketPoolToken = await DummyRocketPoolToken.deployed();

        // Initialise dummy rocket pool token supply
        let tokenSupply = web3.toWei('500', 'ether');
        await dummyRocketPoolToken.mint(owner, tokenSupply, {from: owner});
        await dummyRocketPoolToken.transfer(rocketBetaClaim.address, tokenSupply, {from: owner});

    });


    //
    // Before claim period
    //


    // Owner can set the claim start time
    it(printTitle('owner', 'can set the claim start time'), async () => {

        // Get claim start time, 3 weeks in future
        let now = Math.floor((new Date()).getTime() / 1000);
        let start = now + claimStartDelay;

        // Set claim start time
        await scenarioSetClaimStart({
            claimStart: start,
            fromAddress: owner,
        });

    });


    // Random account cannot set the claim start time
    it(printTitle('random account', 'cannot set the claim start time'), async () => {

        // Get claim start time, 3 weeks in future
        let now = Math.floor((new Date()).getTime() / 1000);
        let start = now + (60 * 60 * 24 * 7 * 3);

        // Set claim start time
        await assertThrows(scenarioSetClaimStart({
            claimStart: start,
            fromAddress: accounts[1],
        }), 'Random account set the claim start time.');

    });


    // Owner can set the RPL total claimable
    it(printTitle('owner', 'can set the RPL total claimable'), async () => {

        // Get the claim contract's RPL balance
        let claimRplBalance = parseInt(await dummyRocketPoolToken.balanceOf(rocketBetaClaim.address));

        // Set RPL total claimable
        await scenarioSetRplTotal({
            rplTotal: claimRplBalance,
            fromAddress: owner,
        });

    });


    // Owner cannot set the RPL total claimable higher than the beta claim's RPL balance
    it(printTitle('owner', 'cannot set the RPL total claimable higher than the beta claim\'s RPL balance'), async () => {

        // Get the claim contract's RPL balance
        let claimRplBalance = parseInt(await dummyRocketPoolToken.balanceOf(rocketBetaClaim.address));

        // Set RPL total claimable
        await assertThrows(scenarioSetRplTotal({
            rplTotal: claimRplBalance + parseInt(web3.toWei('1', 'ether')),
            fromAddress: owner,
        }), 'Owner set the RPL total claimable higher than the beta claim\'s RPL balance.');

    });


    // Random account cannot set the RPL total claimable
    it(printTitle('random account', 'cannot set the RPL total claimable'), async () => {

        // Get the claim contract's RPL balance
        let claimRplBalance = parseInt(await dummyRocketPoolToken.balanceOf(rocketBetaClaim.address));

        // Set RPL total claimable
        await assertThrows(scenarioSetRplTotal({
            rplTotal: claimRplBalance,
            fromAddress: accounts[1],
        }), 'Random account set the RPL total claimable.');

    });


    // Owner can add a participant
    it(printTitle('owner', 'can add a participant'), async () => {

        // Add multiple participants
        await scenarioAddParticipants({
            participantAddresses: participantAddresses,
            fromAddress: owner,
        });

        // Add single participants
        await scenarioAddParticipant({
            participantAddress: participant1,
            fromAddress: owner,
        });
        await scenarioAddParticipant({
            participantAddress: participant2,
            fromAddress: owner,
        });

    });


    // Owner cannot add a participant with a null address
    it(printTitle('owner', 'cannot add a participant with a null address'), async () => {

        // Add multiple participants
        await assertThrows(scenarioAddParticipants({
            participantAddresses: [
                '0x0000000000000000000000000000000000000000',
                participant3,
            ],
            fromAddress: owner,
        }), 'Owner added a participant with a null address.');

        // Add single participant
        await assertThrows(scenarioAddParticipant({
            participantAddress: '0x0000000000000000000000000000000000000000',
            fromAddress: owner,
        }), 'Owner added a participant with a null address.');

    });


    // Owner cannot add a participant who already exists
    it(printTitle('owner', 'cannot add a participant who already exists'), async () => {

        // Add multiple participants - with existing participant
        await assertThrows(scenarioAddParticipants({
            participantAddresses: [
                participant1,
                participant3,
            ],
            fromAddress: owner,
        }), 'Owner added a participant who already exists.');

        // Add multiple participants - with duplicate participant
        await assertThrows(scenarioAddParticipants({
            participantAddresses: [
                participant3,
                participant3,
            ],
            fromAddress: owner,
        }), 'Owner added a participant who already exists.');

        // Add single participant
        await assertThrows(scenarioAddParticipant({
            participantAddress: participant1,
            fromAddress: owner,
        }), 'Owner added a participant who already exists.');

    });


    // Random account cannot add a participant
    it(printTitle('random account', 'cannot add a participant'), async () => {

        // Add multiple participants
        await assertThrows(scenarioAddParticipants({
            participantAddresses: [
                participant3,
                participant4,
            ],
            fromAddress: accounts[1],
        }), 'Random account added a participant.');

        // Add single participant
        await assertThrows(scenarioAddParticipant({
            participantAddress: participant3,
            fromAddress: accounts[1],
        }), 'Random account added a participant.');

    });


    // Owner can remove a participant
    it(printTitle('owner', 'can remove a participant'), async () => {

        // Participant count
        let count;

        // Remove from middle of list
        count = parseInt(await rocketBetaClaim.getParticipantCount.call());
        let remove1 = await rocketBetaClaim.getParticipantAddress.call(Math.floor((count - 1) / 2));
        await scenarioRemoveParticipant({
            participantAddress: remove1,
            fromAddress: owner,
        });

        // Remove from end of list
        count = parseInt(await rocketBetaClaim.getParticipantCount.call());
        let remove2 = await rocketBetaClaim.getParticipantAddress.call(count - 1);
        await scenarioRemoveParticipant({
            participantAddress: remove2,
            fromAddress: owner,
        });

        // Remove from start of list
        let remove3 = await rocketBetaClaim.getParticipantAddress.call(0);
        await scenarioRemoveParticipant({
            participantAddress: remove3,
            fromAddress: owner,
        });

    });


    // Owner cannot remove a participant who doesn't exist
    it(printTitle('owner', 'cannot remove a participant who doesn\'t exist'), async () => {
        await assertThrows(scenarioRemoveParticipant({
            participantAddress: participant3,
            fromAddress: owner,
        }), 'Random account added a participant.');
    });


    // Random account cannot remove a participant
    it(printTitle('random account', 'cannot remove a participant'), async () => {

        // Get first participant
        let remove = await rocketBetaClaim.getParticipantAddress.call(0);

        // Remove
        await assertThrows(scenarioRemoveParticipant({
            participantAddress: remove,
            fromAddress: accounts[1],
        }), 'Random account removed a participant.');

    });


    // Owner can add a participant who was removed
    it(printTitle('owner', 'can add a participant who was removed'), async () => {

        // Remove participants if not removed
        const removeParticipants = async (addresses) => {
            for (let ai = 0; ai < addresses.length; ++ai) {
                let address = addresses[ai];
                let exists = await rocketBetaClaim.getParticipantExists.call(address);
                if (exists) await scenarioRemoveParticipant({
                    participantAddress: address,
                    fromAddress: owner,
                });
            }
        };

        // Remove participant1 and participant2
        await removeParticipants([participant1, participant2]);

        // Add multiple participants
        await scenarioAddParticipants({
            participantAddresses: [
                participant1,
                participant2,
            ],
            fromAddress: owner,
        });

        // Remove participant1 and participant2
        await removeParticipants([participant1, participant2]);

        // Add single participants
        await scenarioAddParticipant({
            participantAddress: participant1,
            fromAddress: owner,
        });
        await scenarioAddParticipant({
            participantAddress: participant2,
            fromAddress: owner,
        });

    });


    // Participant cannot claim RPL before claim start
    it(printTitle('participant', 'cannot claim RPL before claim start'), async () => {
        await assertThrows(scenarioClaimRpl({
            fromAddress: participant1,
        }), 'Participant claimed RPL before claim start.');
    });


    //
    // During claim period
    //


    // Advance to claim period
    it(printTitle('-----', 'advance to claim period'), async () => {
        await TimeController.addSeconds(claimStartDelay + day);
    });


    // Owner cannot set the claim start time after claim start
    it(printTitle('owner', 'cannot set the claim start time after claim start'), async () => {

        // Get claim start time, 3 weeks in future
        let now = Math.floor((new Date()).getTime() / 1000);
        let start = now + (60 * 60 * 24 * 7 * 3);

        // Set claim start time
        await assertThrows(scenarioSetClaimStart({
            claimStart: start,
            fromAddress: owner,
        }), 'Owner set the claim start time after claim start.');

    });


    // Owner cannot set the RPL total claimable after claim start
    it(printTitle('owner', 'cannot set the RPL total claimable after claim start'), async () => {

        // Get the claim contract's RPL balance
        let claimRplBalance = parseInt(await dummyRocketPoolToken.balanceOf(rocketBetaClaim.address));

        // Set RPL total claimable
        await assertThrows(scenarioSetRplTotal({
            rplTotal: claimRplBalance,
            fromAddress: owner,
        }), 'Owner set the RPL total claimable after claim start.');

    });


    // Owner cannot add a participant after claim start
    it(printTitle('owner', 'cannot add a participant after claim start'), async () => {

        // Add multiple participants
        await assertThrows(scenarioAddParticipants({
            participantAddresses: [
                participant3,
                participant4,
            ],
            fromAddress: owner,
        }), 'Owner added a participant after claim start.');

        // Add single participant
        await assertThrows(scenarioAddParticipant({
            participantAddress: participant3,
            fromAddress: owner,
        }), 'Owner added a participant after claim start.');

    });


    // Owner cannot remove a participant after claim start
    it(printTitle('owner', 'cannot remove a participant after claim start'), async () => {

        // Get first participant
        let remove = await rocketBetaClaim.getParticipantAddress.call(0);

        // Remove
        await assertThrows(scenarioRemoveParticipant({
            participantAddress: remove,
            fromAddress: owner,
        }), 'Owner removed a participant after claim start.');

    });


    // Participant can claim RPL
    it(printTitle('participant', 'can claim RPL'), async () => {
        await scenarioClaimRpl({
            fromAddress: participant1,
        });
    });


    // Participant cannot claim RPL twice
    it(printTitle('participant', 'cannot claim RPL twice'), async () => {
        await assertThrows(scenarioClaimRpl({
            fromAddress: participant1,
        }), 'Participant claimed RPL twice.');
    });


    // Random account cannot claim RPL
    it(printTitle('random account', 'cannot claim RPL'), async () => {
        await assertThrows(scenarioClaimRpl({
            fromAddress: accounts[9],
        }), 'Random account claimed RPL.');
    });


    // Owner cannot close the beta claim before claim end
    it(printTitle('owner', 'cannot close the beta claim before claim end'), async () => {
        await assertThrows(scenarioClose({
            fromAddress: owner,
        }), 'Owner closed the beta claim before claim end.');
    });


    //
    // After claim period
    //


    // Advance to after claim period
    it(printTitle('-----', 'advance to after claim period'), async () => {
        let claimPeriod = parseInt(await rocketBetaClaim.claimPeriod.call());
        await TimeController.addSeconds(claimPeriod);
    });


    // Random account cannot close the beta claim
    it(printTitle('random account', 'cannot close the beta claim'), async () => {
        await assertThrows(scenarioClose({
            fromAddress: accounts[1],
        }), 'Random account closed the beta claim.');
    });


    // Owner can close the beta claim
    it(printTitle('owner', 'can close the beta claim'), async () => {

        // Check for remaining RPL balance
        let rplBalance = parseInt(await dummyRocketPoolToken.balanceOf(rocketBetaClaim.address));
        assert.isAbove(rplBalance, 0, 'Pre-check failed - beta claim contract has no remaining RPL balance.');

        // Close
        await scenarioClose({
            fromAddress: owner,
        });

    });


    // Owner cannot close the beta claim twice
    it(printTitle('owner', 'cannot close the beta claim twice'), async () => {
        await assertThrows(scenarioClose({
            fromAddress: owner,
        }), 'Owner closed the beta claim twice.');
    });


    //
    // Closed
    //


    // Participant cannot claim RPL after the beta claim is closed
    it(printTitle('participant', 'cannot claim RPL after the beta claim is closed'), async () => {
        await assertThrows(scenarioClaimRpl({
            fromAddress: participant2,
        }), 'Participant claimed RPL after the beta claim closed.');
    });


});
