import React from 'react';

import {Row, Col, Card} from 'react-bootstrap';
import { IPFS_URL } from '../../assets/js/constants';


export default function ProjectCard({details}) {

    return(
        <Card className="grey-bg" onClick={() => window.location.href=`/#/subscribe/${details.app}`} style={{marginTop:20, padding: 0, paddingBottom: 30, borderRadius: 30, cursor:'pointer', height: 400}} >
            <Row>
                <Col xs={12}>
                    <img src={`${IPFS_URL}/${details.metadata.properties.banner.description}`} alt="banner" style={{width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: 250}} />
                    <div className='text-center'>
                        <img src={`${IPFS_URL}/${details.metadata.properties.media_url.description}`} alt="banner" style={{width: '20%', borderRadius: 30, marginTop:'-10%'}} />
                        <h5><strong>{details.metadata.title}</strong></h5>
                        <p>{details.metadata.properties.description.description}</p>
                    </div>

                </Col>
            </Row>
            
        </Card>
    )

}