
import algosdk from "algosdk";
import { FormatJson } from "./arc69format";
import Config from "./Config";
import Utility from "./Utility";
import { APPROVAL_PROGRAM } from "../teal/nft_subscription_approval";
import { CLEAR_PROGRAM } from "../teal/nft_subscription_clear_state";
import { APPS, IPFS_URL } from "./constants";

const config = new Config();
const client = config.getClient();
const indexer = config.getIndexer();

const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI.create('https://ipfs.infura.io:5001');

const AlgoService = {

    algoSendTxn: async(txns, txId) => {
        try{
            await client.sendRawTransaction(txns).do();
            const status = await algosdk.waitForConfirmation(client, txId, 1000);
            return {success: true, response: status};
        } catch(err) {
            console.log(err);
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

    getSubscriptions: async () => {
        const subscriptions = []
        for(let i=0; i<APPS.length; i++) {
            const app = await AlgoService.getGlobalState(APPS[i]);
            subscriptions.push(app);
        }
        return subscriptions;
    },

    getGlobalState: async (appId) => {
        const app = {}
        let details = await indexer.lookupApplications(appId).do();
        details = details.application.params["global-state"];
        app.id = appId;
        app.state = Utility.decodeKvPairs(details);
        return app;
    },

    optin: async (address, appId) => {
        const params = await client.getTransactionParams().do();
        return algosdk.makeApplicationOptInTxn(address, params, appId);
    },

    prepareSubscriptionTxns: async(appId, sender, receiver, amount, duration) => {
        
        const params = await client.getTransactionParams().do();
        const txn1 = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, params);
        const appArgs = [
            Utility.encodeBytes('subscribe'),
            Utility.encodeInt(duration)
        ];
        const txn2 = algosdk.makeApplicationNoOpTxn(sender, params, appId, appArgs);
        const groupTxns = [txn1, txn2];
        algosdk.assignGroupID(groupTxns);
        return groupTxns;
    },

    optinToAsset : async(address, appId) => {
        const assetId = await AlgoService.getAssetId(address, appId);
        const params = await client.getTransactionParams().do();
        return algosdk.makeAssetTransferTxnWithSuggestedParams(address, address, undefined, undefined, 0, undefined, assetId, params);
    },

    acceptNFTTransaction: async (address, appId) => {
        const assetId = await AlgoService.getAssetId(address, appId);
        const params = await client.getTransactionParams().do();
        return algosdk.makeApplicationNoOpTxn(address, params, appId, [Utility.encodeBytes('accept_nft')], undefined, undefined, [assetId]);
    },

    getAssetId: async(address, appId) => {
        const accountInfo = await indexer.lookupAccountByID(address).do();
        const apps = accountInfo.account['apps-local-state'];
        const currentApp = apps.filter(app => app.id === appId)[0];
        const kvPairs = Utility.decodeKvPairs(currentApp['key-value']);
        return kvPairs['asset_id'];
    },

    getMySubscriptions : async (address) => {
        const accountInfo = await indexer.lookupAccountByID(address).do();
        const assets = accountInfo.account['assets'].map(asset => asset['asset-id']);
        const assetCreators = [];
        for(let i in assets){
            const info = await indexer.lookupAssetByID(assets[i]).do();
            assetCreators.push(info.asset.params.manager);
        }
        const apps = accountInfo.account['apps-local-state'];
        const appsOptedIn = apps.map(app => app.id);
        const escrowAddresses = appsOptedIn.map(app => algosdk.getApplicationAddress(app));
        const ownedAssets = [];
        const subscriptions = [];
        for(let i in assetCreators) {
            if(escrowAddresses.includes(assetCreators[i])){
                const details = {};
                details.asset = assets[i];
                details.app = appsOptedIn[i];
                ownedAssets.push(details);
            }
        }
        for(let i in ownedAssets) {
            const details = {};
            const info = await indexer.lookupAssetByID(ownedAssets[i].asset).do();
            const params = info.asset.params;
            details.app = ownedAssets[i].app;
            let assetInfo = await fetch(`${IPFS_URL}/${params.url}`);
            assetInfo = await assetInfo.json();
            params.assetInfo = assetInfo
            details.asset = params;
            subscriptions.push(details)
        }
        return subscriptions;
    },    
}

export default AlgoService;

