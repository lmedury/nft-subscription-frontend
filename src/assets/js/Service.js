
import algosdk from "algosdk";
import { FormatJson } from "./arc69format";
import Config from "./Config";
import Utility from "./Utility";
import { APPROVAL_PROGRAM } from "../teal/nft_subscription_approval";
import { CLEAR_PROGRAM } from "../teal/nft_subscription_clear_state";

const config = new Config();
const client = config.getClient();
const indexer = config.getIndexer();
const APP_ID = config.APP_ID;

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI.create('https://ipfs.infura.io:5001');

const AlgoService = {

    algoSendTxn: async(txns, txId) => {
        try{
            await client.sendRawTransaction(txns).do();
            const status = await algosdk.waitForConfirmation(client, txId, 1000);
            return {success: true, response: status};
        } catch(err) {
            return {success: false};
        }
    },

    compileProgram : async (program) => {
        const encoder = new TextEncoder();
        let programBytes = encoder.encode(program);
        let compileResponse = await client.compile(programBytes).do();
        return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
    },

    deployContractTransaction: async (address, tokenSymbol, tokenName, price, duration, description, image) => {
        const file = await ipfs.add(image);
        const json = FormatJson(tokenName, description, file.path);
        const hash = await ipfs.add(JSON.stringify(json));
        const assetUrl = hash.path;
        
        const txnParams = await client.getTransactionParams().do();
        const appArgs = [
            Utility.encodeBytes(tokenSymbol),
            Utility.encodeBytes(tokenName),
            Utility.encodeBytes(assetUrl),
            Utility.encodeInt(algosdk.algosToMicroalgos(price)),
            Utility.encodeInt(duration)
        ]
        return algosdk.makeApplicationCreateTxn(address, txnParams, algosdk.OnApplicationComplete.NoOpOC, await AlgoService.compileProgram(APPROVAL_PROGRAM), await AlgoService.compileProgram(CLEAR_PROGRAM), 4, 12, 6, 6, appArgs, [address]);
    },

    
}

export default AlgoService;

