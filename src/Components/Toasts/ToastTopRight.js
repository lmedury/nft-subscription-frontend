import React from "react";
import { ToastContainer, Toast } from "react-bootstrap";

export default function ToastTopRight(props) {

    return(
        <ToastContainer position="top-end">
            <Toast 
                show={props.showToast} 
                onClose={props.closeToast}
                bg={props.bg ? props.bg : ''}
                >
                <Toast.Header>
                    <strong className="me-auto">ANS</strong>
                </Toast.Header>
                <Toast.Body style={{color:'black'}}>
                    {props.toastMessage}
                </Toast.Body>
            </Toast>
        </ToastContainer>
        
    )
}
