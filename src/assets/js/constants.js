const constants = {

    CHAR_3_AMOUNT: 150000000,
    CHAR_4_AMOUNT: 50000000,
    CHAR_5_AMOUNT: 5000000,
    RENEWAL_AMOUNT: 5000000,
    TRANSFER_FEE: 2000000,
    //BACKEND_URL: 'https://marketplace-dot-ansresolver.uc.r.appspot.com',
    BACKEND_URL: 'https://marketplace-dot-algo-name-service.uc.r.appspot.com',
    //BACKEND_URL: 'http://localhost:8001',
    RESOLVER_URL : 'https://api.algonameservice.com',
    RECAPTCHA_SITE_KEY: "6LdsHKcdAAAAAN_1mHtCnjO9iozVeL3QLzUvBA2y",
    IPFS_LINK:'https://ipfs.infura.io/ipfs/',
    ALLOWED_SOCIALS : ['discord', 'github', 'twitter', 'telegram', 'youtube', 'reddit'],
    HOSTING_INFORMAION: ['ipaddress', 'content'],
    LOG_CODES : {
        1: 'New Listing',
        2: 'New Offer',
        3: 'Listing Updated',
        4: 'Accepted Offer',
        5: 'Withdrawn New Offer',
        6: 'Completed Transfer',
        7: 'Deleted Listing',
        8: 'Deleted Listing',
        9: 'Dormant Listing',
        10: 'Dormant Listing',
        11: 'Offer Updated',
        12: 'Cancelled Transfer'
    },
    LISTING_CODES: {
        0: 'New',
        1: 'Open',
        2: 'Accepted',
        3: 'Transferred',
        4: 'Deleted',
        5: 'Dormant'
    },
    OFFER_CODES: {
        0: 'Pending',
        1: 'Accepted',
        2: 'Rejected',
        3: 'Withdrawn'
    }
}

export default constants;