import axios from "axios";
import AlgoService from "./Service";
import Utility from "./Utility";
import constants from "./constants";

const Marketplace = {
    Listings : {
        addListing : async (listingName, validUntil, price, address, receive_notifications) => {
            listingName = Utility.normalizeName(listingName);
            let domainInformation = await AlgoService.searchForName(listingName);
            if(!domainInformation.found) return {success: false, err: 'Domain not registered yet'};
            if(!(domainInformation.address === address)) return {success:false, err:'Domain not owned by the specified address'};
            if(price < 0 || isNaN(price)) return {success: false, err: 'Price cannot be less than 0'};
            
            let info = await axios.get(`${constants.BACKEND_URL}/listings/names?name=${listingName}`);
            if(info.data.data.length > 0) {
                info = info.data.data;
                for(let i = 0; i<info.length; i++) {
                    if(info[i].status < 3) {
                        return {success: false, err: 'There is already an active listing for this domain'};
                    }
                }
            }
            
            let postData = {
                listingName: listingName,
                dateValidUntil: validUntil,
                price: price ?? 0,
                address: address,
                receive_notifications: receive_notifications
            }
            
            let postResult = await axios.post(`${constants.BACKEND_URL}/listings/create`, postData);
            if(postResult.data.success) return {success: true};
            else return {success: false};
        },

        editListing : async (id, validUntil, price, address, notifications) => {
            let result = await axios.post(`${constants.BACKEND_URL}/listings/update`, {
                dateValidUntil: validUntil,
                listingID: id,
                price: price,
                address: address,
                receive_notifications: notifications
            });

            if(result.data.success) {
                return {success:true}
            } else {
                return {success: false}
            }
        },

        deleteListing : async (id, address) => {
            let result = await axios.post(`${constants.BACKEND_URL}/listings/delete`, {
                listingID: id,
                address: address
            });

            if(result.data.success) return {success: true};
            else return {success: false};
        }
    },

    Offers: {
        submitOffer : async (id, address, offerPrice, minimum) => {
            let balance = await AlgoService.getBalance(address);
            if(balance <= offerPrice){
                const err = `You only have ${balance} ALGO in your wallet.`;
                return {success: false, err: err};
            }

            if(offerPrice < minimum) {
                const err = `Minimum offer price must be ${minimum} ALGO`;
                return {success: false, err: err};
            }
            
            let validOffer = await axios.get(`${constants.BACKEND_URL}/offers?address=${address}&listing_id=${id}`);
            if(!validOffer.data.success) {
                return {success: false, err: validOffer.data.message};
            }
            
            /*
            if(props.address === address) {
                setErrorMessage('You cannot make an offer to your listing');
                setLoading(false);
                return;
            }
            */

            try{
                
                let offer = await axios.post(`${constants.BACKEND_URL}/offers/create`, {
                    listingID: id,
                    price: offerPrice,
                    address: address,
                });

                if(offer.data.success) {
                    return {success: true};
                    
                } else {
                    return {success: false, err: 'Something went wrong'};
                }
                
            
            } catch (err)  {
                return {success: false, err: err.message};
            } 
        },

        editOffer : async (id, listingId, address, offerPrice, listingPrice) => {
            let balance = await AlgoService.getBalance(address);
            if(balance <= offerPrice){
                return {success: false, err:`You only have ${balance} ALGO in your wallet.`};
            }
            
            if(offerPrice < listingPrice) {
                return {success: false, err:`Minimum offer price must be ${listingPrice} ALGO`};
            }

            let editOffer = await axios.post(`${constants.BACKEND_URL}/offers/update`, {
                offerID: id,
                listingID: listingId,
                price: offerPrice,
                address: address
            });

            if(editOffer.data.success) {
                return {success: true}
            } else {
                return {success: false, err:`Something went wrong`};
            }
        },

        withdrawOffer : async (id, listingId, address) => {
            let withdraw = await axios.post(`${constants.BACKEND_URL}/offers/withdraw`, {
                address: address,
                offerID: id,
                listingID: listingId
            });

            if(withdraw.data.success) {
                return {success: true}
                
            } else {
                return {success: false, err: 'Something went wrong'}
            }
        },

        acceptOffer : async (id, listingId, address, offeredBy, price) => {
            let status = await axios.post(`${constants.BACKEND_URL}/offers/update-status`, {
                offerID: id,
                listingID: listingId,
                address: address,
                buyerAddress: offeredBy,
                price: price,
                status: 1
            });

            if(status.data.success) {
                return {success: true};
            }
            else return {success: false};
        },

        acceptName : async (id, address) => {
            let status = await axios.post(`${constants.BACKEND_URL}/listings/accept-name`, {
                listingID:id,
                address: address
            });

            if(status.data.success) {
                return {success: true};
            }
            else return {success: false};
        },

        cancelTransfer : async (id, listingId, address) => {
            let status = await axios.post(`${constants.BACKEND_URL}/offers/cancel-transfer`, {
                offerID: id,
                listingID: listingId,
                address: address
            });
            if(status.data.success) {
                return {success: true};
            }
            else return {success: false};
        }
    }
}

export default Marketplace;