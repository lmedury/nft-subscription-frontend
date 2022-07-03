import React from "react";

import {Container} from 'react-bootstrap';
import AlgoService from "../assets/js/Service";
import WalletConnectClass from "../assets/js/WalletConnect";
import MySubscriptionCard from "../Components/Cards/MySubscriptionCard";

export default function MySubscriptions(props)  {
    const [subscriptions, setSubscriptions] = React.useState([]);

    React.useEffect(() => {
        async function getInfo(){
            const info = await AlgoService.getMySubscriptions(WalletConnectClass.getConnectedWallet().address);
            setSubscriptions(info);
        }
        getInfo();
    }, [])

    return(
        <Container>
            <h3>My Subcriptions</h3>
            {subscriptions.length >0 && subscriptions.map(subscription => 
                <MySubscriptionCard subscription={subscription} />    
            )}
        </Container>
    )
}