const ethers = require("ethers");
const abi = require("./abis/abi.json")
require("dotenv").config();

const poolAddress = "0x2C3C340233338D875637304B06f4F6fAf9BeBd20";
const provider = new ethers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/6e1cfdf691e144b1a7b06d0721433639");
const toTokenAddress = '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3'; // Target token contract address // DAI token address
const fromBlock = 1000000; // Starting block number
const toBlock = 30702396; // Ending block number 
const startTime = Math.floor(Date.parse('2023-08-01') / 1000); // Start timestamp
const endTime = Math.floor(Date.parse('2023-08-31') / 1000); // End timestamp

const poolContract = new ethers.Contract(poolAddress, abi, provider);

async function scanSwapEvents() {
  try {
    const eventTopic = ethers.utils.id('Swap(address,address,uint256,uint256)');
    const filter = {
      address: poolAddress,
      topics: [
        eventTopic,
        ethers.utils.hexZeroPad(toTokenAddress, 32), // To-token address
        null, // Amount in
        null, // Amount out
      ],
      fromBlock: fromBlock,
      toBlock: toBlock,
    };

    const swapEvents = await provider.getLogs(filter);

    const relevantSwaps = swapEvents.filter(event => {
      const eventTimestamp = event.blockTime;
      return eventTimestamp >= startTime && eventTimestamp <= endTime;
    });

    console.log(relevantSwaps);
  } catch (error) {
    console.error('Error:', error);
  }
}

scanSwapEvents();
