import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function CircleLoader({loading, text}) {

    return(
        <div>
            {loading ? 
            <div className="text-center">
                <FontAwesomeIcon size="6x" className="fa-spin primary-color" icon={faCircleNotch} />
                <p>{text ? text : 'Loading'}</p>
            </div>
            : <></> }
        </div>
    )
}