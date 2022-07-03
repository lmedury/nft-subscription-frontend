import React from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import ProjectCard from '../Components/Cards/ProjectCard';

export default function View(props) {

    return(
        <Container>
           <h1>Projects offering subscription memberships:</h1> 
           <Row>
                {[1,2,3].map(index => 
                    <Col key={index} xs={12} md={{span:8, offset:2}}>
                        <ProjectCard />
                    </Col>   
                )}
           </Row>
        </Container>
    )
}