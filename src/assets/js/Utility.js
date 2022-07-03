import algosdk from "algosdk";

const Utility = {
    sliceAccount(account) {
        if(!account) return;
        let accountString = account;
        accountString = account.slice(0,6);
        accountString = accountString+'....';
        accountString = accountString+account.slice(54,58);
        return accountString;
    },

    normalizeName(name) {
        return name.split('.algo')[0].toLowerCase();
    },

    getSuccessRouteObject(title, message, previousRoute, nextRoute) {
        return {
            title,
            message,
            previousRoute,
            nextRoute
        }
    },

    isValidName(name) {
        
        if(name.length <3 || name.length >= 64)  {
            return {valid: false, err: 'Names must be between 3 and 64 characters'}
        }

        if(name.toLowerCase() !== name) {
        
            return {valid:false, err: 'Name cannot have uppercase letters'};
        }

        if(name.split(' ').length >= 2) {
            return {valid:false, err: 'Name cannot include spaces'};
        }

        
        for(let i in name){
            let unicode = name.charCodeAt(i);
        
            if(!(unicode >= 97 && unicode <= 122)){
                
                if(!(unicode >= 48 && unicode <= 57)) {
                    return {valid:false, err: 'Name can only include lowercase characters and digits'};
                }
            } 
        }

        return {valid: true};
    },

    encodeBytes(value) {
        return new Uint8Array(Buffer.from(value, 'base64'));
    },

    encodeInt(value) {
        return algosdk.encodeUint64(value)
    }


}

export default Utility;