import React from "react";
import { Modal} from "react-bootstrap";
import pera from '../../assets/img/Wallets/Pera.jpg';
import algosigner from '../../assets/img/Wallets/algosigner.jpg';
import myalgo from '../../assets/img/Wallets/myalgo.png';
import WalletButton from "../Buttons/WalletButtons";
import WalletConnectClass from "../../assets/js/WalletConnect";

export default function Connect(props) {

    async function getAccounts(wallet) {
        localStorage.setItem('wallet', wallet);
        if(wallet === 'pera') {
            try{
                let peraAccounts = await WalletConnectClass.PeraLogin();
                props.setAccounts(peraAccounts);
            } catch (err) {
                props.setAccounts([]);
            }
        } else if(wallet === 'algosigner') {
            try{
                let algosignerAccounts = await WalletConnectClass.AlgoSignerConnect();
                algosignerAccounts = algosignerAccounts.map(thisAccount => thisAccount.address);
                
                props.setAccounts(algosignerAccounts);
            } catch (err) {
                props.setAccounts([]);
            }
            
        } else if(wallet === 'myalgo') {
            try{
                let myAlgoAccounts = await WalletConnectClass.MyAlgoLogin();
                myAlgoAccounts = myAlgoAccounts.map(thisAccount => thisAccount.address);
                
                props.setAccounts(myAlgoAccounts);
            } catch (err) {
                props.setAccounts([]);
            }
            
        }
    }
        

    return(
        <Modal show={props.openModal} size="md" centered onHide={() => props.closeModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Connect Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <WalletButton connectWallet={() => getAccounts('pera')} imageSrc={pera} title="Pera Algo Wallet" wallet="Pera" />
                <WalletButton connectWallet={() => getAccounts('algosigner')} imageSrc={algosigner} buttonStyle={{width:'100%'}} imageStyle={{width:'80%'}} title="Algosigner" wallet="algosigner" />
                <WalletButton connectWallet={() => getAccounts('myalgo')} imageSrc={myalgo} title="My Algo Wallet" wallet="myalgo" />
            </Modal.Body>
        </Modal>
    )
}