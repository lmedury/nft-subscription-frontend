import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

export default function CustomIcon({placement, icon, text, bgColor, onClick}) {

    return(
        
        <OverlayTrigger
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${placement}`}>
                    {text}
                </Tooltip>
            }
            >
            <Button onClick={() => onClick()} variant={bgColor ? bgColor : 'secondary'} className="social-icon">
                <img src={icon} alt="Content" style={{width:20}} />
            </Button>
        </OverlayTrigger>
        
    )
}