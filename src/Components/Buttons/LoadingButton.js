import React from "react";
import { Button, Spinner } from "react-bootstrap";


export default function LoadingButton({loading, loadingText, activeText, onClick, variant, style, className}) {

    return(
        <Button 
            className={className} 
            variant={variant ? variant : 'warning'} 
            style={style} 
            disabled={loading} 
            onClick={()=>onClick()}>
            {loading ?
            <Spinner size="sm" animation="border" role="status" style={{marginRight:5}} /> : <></> }
            {loading ? 
                loadingText || 'Loading...' : activeText || 'Confirm' 
            }
        </Button>
    )
}