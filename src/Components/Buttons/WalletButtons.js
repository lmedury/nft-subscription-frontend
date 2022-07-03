import React from "react";

import { Row, Col, Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function WalletButton(props) {

    return(
        <Button variant="outline-dark" onClick={() => props.connectWallet()} 
            style={{textAlign:'left', marginTop: '5%', justifyContent:'center', ...props.buttonStyle}}>
            <Row>
                <Col xs="2">
                    <Image src={props.imageSrc} rounded style={{width:'60%', marginLeft:'100%'}} />
                </Col>
                <Col xs="8">
                    <h4 style={{display:'inline', marginLeft:'3rem', marginTop:'5%'}}>{props.title}</h4>
                </Col>
                <Col xs="2">
                    <FontAwesomeIcon style={{textAlign:'right'}} size="2x" icon={faAngleRight} />
                </Col>
            </Row>
        </Button>
    )
}