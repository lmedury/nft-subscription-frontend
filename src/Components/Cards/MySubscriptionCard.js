import React from "react";

import {Row, Col, Card, Button} from 'react-bootstrap';
import { IPFS_URL } from "../../assets/js/constants";
import Utility from "../../assets/js/Utility";

export default function MySubscriptionCard({subscription}) {

    console.log(subscription);

    return(
        <Row className="title">
            <Col xs={12} md={{span: 6, offset:3}}>
                <Card className="card-bg" style={{paddingTop: 10, paddingBottom:10}}>
                   <Row>
                        <Col xs={12} md={3}>
                            <img src={`${IPFS_URL}/${subscription.asset.assetInfo.properties.media_url.description}`} alt="logo" style={{width: 100}} />
                            <p>{subscription.asset.assetInfo.title}</p>
                        </Col>
                        <Col xs={12} md={6}>
                            <p>Project Owner: {Utility.sliceAccount(subscription.asset.clawback)}</p>
                            <p className="text-left">{subscription.asset.assetInfo.properties.description.description}</p>
                        </Col>
                        <Col xs={12} md={3}>
                            <Button disabled variant="warning">Renew</Button>
                        </Col>
                    </Row> 
                </Card>
            </Col>
        </Row>
        
    )
}