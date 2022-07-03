import React from "react";
import { Dropdown, Form, Row, Col } from "react-bootstrap";
import WalletConnectClass from "../../assets/js/WalletConnect";
import Utility from "../../assets/js/Utility";


export default function SelectWallet({chooseAccount}) {

    const [wallet, setWallet] = React.useState('Choose Wallet');
    const [accounts, setAccounts] = React.useState([]);
    const [account, setAccount] = React.useState('Account');

    const selectWallet = async (e) => {
        setWallet(e);
        let walletAccounts;
        try{
            if(e === 'Pera') {
                walletAccounts = await WalletConnectClass.PeraLogin();  
            } else if(e === 'Algosigner') {
                walletAccounts = await WalletConnectClass.AlgoSignerConnect();
                walletAccounts = walletAccounts.map(account => account.address);
            } else if(e === 'MyAlgo') {
                walletAccounts = await WalletConnectClass.MyAlgoLogin();
                walletAccounts = walletAccounts.map(account => account.address);
            }
            setAccounts(walletAccounts);
            if(walletAccounts.length > 0) {
                setAccount(walletAccounts[0]);
                chooseAccount(walletAccounts[0]);
            }
        } catch (err) {
            
        }
        
    }

    const selectAccount = (e) => {
        setAccount(e);
        chooseAccount(e);
    }

    return(
        <div className="card-description">
            <Row>
                <Col xs="12" md="6">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Select Wallet:</Form.Label>
                        <Dropdown onSelect={(e) => selectWallet(e)}>
                            <Dropdown.Toggle variant="outline-light">
                                {wallet}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                            <Dropdown.Item eventKey="Pera" >Pera </Dropdown.Item>
                            <Dropdown.Item eventKey="Algosigner" >Algosigner</Dropdown.Item>
                            <Dropdown.Item eventKey="MyAlgo" >MyAlgo</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </Form.Group>
                </Col>
                {accounts && accounts.length > 0 ? 
                <Col xs="12" md="6">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Select Account:</Form.Label>
                        <Dropdown onSelect={(e) => selectAccount(e)}>
                            <Dropdown.Toggle variant="outline-light">
                                {Utility.sliceAccount(account)}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {accounts.map(account => 
                                    <Dropdown.Item key={account} eventKey={account}>{Utility.sliceAccount(account)}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </Form.Group>
                </Col> : <></> }
            </Row>
        </div>
        
    )
}