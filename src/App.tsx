import React, { useState, useEffect, ChangeEventHandler } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils';
import PresaleContract from "../src/contracts/presale.abi.json";
import LevenToken from "../src/contracts/leventoken.abi.json";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [buyAmount, setBuyAmount] = useState(0);
  const [presaleldAmount, setPresaledAmount] = useState(0);
  const [remainAmount, setRemainAmount] = useState(0);
  
  const contractAddress = "0x01146269E52F4Ee6cD33A8bBF85F3967DA86b767";

  async function checkAccount() {
    let web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setWalletAddress(accounts[0]);
  }

  const connectWallet = async() => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkAccount();
      } catch (err) {
        console.log('user did not add account...', err)
      }
    } else {
      checkAccount();
    }
  }

  const airdrop = async() => {
    try {
      if (window.ethereum) {
        await connectWallet();
      }
      let web3 = new Web3(window.ethereum);
      console.log(contractAddress);
      const presaleContract = new web3.eth.Contract(
        PresaleContract as AbiItem[],
        contractAddress
      );
      const response: boolean = await presaleContract.methods.airdrop().send({ from: walletAddress });
      console.log(response);
    } catch(e: any) {
      console.log(e);
    }
  }

  const getPresaledAmount = async() => {
    try {
      let web3 = new Web3(window.ethereum);
      const presaleContract = new web3.eth.Contract(
        PresaleContract as AbiItem[],
        contractAddress
      );
      const response = await presaleContract.methods.getPresaledCnt().call();
      setPresaledAmount(response / 10 ** 18);
    } catch(e) {
      console.log(e);
    }
  }

  const getRemainPresalAmount = async() => {
    try {
      let web3 = new Web3(window.ethereum);
      const presaleContract = new web3.eth.Contract(
        PresaleContract as AbiItem[],
        contractAddress
      );
      const response = await presaleContract.methods.getRemainPresaleCnt().call();
      setRemainAmount(response / 10 ** 18);
    } catch(e) { 
      console.log(e);
    }

  }

  const buyToken = async() => {
    try {
      if (window.ethereum) {
        await connectWallet();
      }
      let web3 = new Web3(window.ethereum);

      const presaleContract = new web3.eth.Contract(
        PresaleContract as AbiItem[],
        contractAddress
      );

      const amount = buyAmount; 
      const price = 0.00001875 * amount;
      console.log(contractAddress);
      const response = await presaleContract.methods.prisale(amount).send({ 
        from: walletAddress,
        value: toWei(price.toString(), "ether"),
        gas: 300000,
      });
      console.log(response);
      console.log("buyToken end");
    } catch(e: any) {
      console.log(e);
    }
  }

  const handleAmountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setBuyAmount(Number(e.target.value));
  };

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <div className="div-wallet">
          <button className="div-btn" onClick={() => connectWallet()}>Connect Wallet</button>
          <p className="div-txt">{walletAddress}</p>
        </div>
        <div className="div-airdrop">
          <button className="div-btn" onClick={() => airdrop()}>Request Airdrop</button>
        </div>
        <div className="div-buytoken">
          <input type="number" className="token-amount" value={buyAmount} onChange={handleAmountChange} />
          <button className="div-btn" onClick={() => buyToken()}>Buy Token</button>
        </div>
        <div className="div-amount">
          <p className="title">Presaled Amount : </p>
          <p className="text">{presaleldAmount}</p><br/>
          
          <p className="title">Remain Presale Amount : </p>
          <p className="text">{remainAmount}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
