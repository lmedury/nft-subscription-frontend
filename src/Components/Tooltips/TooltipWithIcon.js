import React from "react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TooltipWithIcon({placement, icon, text, onClick, size, bgColor}) {

    return(
        
        <OverlayTrigger
            placement={placement}
            overlay={
                <Tooltip id={`tooltip-${placement}`}>
                    {text}
                </Tooltip>
            }
            >
            <Button variant={bgColor ? bgColor : 'secondary'} onClick={() => onClick()} className="social-icon">
                <FontAwesomeIcon icon={icon} size={size ? size : '1x'} />
            </Button>
        </OverlayTrigger>
        
    )
}