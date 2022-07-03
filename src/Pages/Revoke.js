import React from 'react';
import {Row, Col, Container, FormControl} from 'react-bootstrap';

import AlgoService from '../assets/js/Service';
import WalletConnectClass from '../assets/js/WalletConnect';
import Transactions from '../assets/js/Transactions';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../Components/Buttons/LoadingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function Revoke(props) {

    const [walletAddress, setWalletAddress] = React.useState('');
    const [appId, setAppId] = React.useState(0);
    const [assetId, setAssetId] = React.useState(0);

    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState();
    const navigate = useNavigate();
    
    async function revoke() {
        setLoading(true);
        setErrorMessage('');
        try{
            const expiryStatus = await AlgoService.prepareExpiryTransaction(WalletConnectClass.getConnectedWallet().address, walletAddress, appId, assetId);
            if(expiryStatus.expired) {
                const status = await Transactions.signTransactions([expiryStatus.txn]);
                if(status.success) {
                    navigate('/success', {state: {
                        title: 'Successfully deleted the NFT',
                        message: `Congratulations! You have deleted the expired NFT. You will be rewarded with 0.2 ALGO (incentivised by the project owner)`
                    }})
                }
            } else {
                setErrorMessage('Invalid details. Please ensure you have provided the right details and that the subscrition has expired');
            }
        } catch(err){
            setErrorMessage('Invalid details. Please ensure you have provided the right details and that the subscrition has expired');
        } finally{
            setLoading(false);
        }
        
    }

    return(
        <Container>
            <h3>Revoke an expired membership</h3>
            <Row style={{marginTop:'5%'}}>
                <Col xs={12} md={{span: 6, offset:3}}>
                    <p className='text-left'>Please note:</p>
                    <ul className='text-left'>
                        <li>Anyone can revoke an expired membership</li>
                        <li>You need a minimum of 0.2 ALGO to submit the revocation transaction</li>
                        <li>You can only revoke a membership that has been expired</li>
                        <li>You will be rewarded if the revocation transaction goes through</li>
                    </ul>
                </Col>
            </Row>
            <Row style={{marginTop:'2%'}}>
                <Col xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Wallet Address: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"
                        onChange={(e) => setWalletAddress(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span: 3, offset:3}}>
                    <p className="text-left">Asset ID: </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"
                        onChange={(e) => setAssetId(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span: 3}}>
                    <p className="text-left">APP ID: </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"
                        onChange={(e) => setAppId(e.target.value)}
                    />
                    
                </Col>
                <Col className="card-description text-left" xs={12} md={{span:6, offset:3}}>
                    {errorMessage ? 
                        <span style={{color:'red'}}><FontAwesomeIcon icon={faCircleXmark} /><span style={{marginLeft:'2%'}}>{errorMessage}</span></span> : <></>
                    }
                    <LoadingButton loading={loading} style={{width: '100%', marginTop:'2%'}} activeText="Revoke Membership" onClick={() => revoke()} />
                </Col>
            </Row>
        </Container>
    )
}