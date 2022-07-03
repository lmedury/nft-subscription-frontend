import React from 'react';

import {Row, Col, Card, Button} from 'react-bootstrap';
import logo from '../../assets/img/Algorand.png';

export default function ProjectCard(props) {

    return(
        <Card className="card-bg" style={{marginTop:20, paddingTop: 30, paddingBottom:30}}>
            <Row>
                <Col xs={12} md="3">
                    <img src={logo} alt="Logo" roundedCircle style={{width: 40}} />
                    <h3>Project 1</h3>
                </Col>
                <Col xs={12} md="6" className="text-left">
                    <p>Benefit 1</p>
                    <p>Benefit 2</p>
                    <p>Benefit 3</p>
                </Col>
                <Col xs={12} md="3" className="text-center">
                    <p style={{fontSize: 20}}>10 <img src={logo} style={{width:20}} alt="ALGO" /> / Year</p>
                    <Button variant="warning">Subscribe</Button>
                </Col>
            </Row>
        </Card>
    )

}