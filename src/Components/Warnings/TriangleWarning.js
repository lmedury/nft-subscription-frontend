import React from "react";
import {Row, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

export default function TriangleWarning({text}) {

    return(
        <Row>
            <Col xs={12} className="text-center">
                <FontAwesomeIcon icon={faWarning} className="primary-color" size="6x" />
                <h3>{text}</h3>
            </Col>
        </Row>    
    )
}