import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Container, Card, Button} from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";


export default function Success() {

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!location.state) {
            window.location.href="/";
        }
    }, [location.state])

    return(
        <Container>
            {location.state && Object.keys(location.state).length > 0 ? 
            <div className="section">
                <Card className="card-border" style={{padding:'5%'}}>
                    <h1 className="text-center">{location.state?.title ? location.state?.title : 'Success!'}</h1>
                    <div className="text-center card-description">
                        <FontAwesomeIcon icon={faCheckCircle} size="6x" style={{color:'green'}} />
                    </div>
                    <div className="text-center card-description">
                        <p>
                            {location.state?.message ? location.state?.message : 
                                'Operation Successful!'
                            }
                        </p>
                        
                    </div>
                    <div className="text-center card-description">
                        <Button variant="secondary" onClick={() => {
                            if(location.state?.previousRoute) navigate(`${location.state?.previousRoute}`)
                            else navigate('/');
                        }}>Go Back</Button>
                        <Button variant="warning" style={{marginLeft:'5%'}} onClick={() => {
                            if(location.state?.nextRoute) navigate(`${location.state?.nextRoute}`)
                            else navigate('/');
                        }}>Thanks!</Button>
                    </div>
                
                </Card>
                
            </div> : <></> }
        </Container>
    )
}