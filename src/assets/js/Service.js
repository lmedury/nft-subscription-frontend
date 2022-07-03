
import algosdk from "algosdk";
import Config from "./Config";
import constants from "./constants";

const config = new Config();
const client = config.getClient();
const indexer = config.getIndexer();
const APP_ID = config.APP_ID;

class AlgoService {

    static async generateLsig(name) {
        let program = await client.compile(config.getTeal(name)).do();
        program = new Uint8Array(Buffer.from(program.result, "base64"));
        const lsig = algosdk.makeLogicSig(program);
        return lsig;
    }

    static async searchForName(name) {
    
        name = name.split('.algo')[0];
        name = name.toLowerCase();
        

        try {
            const lsig = await AlgoService.generateLsig(name);
            let accountInfo = await indexer.lookupAccountByID(lsig.address()).do();
            accountInfo = accountInfo.account['apps-local-state'];

            const length = accountInfo.length;
            let owner, domainValue;
            let found=false;
            let data=[];
            for (let i = 0; i < length; i++) {
                let app = accountInfo[i];
                if (app.id === APP_ID) {
                    let kv = app['key-value'];
                    let kvLength = kv.length;

                    for (let j = 0; j < kvLength; j++) {
                        let key = atob(kv[j].key);
                        let value;
                        if(key === 'expiry') {
                            value = kv[j].value.uint;
                            value = new Date(value*1000).toString()
                        }
                        else if(key === 'transfer_price') {
                            value = kv[j].value.uint;
                        } 
                        else if(key === 'default_account') {
                            value = kv[j].value.uint;
                        }
                        else if(key === 'transfer_to') {
                            value = kv[j].value.bytes;
                            if(value!== "") value = (algosdk.encodeAddress(new Uint8Array(Buffer.from(value, 'base64'))));
                        }
                        else value = atob(kv[j].value.bytes);
                        let kvObj = {
                            key: key,
                            value: value
                        }
                        data.push(kvObj)

                        if (key === 'owner') {
                            value = kv[j].value.bytes;
                            value = (algosdk.encodeAddress(new Uint8Array(Buffer.from(value, 'base64'))));
                            owner = value;
                            found=true;
                            
                        }

                        if(key === 'value' || key === 'account') {
                            value = kv[j].value.bytes;
                            value = (algosdk.encodeAddress(new Uint8Array(Buffer.from(value, 'base64'))));
                            domainValue = value;
                        }
                    }
                }
            }

            if(found) {
                return ({ found: true, address: owner, kvPairs: data, value: domainValue })
            }
            else return ({ found: false });

        } catch (err) {
            return ({ found: false });
        }
        
    }

    static async createGroupTxnsToSign(name, address, period) {
        
        const algodClient = client;
        let amount;
        const lsig = await AlgoService.generateLsig(name);
        const params = await algodClient.getTransactionParams().do();

        params.fee = 1000;
        params.flatFee = true;

        let receiver = algosdk.getApplicationAddress(APP_ID);
        let sender = address;

        if(period === undefined) period = 0
        else period = period-1

        if (name.length < 3) return;
        else if (name.length === 3) amount = constants.CHAR_3_AMOUNT + period*constants.CHAR_3_AMOUNT
        else if (name.length === 4) amount = constants.CHAR_4_AMOUNT + period*constants.CHAR_4_AMOUNT
        else if (name.length >= 5) amount = constants.CHAR_5_AMOUNT + period*constants.CHAR_5_AMOUNT

        let closeToRemaninder = undefined;
        let note = undefined;

        let txn1 = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, closeToRemaninder, note, params);

        const groupTxns = [];
        groupTxns.push(txn1);

        sender = address;
        receiver = lsig.address();
        amount = 915000;

