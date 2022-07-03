import React from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import { IPFS_URL } from '../assets/js/constants';
import AlgoService from '../assets/js/Service';
import ProjectCard from '../Components/Cards/ProjectCard';

export default function View(props) {

    const [nftSubscriptions, setNftSubscriptions] = React.useState([]);

    React.useEffect(() => {
        async function getInfo(){
            const subscriptions = [];
            const details = {};
            let apps = await AlgoService.getSubscriptions();
            for(let i in apps) {
                let metadata = await fetch(`${IPFS_URL}/${apps[i].state.asset_url}`);
                metadata = await metadata.json();
                details.metadata = metadata;
                details.app = apps[i].id;
                details.state = apps[i].state;
                subscriptions.push(details);
                
            }
            console.log(subscriptions);
            setNftSubscriptions(subscriptions);
        }
        getInfo();
    }, [])

    return(
        <Container>
           <h1>Projects offering subscription memberships:</h1> 
           <Row>
                {nftSubscriptions.map((app, index) => 
                    <Col key={index} xs={12} md={{span:8, offset:2}}>
                        <ProjectCard details={app} />
                    </Col>   
                )}
           </Row>
        </Container>
    )
}