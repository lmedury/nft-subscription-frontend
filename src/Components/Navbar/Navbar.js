import React from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Form, FormControl, DropdownButton, Dropdown, ButtonGroup, Col, Row} from "react-bootstrap";
import logo from '../../assets/img/ans-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faPlus, faChartBar, faUsers, faRoad, faDownload, faInfoCircle, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
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
                    <img
                        alt=""
                        src={logo}
                        width="200"
                        height="100"
                        className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '200px' }}
                        
                    >
                        <Nav.Link className="nav-link-left" href="/#/search" >
                            Search
                        </Nav.Link>
                        <NavDropdown className="nav-link-left" title="App" id="navbarScrollingDropdown">
                        <NavDropdown.Item className="nav-link-left" href="/#/register">
                            <FontAwesomeIcon icon={faPlus} className="navbar-icon" />
                            Register</NavDropdown.Item>
                        
                        <NavDropdown.Item className="nav-link-left" href="/#/names">
                            <FontAwesomeIcon icon={faList} className="navbar-icon" />
                            My Names</NavDropdown.Item>
                        
                        <NavDropdown.Item className="nav-link-left" href="/#/accept">
                            <FontAwesomeIcon icon={faDownload} className="navbar-icon" />
                            Accept Domain
                        </NavDropdown.Item>
                        
                        </NavDropdown>

                        <NavDropdown className="nav-link-left" title="About" id="navbarScrollingDropdown">
                        <NavDropdown.Item className="nav-link-left" href="/#/about">
                            <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" />
                            About ANS</NavDropdown.Item>
                        <NavDropdown.Item className="nav-link-left" href="/#/team">
                            <FontAwesomeIcon icon={faUsers} className="navbar-icon" />
                            Team</NavDropdown.Item>
                        {false ?
                        <NavDropdown.Item className="nav-link-left" href="/#/roadmap">
                            <FontAwesomeIcon icon={faRoad} className="navbar-icon" />
                            Roadmap
                        </NavDropdown.Item> : <></> }
                        <NavDropdown.Item className="nav-link-left" href="/#/integrations">
                            <FontAwesomeIcon icon={faDownload} className="navbar-icon" />
                            Integrations
                        </NavDropdown.Item>
                        <NavDropdown.Item className="nav-link-left" href="/#/insights">
                            <FontAwesomeIcon icon={faChartBar} className="navbar-icon" />
                            Insights
                        </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link className="nav-link-left" href="https://docs.algonameservice.com" >
                        Docs
                        </Nav.Link>
                        <Nav.Link className="nav-link-left" href="/#/payment">Payment</Nav.Link>
                        <Nav.Link className="nav-link-left" href="/#/marketplace">Marketplace</Nav.Link>
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