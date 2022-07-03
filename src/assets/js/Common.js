const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI.create('https://ipfs.infura.io:5001');

export function ConvertToDate (dateString) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(dateString);
    let month = date.getMonth();
    if(date.getFullYear() !== new Date().getFullYear()) return `${date.getFullYear()} ${months[month]}`;
    else return `${months[month]} ${date.getDate()} `

}

export function SortArray (key, array) {
    if(key === "Lower") {
        array = array.sort(function(a, b) {
            var keyA = a.price,
                keyB = b.price;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

    } else if(key === "Higher") {
        array = array.sort(function(a, b) {
            var keyA = a.price,
                keyB = b.price;
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
    }
    return array;
}

export function SortArrayByDate (key, attribute, array)  {
    if(key === "Recent") {
        array = array.sort(function(a, b) {
            var keyA = new Date(a[attribute]),
                keyB = new Date(b[attribute]);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

    } else if(key === "Oldest") {
        array = array.sort(function(a, b) {
            var keyA = new Date(a[attribute]),
                keyB = new Date(b[attribute]);
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
    }
    return array;
}

export function LogIcons (transitionCode)  {
    let icon;
    if(transitionCode === 1) icon = 'fa fa-plus';

    return icon;
}

export async function GetIpfsContent (hash) {
    
    let data;
    const ipfsData = ipfs.cat(hash);
    for await (const chunk of ipfsData) {
        data+= chunk.toString();
    }
    return data;
}
