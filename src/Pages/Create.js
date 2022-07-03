import React from 'react';
import {Row, Col, Container, FormControl, Button} from 'react-bootstrap';
import {Image} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTriangleExclamation, faEdit} from "@fortawesome/free-solid-svg-icons";


export default function Create(props) {

    const [avatar, setAvatar] = React.useState();
    const hiddenFileInput = React.useRef(null);
    const [file, setFile] = React.useState('');
    const [loaded, setLoaded] = React.useState(false);
    const selectAvatar = (e) => {
        try{
            e.preventDefault();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                setFile(file);
                setAvatar(reader.result);
                setLoaded(true);
            };
            reader.readAsDataURL(file);
        } catch (err)  {

        }
    }

    return(
        <Container>
            <h1>Create a subscription membership</h1>
            <Row >
                <Col className="card-description" xs={12}>
                    <Image className="text-center" roundedCircle style={{width:150, verticalAlign:'text-top'}} 
                        src={avatar ? avatar : require('../assets/img/UserPlaceholder.png').default} />                        
                        <FontAwesomeIcon icon={faEdit} style={{cursor:'pointer'}} onClick={() => hiddenFileInput.current.click()} />
                        
                </Col>
                <input 
                    accept=".png, .jpg, .gif"
                    ref={hiddenFileInput} 
                    onChange={(e) => selectAvatar(e)} type="file" style={{display:'none'}} />
                <Col className="card-description" xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Token Name: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"

                    />
                </Col>
                <Col className="card-description" xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Asset Name: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"

                    />
                </Col>
                <Col className="card-description" xs={12} md={{span: 6, offset:3}}>
                    <p className="text-left">Asset URL: </p>
                    <FormControl
                        type="text"
                        className="form-input long-input"

                    />
                </Col>
                <Col className="card-description" xs={6} md={{span: 3, offset:3}} >
                    <p className="text-left">Price (in ALGO): </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"

                    />
                </Col>
                <Col className="card-description" xs={6} md={{span:3}}>
                    <p className="text-left">Period (in years): </p>
                    <FormControl
                        type="number"
                        className="form-input long-input"

                    />
                </Col>
                <Col className="card-description" xs={12} md={{span:6, offset:3}}>
                    <p className="text-left">Description: </p>
                    <FormControl
                        type="textarea"
                        className="form-input long-input"
                    />
                </Col>
                <Col className="card-description" xs={12} md={{span:6, offset:3}}>
                    <Button variant="warning" style={{width:'100%'}}>Create an NFT subscription</Button>
                </Col>
            </Row>
        </Container>
    )
}