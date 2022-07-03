import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function MarketplaceDomain({domain, onClick}) {

    return(
        <OverlayTrigger
            placement='top'
            overlay={
                <Tooltip >
                    {domain}.algo
                </Tooltip>
            }
            >
            <div className="primary-bg" style={{borderTopLeftRadius:10, borderTopRightRadius:10}} onClick={() => onClick()}>
                <h5 className="text-center marketplace-domain" >{domain.length > 10 ? domain.substr(0,8)+`.....${domain[domain.length - 2]}${domain[domain.length - 1]}.algo` :  domain+'.algo'}</h5>
            </div>
        </OverlayTrigger>
    )
}