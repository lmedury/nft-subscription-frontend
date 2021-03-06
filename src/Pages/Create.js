import React from 'react';
import {Row, Col, Container, FormControl} from 'react-bootstrap';

import {Image} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit} from "@fortawesome/free-solid-svg-icons";
import AlgoService from '../assets/js/Service';
import WalletConnectClass from '../assets/js/WalletConnect';
import Transactions from '../assets/js/Transactions';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../Components/Buttons/LoadingButton';

export default function Create(props) {

    const [avatar, setAvatar] = React.useState();
    const [banner, setBanner] = React.useState();
    const hiddenFileInput = React.useRef(null);
    const hiddenBannerFileInput = React.useRef(null);
    const [file, setFile] = React.useState('');
    const [bannerFile, setBannerFile] = React.useState('');
    const [tokenName, setTokenName] = React.useState('');
    const [assetName, setAssetName] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [period, setPeriod] = React.useState(0);
    const [description, setDescription] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const selectAvatar = (e, type) => {
        try{
            e.preventDefault();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if(type === 'avatar') {
                    setFile(file);
                    setAvatar(reader.result);
                } else if(type === 'banner') {
                    setBannerFile(file);
                    setBanner(reader.result);
                }
                
            };
            reader.readAsDataURL(file);
        } catch (err)  {

        }
    }

    async function deployContract() {
        setLoading(true);
        const txn = await AlgoService.deployContractTransaction(WalletConnectClass.getConnectedWallet().address, tokenName, assetName, parseInt(price), parseInt(period), description, file, bannerFile);
        try{
            const status = await Transactions.signTransactions([txn]);
            if(status.success) {
                navigate('/success', {state: {
                    title: 'Successfully deployed the contract',
                    message: `Congratulations! You have created your own subcription service. The contract APP ID is ${status.response['application-index']}`
                }})
            }
        } catch (err) {
            
        } finally {
            setLoading(false);
        }
    }

    return(
        <Container>
            <h3>Create a subscription membership</h3>
            <Row >
                <Col className="card-description" xs={12}>
                    <Image className="text-center" style={{width:'60%', height: '70%', verticalAlign:'text-top', borderRadius: 20}} 
                        src={banner ? banner : require('../assets/img/banner.jpg').default} />                        
                        <FontAwesomeIcon icon={faEdit} style={{cursor:'pointer'}} onClick={() => hiddenBannerFileInput.current.click()} /> <br />
                    <Image className="text-center" style={{width:150, marginTop:'-5%', verticalAlign:'text-top', borderRadius: 20}} 
                        src={avatar ? avatar : require('../assets/img/UserPlaceholder.png').default} />                        
                        <FontAwesomeIcon icon={faEdit} style={{cursor:'pointer'}} onClick={() => hiddenFileInput.current.click()} />
                </Col>
                <input 
                    accept=".png, .jpg, .gif, .webp, .jpeg"
                    ref={hiddenFileInput} 
                    onChange={(e) => selectAvatar(e, 'avatar')} type="file" style={{display:'none'}} />
                <input 
                    accept=".png, .jpg, .gif, .webp, .jpeg"
                    ref={hiddenBannerFileInput} 
                    onChange={(e) => selectAvatar(e, 'banner')} type="file" style={{display:'none'}} />
                <Col xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Token Name: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"
                        onChange={(e) => setTokenName(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Asset Name: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"
                        onChange={(e) => setAssetName(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={6} md={{span: 3, offset:3}} >
                    <p className="text-left">Price (in ALGO): </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={6} md={{span:3}}>
                    <p className="text-left">Period (in minutes): </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"
                        onChange={(e) => setPeriod(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span:6, offset:3}}>
                    <p className="text-left">Description: </p>
                    <FormControl
                        type="textarea"
                        className="form-input long-input"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span:6, offset:3}}>
                    <LoadingButton loading={loading} style={{width: '100%'}} activeText="Create an NFT Subscription" onClick={() => deployContract()} />
                </Col>
            </Row>
        </Container>
    )
}