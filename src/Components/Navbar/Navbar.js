import React from "react";
import { Navbar, Container, Nav, Button, Form, FormControl, DropdownButton, Dropdown, ButtonGroup, Col, Row} from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function NavigationBar(props) {

    const [theme, setTheme] = React.useState('dark-theme');
    const [account, setAccount] = React.useState('');
    const [domain, setDomain] = React.useState('');
    const navigate = useNavigate();

    const sliceAccount = (account) => {
        if(!account) return;
        let accountString = account;
        accountString = account.slice(0,6);
        accountString = accountString+'....';
        accountString = accountString+account.slice(54,57);
        return accountString;
    }

    React.useEffect(() => {
        
        if(props.accounts.length > 0) {
            let selectedAccount = sliceAccount(props.accounts[0]);
            setAccount(selectedAccount);
        }
        
    }, [props.accounts.length, props.accounts])

    const searchDomain = () => {
        let domainToSearch = domain;
        domainToSearch = domainToSearch.split('.algo')[0];
        domainToSearch = domainToSearch.split('.')[0];
        setDomain('');
        navigate(`/search/${domainToSearch}`);
    }

    return(
        <Navbar className="dark-navbar" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/#/">
                    NFT Subscription
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '200px' }}
                        
                    >
                        <Nav.Link className="nav-link-left" href="/#/create" >
                            Create Subscription
                        </Nav.Link>
                        <Nav.Link className="nav-link-left" href="/#/subscribe" >
                            Subscribe
                        </Nav.Link>
                        <Nav.Link className="nav-link-left" href="/#/my-subscriptions" >
                            My Subscriptions
                        </Nav.Link>
                        
                    </Nav>

                    {false ? 
                    <FontAwesomeIcon 
                        icon={theme === 'dark-theme' ? faSun : faMoon} size="2x" 
                        style={{marginRight:'2%', cursor:'pointer'}}
                        onClick={() => {
                            if(theme === 'dark-theme') {
                                setTheme('light-theme');
                                props.changeTheme('light-theme');
                            } else if(theme === 'light-theme') {
                                setTheme('dark-theme');
                                props.changeTheme('dark-theme');
                            }
                        }}
                    
                    /> : <></> }
                    

                        {false ?  
                        <Form className="d-flex">
                            <FormControl
                            type="search"
                            placeholder="Search .algo name"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => setDomain(e.target.value)}
                            onKeyPress={(e) => {
                                if(e.key === 'Enter') {
                                    searchDomain();
                                }
                            }}
                            />
                            
                        </Form> : <></> }
                        <Row>
                            <Col className="d-none d-md-block">
                                {localStorage.getItem('wallet') === null || localStorage.getItem('address') === 'null' ?
                                <Button onClick={() => props.connectWallet()} variant="warning">Connect Wallet</Button> :
                                <DropdownButton 
                                    
                                    as={ButtonGroup}
                                    variant="outline-light"
                                    title={account ? account : localStorage.getItem('address') ? sliceAccount(localStorage.getItem('address')) : ''}
                                    onSelect={(e) => {
                                        if(e !== 'Disconnect') {
                                            localStorage.setItem('address', e);
                                            let accountString = e;
                                            accountString = sliceAccount(e);
                                            setAccount(accountString);
                                            window.location.reload();
                                        } else {

                                        }
                                        
                                    }}
                                    >
                                    {props.accounts?.map((account, index) => 
                                        <Dropdown.Item key={account} active={index === 0 ? true : false} eventKey={account}>{sliceAccount(account)}</Dropdown.Item>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item key="Disconnect" onClick={() => props.disconnectWallet()}>Disconnect</Dropdown.Item>
                                </DropdownButton> }
                            </Col>
                            <Col className="d-md-none text-left" style={{marginTop:'10%'}}>
                                {localStorage.getItem('wallet') === null || localStorage.getItem('address') === 'null' ?
                                <Button onClick={() => props.connectWallet()} variant="warning">Connect Wallet</Button> :
                                <DropdownButton 
                                    
                                    as={ButtonGroup}
                                    variant="outline-light"
                                    title={account ? account : localStorage.getItem('address') ? sliceAccount(localStorage.getItem('address')) : ''}
                                    onSelect={(e) => {
                                        if(e !== 'Disconnect') {
                                            localStorage.setItem('address', e);
                                            let accountString = e;
                                            accountString = sliceAccount(e);
                                            setAccount(accountString);
                                            window.location.reload();
                                        } else {

                                        }
                                        
                                    }}
                                    >
                                    {props.accounts?.map((account, index) => 
                                        <Dropdown.Item key={account} active={index === 0 ? true : false} eventKey={account}>{sliceAccount(account)}</Dropdown.Item>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item key="Disconnect" onClick={() => props.disconnectWallet()}>Disconnect</Dropdown.Item>
                                </DropdownButton> }        
                            </Col>
                            
                        </Row>
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
    )
}