        let txn2 = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, closeToRemaninder, note, params);

        groupTxns.push(txn2);

        let txn3 = await algosdk.makeApplicationOptInTxnFromObject({
            from: lsig.address(),
            suggestedParams: params,
            appIndex: APP_ID
        });

        groupTxns.push(txn3);

        sender = lsig.address();
        receiver = address;
        amount = 0;

        let method = "register_name";
        
        let appArgs = [];

        period = period+1

        appArgs.push(new Uint8Array(Buffer.from(method)));
        appArgs.push(new Uint8Array(Buffer.from(name)))
        appArgs.push(algosdk.encodeUint64(period))
        let txn4 = await algosdk.makeApplicationNoOpTxn(address, params, APP_ID, appArgs, [lsig.address()]);
        groupTxns.push(txn4);

        algosdk.assignGroupID(groupTxns);

        let signedOptinTxn = algosdk.signLogicSigTransaction(groupTxns[2], lsig);

        return ({ optinTxn: signedOptinTxn, txns: groupTxns, unsignedOptinTxn: groupTxns[2] });

    }

    
    static async updateName(name, address, editedHandles) {

        const algodClient = client;
        const lsig = await AlgoService.generateLsig(name);
        const params = await algodClient.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;

        let method = "update_name";

        const groupTxns = [];

        for(let key in editedHandles) {
        
            let appArgs=[];
            let network = key;
            let handle = editedHandles[key];
            
            appArgs.push(new Uint8Array(Buffer.from(method)));
            appArgs.push(new Uint8Array(Buffer.from(network)));
            appArgs.push(new Uint8Array(Buffer.from(handle)));

            let txn = await algosdk.makeApplicationNoOpTxn(address, params, APP_ID, appArgs, [lsig.address()]);
            groupTxns.push(txn);
        }

        return groupTxns;

    }

    static async algoSendTxn(signedTxn, txId) {
        
        try {
            await client.sendRawTransaction(signedTxn).do();
            try{
                if(txId) await algosdk.waitForConfirmation(client, txId);
            } catch (err) {
                
            } finally {
                return {success:true};
            }
            
            
        } catch (err) {
            return {succes:false, err:err.message};
        }

    }

    static async getDomainsOwnedByAccount(account) {
        
        let nextToken = '';
        let txnLength = 1;
        let txns = [];
        
        while(txnLength > 0){
            try{
                let info = await indexer.searchForTransactions()
                        .address(account)
                        .addressRole("sender")
                        .afterTime("2022-02-24")
                        .txType("appl")
                        .applicationID(APP_ID)
                        .nextToken(nextToken).do();

                txnLength=info.transactions.length;
                if(txnLength > 0) {
                    
                    nextToken = info["next-token"];
                    txns.push(info.transactions);
                }
                
            }catch(err){
                
                return false;
            }
        }
        
        let accountTxns = [];
        for(let i=0; i<txns.length; i++){
            accountTxns=accountTxns.concat(txns[i]);
        }
        
        txns = accountTxns;
        
        const names = [];
        
        try{
     
            for(let i=0; i<txns.length; i++) {
                let txn= txns[i];

                if(txn["tx-type"] === "appl") {
                    
                    if(txn["application-transaction"]["application-id"] === APP_ID) {
                        
                        let appArgs = txn["application-transaction"]["application-args"];
                        if(atob(appArgs[0]) === "register_name") {
                            if(!names.includes(atob(appArgs[1]))) names.push(atob(appArgs[1]))
                        }
                        else if(atob(appArgs[0]) === "accept_transfer"){
                            let lsigAccount = txn["application-transaction"]["accounts"][0];
                            let accountInfo = await indexer.lookupAccountByID(lsigAccount).do();
                            accountInfo = accountInfo.account['apps-local-state'];

                            const length = accountInfo.length;
                            for(let i=0; i<length; i++){
                                if(accountInfo[i].id === APP_ID) {
                                    let kvPairs = accountInfo[i]["key-value"];
                                    for(let j=0; j<kvPairs.length; j++) {
                                        let key = atob(kvPairs[j].key);
                                        let value = atob(kvPairs[j].value.bytes);

                                        if(key === 'name') {
                                            if(!names.includes(value)) names.push(value);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return names;

        } catch (err) {
            return []
        }
    }

    static async createRenewalTxn (name, sender, years, amt) {
        
        const params = await client.getTransactionParams().do();
        let receiver = algosdk.getApplicationAddress(APP_ID);
        let closeToRemaninder=undefined;
        let note=undefined;
        let paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amt, closeToRemaninder, note, params);

        name = name.split('.algo')[0];

        let lsig = await AlgoService.generateLsig(name);

        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("renew_name")));
        appArgs.push(algosdk.encodeUint64(years));

        let applicationTxn = algosdk.makeApplicationNoOpTxn(sender, params, APP_ID, appArgs, [lsig.address()]);

        algosdk.assignGroupID([paymentTxn, applicationTxn]);

        const groupTxns = [paymentTxn, applicationTxn];
        
        return groupTxns;

    }

    static async createTransferTransaction (name, sender, newOwner, price) {
        price = algosdk.algosToMicroalgos(price);
        const params = await client.getTransactionParams().do();
        name = name.split('.algo')[0];
        let lsig = await AlgoService.generateLsig(name);

        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("initiate_transfer")));
        appArgs.push(algosdk.encodeUint64(price));

        let applicationTxn = algosdk.makeApplicationNoOpTxn(sender, params, APP_ID, appArgs, [lsig.address(), newOwner]);
        return applicationTxn;
    }

    static async createConfirmTransferTransactions (name, sender, receiver, amt) {
        
        const params = await client.getTransactionParams().do();
        let closeToRemaninder=undefined;
        let note=undefined;
        let paymentToOwnerTxn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amt, closeToRemaninder, note, params);

        receiver = algosdk.getApplicationAddress(APP_ID);
        
        let paymentToSmartContractTxn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, constants.TRANSFER_FEE, closeToRemaninder, note, params);

        name = name.split('.algo')[0];

        let lsig = await this.generateLsig(name);

        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("accept_transfer")));
        
        let applicationTxn = algosdk.makeApplicationNoOpTxn(sender, params, APP_ID, appArgs, [lsig.address()]);

        algosdk.assignGroupID([paymentToOwnerTxn, paymentToSmartContractTxn, applicationTxn]);

        const groupTxns = [paymentToOwnerTxn, paymentToSmartContractTxn, applicationTxn];
        return groupTxns;
    }

    static async createPaymentTxn (sender, receiver, amt, note) {
        amt = algosdk.algosToMicroalgos(amt);
        const params = await client.getTransactionParams().do();
        const enc = new TextEncoder();
        note = enc.encode(note);

        let closeToRemaninder = undefined;

        let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amt, closeToRemaninder, note, params);

        return txn;

    }

    static async setDefaultAccountTransaction (name, sender) {
        const params = await client.getTransactionParams().do();
        name = name.split('.algo')[0];
        let lsig = await AlgoService.generateLsig(name);
        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("set_default_account")));
        let applicationTxn = algosdk.makeApplicationNoOpTxn(sender, params, APP_ID, appArgs, [lsig.address()]);
        return applicationTxn;
    }

    static async updateResolverAccount(name, sender, value) {
        const params = await client.getTransactionParams().do();
        name = name.split('.algo')[0];
        let lsig = await AlgoService.generateLsig(name);
        let appArgs = [];
        appArgs.push(new Uint8Array(Buffer.from("update_resolver_account")));
        let applicationTxn = algosdk.makeApplicationNoOpTxn(sender, params, APP_ID, appArgs, [lsig.address(), value]);
        return applicationTxn;
    }

    static async getBalance(account) {
        account = await indexer.lookupAccountByID(account).do();
        let balance = account.account;
        balance = algosdk.microalgosToAlgos(balance.amount);
        return balance;
    }

}

export default AlgoService;

