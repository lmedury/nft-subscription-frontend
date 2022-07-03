import React from "react";

import {Row, Col, Container, Card, Button, Form, ButtonGroup} from 'react-bootstrap';
import algoicon from '../assets/img/Algorand.png';
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import constants from "../assets/js/constants";
import AlgoService from "../assets/js/Service";
import Transactions from "../assets/js/Transactions";
import ToastTopRight from "../Components/Toasts/ToastTopRight";
import { isValidAddress } from "algosdk";
import LoadingButton from "../Components/Buttons/LoadingButton";
import Recaptcha from 'react-google-recaptcha';

export default function Subscribe(props) {

    
    const [price, setPrice] = React.useState(0);
    const [years, setYears] = React.useState(1);
    const [checkbox, setCheckbox] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [captchaVerified, setCaptchaVerified] = React.useState(false);
    
    

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
        
    }

    const confirmRegistration = async () => {
        if(!captchaVerified){
            setErrorMessage('Please complete the recaptcha');
            window.scrollTo(0, 0);
            setError(true);
            return;
        }
        if(!checkbox) {
            setErrorMessage('Please agree to the terms and conditions before proceeding with the registration');
            window.scrollTo(0, 0);
            setError(true);
            return;
        }
        setLoading(true);
        const address = localStorage.getItem('address');
        if(!isValidAddress(address)){
            setLoading(false);
            setErrorMessage('Please connect your Algorand Wallet');
            window.scrollTo(0, 0);
            setError(true);
            return;
        }
        
        
    }
    //TODO: Dark/White Algo Icon

    return(
        <Container>
            <div className="section">
                <ToastTopRight 
                    showToast={error}
                    closeToast={() => setError(!error)}
                    toastMessage={errorMessage}
                    bg="danger"
                    />
                <Card className="card-bg" style={{paddingTop:10, paddingBottom:20}}>
                    <h1 className="title text-center">NFT Subscription</h1>
                    <Row className="text-center">
                        <Col xs={12}>
                            <img src={algoicon} style={{width: 120}} alt="Logo" />
                            <h3>Project 1</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                        <h3 className="title">Description</h3>
                        <p className="description">
                            Once you register your name, you can start linking your social media profiles from the dashboard.
                            Adding social profiles is optional. It presents a simpler way to disover user's presence on social media.
                            Please note that the social profiles you add are stored on public blockchain, hence visible to everyone.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" md="4">
                            
                            <h3 className="title">Calculate Fee:</h3>
                            
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary" onClick={() => updateYears('decrement')}><FontAwesomeIcon icon={faMinusCircle} size="2x" /></Button>
                                <Button variant="secondary" disabled style={{fontWeight:'bold'}}>{years} Year(s)</Button>
                                <Button variant="secondary" onClick={() => updateYears('increment')}><FontAwesomeIcon icon={faPlusCircle} size="2x" /></Button>
                            </ButtonGroup>
                            
                        </Col>
                        
                    </Row>
                    <Recaptcha 
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} 
                        render="explicit"
                        onChange={() => {
                            setCaptchaVerified(true)
                        }}
                    />
                    <div className="text-center">
                        <h3 className="title">Total = {(price/1000000) + 0.915} <img alt="ALGO" src={algoicon} style={{ width: '1.5rem', display:'inline'}} /></h3>
                        <Button variant="primary" disabled={loading ? true : false} style={{marginRight:'2%'}} onClick={() => props.changePage(1)}>Go Back</Button>
                        <LoadingButton
                            loading={loading}
                            onClick={() => confirmRegistration()}
                            activeText="Confirm Registration"
                        />
                    </div>
                </Card>
            </div>
        </Container>
    )
}