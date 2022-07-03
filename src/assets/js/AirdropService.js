import algosdk from "algosdk";
import AlgoService from "./Service";

import testnetv1 from '../data/data.json';
import testnetv2 from '../data/data2.json';
import mainnetAddresses from '../data/addresses.json';
import flaggedAddresses from '../data/flaggedAddress.json'
import kycAddresses from '../data/kycAddress.json';

export async function checkStatus(input) {
    
    if(!algosdk.isValidAddress(input)){
        input = input.split('.algo')[0]+'.algo';
        try{
            input = await AlgoService.searchForName(input);
            input = input.address;
        } catch (err) {
            return ({success: false, message: 'Domain not registered'})
        }
        
    }
    if(!algosdk.isValidAddress(input)){
        return ({success: false, message: 'Invalid address'});
    }
    const mainnet = mainnetAddresses[input];
    if(!mainnet) {
        if((testnetv1[input] && testnetv1[input] > 0) || (testnetv2[input] && testnetv2[input] > 0)) {
            return ({success: true, testnet:true, mainnet:false, address: input})
        }
        else return ({success: true, testnet:false, mainnet:false, address: input})
    } 
    if(flaggedAddresses.addresses.includes(input) && !kycAddresses.addresses.includes(input)){
        const min = getMinLength(mainnet);
        return ({success: true, domains:mainnet, testnet:true, mainnet:true, category: min, address: input, flagged: true})
    }
    
    if(testnetv1[input] && testnetv1[input] > 0) {
        if(mainnet.length > 0){
            const min = getMinLength(mainnet);
            return ({success: true, domains:mainnet, testnet:true, mainnet:true, category: min, address: input})
        }
    }
    if(testnetv2[input] && testnetv2[input] > 0) {
        if(mainnet.length > 0){
            const min = getMinLength(mainnet);
            return ({success: true,domains:mainnet, testnet:true, mainnet: true, category: min, address: input})
        }
    }
    if(mainnet.length > 0) {
        const min = getMinLength(mainnet);
        return ({success: true, domains:mainnet, testnet: false, mainnet: true, category: min, address: input})
    }
    return ({success: true, mainnet: false, testnet: false, message: 'Not eligible for airdrop 1 because not registered on testnet', address: input});
}

function getMinLength(array){
    let min = 58;
    for(let i in array) {
        if(array[i].length < min) {
            min = array[i].length;
        }
    }
    return min > 5 ? 5 : min;
}
