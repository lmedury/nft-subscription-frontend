import algosdk from 'algosdk';
import React from 'react';

import {Row, Col, Card, Button} from 'react-bootstrap';
import logo from '../../assets/img/Algorand.png';
import { IPFS_URL } from '../../assets/js/constants';
import Utility from '../../assets/js/Utility';

export default function ProjectCard({details}) {

    return(
        <Card className="card-bg" style={{marginTop:20, paddingTop: 30, paddingBottom:30, paddingLeft: 10}}>
            <Row>
                <Col xs={12} md="5" className='text-center'>
                    <img src={`${IPFS_URL}/${details.metadata.properties.media_url.description}`} alt="Logo" style={{width: 100}}  />
                    <h5>{details.metadata.title}</h5>
                    <p>APP ID: {details.app}</p>
                </Col>
                <Col xs={12} md="4" className="text-left">
                    <p>Creator: {Utility.sliceAccount(details.state.receiver_address)}</p>
                    <p>{details.metadata.properties.description.description}</p>
                </Col>
                <Col xs={12} md="3" className="text-center">
                    <p style={{fontSize: 20}}>{algosdk.microalgosToAlgos(details.state.subscription_price)} <img src={logo} style={{width:25}} alt="ALGO" /> / {details.state.duration} minute(s)</p>
                    <Button variant="warning" onClick={() => window.location.href=`/#/subscribe/${details.app}`}>Subscribe</Button>
                </Col>
            </Row>
        </Card>
    )

}