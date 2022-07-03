import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function TextTooltip({children, description}) {

    return(
        <OverlayTrigger
            placement='top'
            overlay={
                <Tooltip >
                    {description}
                </Tooltip>
            }
            >
            {children}
        </OverlayTrigger>
    )
}