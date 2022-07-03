import React from "react";

import {Row, Col, Card} from 'react-bootstrap';
import { IPFS_URL } from "../../assets/js/constants";
import Utility from "../../assets/js/Utility";

export default function MySubscriptionCard({subscription}) {

    console.log(subscription);

    return(
        
        <Col xs={12} md="4">
            <Card className="grey-bg" style={{paddingTop: 10, paddingBottom:10, borderRadius: 30, padding: 0, minHeight: 450}}>
                <Row>
                    <Col xs={12}>
                        <img src={subscription.asset.assetInfo.properties.banner ? `${IPFS_URL}/${subscription.asset.assetInfo.properties.banner.description}` : require('../../assets/img/banner.jpg').default} alt="logo" style={{width: '100%', height: 200, borderTopLeftRadius: 30,  borderTopRightRadius: 30}} />
                        <img src={subscription.asset.assetInfo.properties.media_url ? `${IPFS_URL}/${subscription.asset.assetInfo.properties.media_url.description}` : require('../../assets/img/banner.jpg').default} alt="logo" style={{width: '25%', height: 90, borderRadius:10, marginTop: '-10%'}} /> <br />
                    </Col>
                    <Col xs={12} className="card-description">
                        <strong>{subscription.asset.assetInfo.title}</strong>
                        <p className="title">Project Owner: {Utility.sliceAccount(subscription.asset.clawback)}</p>
                        <p className="text-center">{subscription.asset.assetInfo.properties.description.description}</p>
                    </Col>
                </Row> 
            </Card>
        </Col>
       
    )
}