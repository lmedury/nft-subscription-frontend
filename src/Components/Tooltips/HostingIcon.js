import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import ipfslogo from '../../assets/img/ipfs.png';
import skynetlogo from '../../assets/img/skynet.svg';

export default function HostingIcon({placement, isSkynetHash, text, bgColor}) {

    return(
        
        <OverlayTrigger
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${placement}`}>
                    {text}
                </Tooltip>
            }
            >
            <Button variant={bgColor ? bgColor : 'secondary'} className="social-icon">
                <img src={isSkynetHash ? skynetlogo : ipfslogo} alt="Content" style={{width:20}} />
            </Button>
        </OverlayTrigger>
        
    )
}