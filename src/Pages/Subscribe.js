import React from "react";

import {Row, Col, Container, Card, Button, ButtonGroup} from 'react-bootstrap';
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IPFS_URL } from "../assets/js/constants";
import AlgoService from "../assets/js/Service";
import Transactions from "../assets/js/Transactions";
import LoadingButton from "../Components/Buttons/LoadingButton";
import { useParams } from "react-router-dom";
import WalletConnectClass from "../assets/js/WalletConnect";
import { useNavigate } from "react-router-dom";
import Utility from "../assets/js/Utility";
import algosdk from "algosdk";

export default function Subscribe(props) {

    /*
        33IA2RTOTZDD3KNDBOBUUGF43RJ4MJXDL6GZENBFHS2KO6HYN43ZKCBYDA
        98250104
        98250602
    */
    
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
            console.log(info);
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
                <Card className="card-bg" style={{paddingTop:10, paddingBottom:100, borderRadius: 20}}>
                    <Row>
                        <Col xs={12} md={6}>
                            <img src={`${IPFS_URL}/${metadata.properties.media_url.description}`} style={{width: 100, borderRadius: 30}} alt="Logo" />
                            <p className="card-description" style={{marginTop:'5%', fontSize:20}}>{appInfo.state.unit_name}</p>
                            <h3>{appInfo.state.asset_name}</h3>
                            <p className="card-description" style={{marginTop:'5%', fontSize:20}}>{metadata.properties.description.description}</p>
                        </Col>
                        <Col xs={12} md={6}>
                            <img src={`${IPFS_URL}/${metadata.properties.banner.description}`} style={{width: '100%', borderRadius: 20}} alt="Logo" />
                        </Col>
                    </Row>
                </Card>
                <Row>
                    <Col xs="12" md={{span:8, offset:2}} style={{marginTop:'-5%'}}>
                        <Card className="card-bg" style={{borderRadius: 20, padding: 10, width: '100%'}}>
                            <div className="section">
                                <strong>Information:</strong>
                                <ul className="card-description">
                                    <li className="card-description">
                                        Creator: {Utility.sliceAccount(appInfo.state.receiver_address)}
                                    </li>
                                    <li className="card-description">
                                        Token Symbol: {appInfo.state.unit_name}
                                    </li>
                                    <li className="card-description">
                                        Asset Name: {appInfo.state.asset_name}
                                    </li>
                                    <li className="card-description">
                                        Description: {metadata.properties.description.description}
                                    </li>
                                    <li className="card-description">
                                        Price: {algosdk.microalgosToAlgos(appInfo.state.subscription_price)} ALGO / {appInfo.state.duration} minute(s)
                                    </li>
                                </ul>
                                <br />
                                <ButtonGroup aria-label="Basic example">
                                    <Button variant="secondary" onClick={() => updateYears('decrement')}><FontAwesomeIcon icon={faMinusCircle} size="2x" /></Button>
                                    <Button variant="secondary" disabled style={{fontWeight:'bold'}}>{years} period(s)</Button>
                                    <Button variant="secondary" onClick={() => updateYears('increment')}><FontAwesomeIcon icon={faPlusCircle} size="2x" /></Button>
                                    <LoadingButton
                                        style={{marginLeft: '2%', width: '100%', }}
                                        loading={loading}
                                        onClick={() => subscribe()}
                                        activeText="Confirm Subscription"
                                    />
                                </ButtonGroup>
                            </div>
                        </Card>
                    </Col>
                </Row>
                
            </div> : <></> }
        </Container>
    )
}