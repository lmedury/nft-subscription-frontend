import React from "react";

import {Row, Col, Container, Card, Button, ButtonGroup} from 'react-bootstrap';
import algoicon from '../assets/img/Algorand.png';
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPFS_URL } from "../assets/js/constants";
import AlgoService from "../assets/js/Service";
import Transactions from "../assets/js/Transactions";
import LoadingButton from "../Components/Buttons/LoadingButton";
import { useParams } from "react-router-dom";
import WalletConnectClass from "../assets/js/WalletConnect";
import { useNavigate } from "react-router-dom";

export default function Subscribe(props) {

    
    const [price, setPrice] = React.useState(0);
    const [priceDuration, setPriceDuration] = React.useState(0);
    const [years, setYears] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const params = useParams();
    const [appInfo, setAppInfo] = React.useState({});
    const [metadata, setMetadata] = React.useState({});
    const navigate = useNavigate();
    React.useEffect(() => {
        async function getInfo(){
            const info = await AlgoService.getGlobalState(params.id);
            setAppInfo(info);
            setPrice(info.state.subscription_price);
            setPriceDuration(info.state.subscription_price);
            let ipfsMetadata = await fetch(`${IPFS_URL}/${info.state.asset_url}`);
            ipfsMetadata = await ipfsMetadata.json();
            setMetadata(ipfsMetadata);
            
        }
        getInfo();
    }, [params])
    

    const updateYears = (method) => {
        if (method === 'increment') {
            setYears(years+1);
            calculatePrice(years+1);
        } else if(method === 'decrement') {
            if(years === 1) return;
            else setYears(years-1);
            calculatePrice(years-1);
        }
    }

    const calculatePrice = (numYears) => {
        setPrice(numYears*priceDuration);
    }

    const subscribe = async () => {
        
        setLoading(true);
        try{
            const optinTxn = await AlgoService.optin(WalletConnectClass.getConnectedWallet().address, parseInt(params.id));
            await Transactions.signTransactions([optinTxn]);
        } catch (err) {

        } finally {
            const subscribeTxns = await AlgoService.prepareSubscriptionTxns(parseInt(params.id), WalletConnectClass.getConnectedWallet().address, appInfo.state.receiver_address, price, years);
            const status = await Transactions.signTransactions(subscribeTxns);
            if(status.success) {
                const assetOptinTxn = await AlgoService.optinToAsset(WalletConnectClass.getConnectedWallet().address, parseInt(params.id));
                const assetOptin = await Transactions.signTransactions([assetOptinTxn]);
                if(assetOptin.success) {
                    const acceptNFTTxn = await AlgoService.acceptNFTTransaction(WalletConnectClass.getConnectedWallet().address, parseInt(params.id));
                    const acceptNFT = await Transactions.signTransactions([acceptNFTTxn]);
                    if(acceptNFT.success){
                        navigate('/success', {
                            state: {
                                title: 'Successfully subscribed',
                                message: `Congratulations! You have successfully subscribed to ${appInfo.state.asset_name}!`
                            }
                        })
                    }
                    
                }
            }
            setLoading(false);
        }
        
        
    }

    return(
        <Container>
            {Object.keys(appInfo).length > 0 && Object.keys(metadata).length > 0 ? 
            <div className="section">
                
                <Card className="card-bg" style={{paddingTop:10, paddingBottom:20}}>
                    <h1 className="title text-center">NFT Subscription</h1>
                    <Row className="text-center">
                        <Col xs={12}>
                            <img src={`${IPFS_URL}/${metadata.properties.media_url.description}`} style={{width: 120}} alt="Logo" />
                            <h3>{appInfo.state.asset_name}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                        <h3 className="title">Description</h3>
                        <p className="description">
                            {metadata.properties.description.description}
                        </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" md="4">
                            
                            <h3 className="title">Calculate Fee:</h3>
                            
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary" onClick={() => updateYears('decrement')}><FontAwesomeIcon icon={faMinusCircle} size="2x" /></Button>
                                <Button variant="secondary" disabled style={{fontWeight:'bold'}}>{years} Minute(s)</Button>
                                <Button variant="secondary" onClick={() => updateYears('increment')}><FontAwesomeIcon icon={faPlusCircle} size="2x" /></Button>
                            </ButtonGroup>
                            
                        </Col>
                        
                    </Row>
                    
                    <div className="text-center">
                        <h3 className="title">Total = {(price/1000000)} <img alt="ALGO" src={algoicon} style={{ width: '1.5rem', display:'inline'}} /></h3>
                        <Button variant="primary" disabled={loading ? true : false} style={{marginRight:'2%'}} onClick={() => props.changePage(1)}>Go Back</Button>
                        <LoadingButton
                            loading={loading}
                            onClick={() => subscribe()}
                            activeText="Confirm Subscription"
                        />
                    </div>
                </Card>
            </div> : <></> }
        </Container>
    )
}