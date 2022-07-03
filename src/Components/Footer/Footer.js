import React from "react";

import {Row, Col} from 'react-bootstrap';
import { faTwitter, faDiscord, faMedium, faYoutube} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer(props) {

    return(
        <div className="footer no-overflow text-left" >
            <Row style={{marginTop:'3%', marginBottom:'3%'}}>
                <Col xs={{span: 5, offset:1}} md={{span:2, offset:1}} lg={{span:2, offset:2}}>
                    <h5 className="footer-links"><strong>ANS</strong></h5>
                    <a className="footer-links" href="/#/about">About</a>
                    <a className="footer-links" href="/#/team">Team</a>
                    <a className="footer-links" href="/#/integrations">Integrations</a>
                </Col>
                <Col xs={{span: 5, offset:1}} md={{span:2, offset:1}} lg={{span:2, offset:0}}>
                    <h5 className="footer-links"><strong>Domains</strong></h5>
                    <a className="footer-links" href="/#/names">My Domains</a>
                    <a className="footer-links" href="/#/register">Register</a>
                    <a className="footer-links" href="/#/search">Search</a>
                    <a className="footer-links" href="/#/accept">Accept Domain</a>
                    <a className="footer-links" href="/#/insights">Name Insights</a>
                </Col>
                <Col xs={{span: 5, offset:1}} md={{span:2, offset:1}} lg={{span:2, offset:0}}>
                    <h5 className="footer-links"><strong>Docs</strong></h5>
                    <a className="footer-links" href="https://docs.algonameservice.com/technical-details/design">Design</a>
                    <a className="footer-links" href="https://docs.algonameservice.com/technical-details/name-policy">Name Policy</a>
                    <a className="footer-links" href="https://docs.algonameservice.com/rest-api-and-sdks/javascript-sdk">Javascript SDK</a>
                    <a className="footer-links" href="https://docs.algonameservice.com/rest-api-and-sdks/python-sdk">Python SDK</a>
                    <a className="footer-links" href="https://docs.algonameservice.com/rest-api-and-sdks/rest-api">REST API</a>
                </Col>
                <Col xs={{span: 5, offset:1}} md={{span:2, offset:1}} lg={{span:2, offset:0}}>
                    <h5 className="footer-links"><strong>Follow us:</strong></h5>
                    <a className="no-decoration" href="https://twitter.com/algonameservice" rel="noreferrer" target="_blank"><FontAwesomeIcon icon={faTwitter} className="social-icon" size="2x" /></a>
                                <a className="no-decoration" href="https://discord.com/invite/PvRf2zWf4W" rel="noreferrer" target="_blank"><FontAwesomeIcon icon={faDiscord} className="social-icon" size="2x" /></a>
                                <a className="no-decoration" href="https://algonameservice.medium.com" rel="noreferrer" target="_blank"><FontAwesomeIcon icon={faMedium} className="social-icon" size="2x" /></a>
                                <a className="no-decoration" href="https://www.youtube.com/channel/UCRzd2RRsfigFCQp2mcmv0xQ/videos" rel="noreferrer" target="_blank"><FontAwesomeIcon icon={faYoutube} className="social-icon" size="2x" /></a>
                                <a className="no-decoration" href="mailto:contact@algonameservice.com" rel="noreferrer" target="_blank"><FontAwesomeIcon icon={faEnvelope} className="social-icon" size="2x" /></a>
                </Col>
            </Row>
        </div>
    )
}