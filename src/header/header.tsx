import './header.scss';

import React, {
  useCallback,
  useState,
} from 'react';

import {
  NavLink,
  useLocation,
} from 'react-router-dom';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { Index } from '../types/Index';
import useAuth, { useEagerConnect } from './hooks/useAuth';
import { GearSVG } from './svgs/gear';
import { SamsaraSVG } from './svgs/samsara';
import { WalletIconSVG } from './svgs/wallet';

type Props = {
  indices: Index[];
  AVAXBalance: string;
  samETHBalance: string;
  samTokenBalance: string;
  indexBalances: string[];
  reset: () => void;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header(props: Props) {
  const {
    indices,
    AVAXBalance,
    samETHBalance,
    samTokenBalance,
    indexBalances,
    reset,
    setConnected,
  } = props;
  const location = useLocation();
  const { account } = useWeb3React<Web3Provider>();
  const { login, logout } = useAuth();

  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  //callbacks
  const onConnect = useCallback(async () => {
    if (window.ethereum?.isMetaMask && window.ethereum.request) {
      login("injected");
    } else {
      window.open("https://metamask.io/");
    }
  }, [login]);

  //vars
  const balances = [
    { name: "C-AVAX (Metamask)", value: AVAXBalance },
    { name: "samETH", value: samETHBalance },
    { name: "Samsara Token", value: samTokenBalance },
  ];

  //inits
  useEagerConnect();

  return (
    <div className="header">
      <div
        className={"mask" + (showWalletModal ? " visible" : "")}
        onClick={() => setShowWalletModal(false)}
      />
      <div className={"wallet-modal" + (showWalletModal ? " open" : "")}>
        <div className="modal-header">
          <div className="title">
            <WalletIconSVG />
            <span className="account">Account</span>
          </div>
          <button className="close" onClick={() => setShowWalletModal(false)}>
            x
          </button>
        </div>
        <div className="user-profile">
          <div className="user-icon"></div>
          <span className="total-balance">Total Balance</span>
          <span className="userSETHBalance">
            {Number(samETHBalance).toFixed(5)}... sETH
          </span>
          <button className="get-sETH">Get sETH</button>
          {!account ? (
            <button className="connect-wallet" onClick={onConnect}>
              Connect Wallet
            </button>
          ) : null}
        </div>
        {account ? (
          <div className="wallet-address">
            {account.slice(0, 5) + "..." + account.slice(-4)}
            <span
              onClick={() => {
                reset();
                logout();
                setConnected(false);
              }}
            >
              Disconnect
            </span>
          </div>
        ) : null}
        <span className="asset-type">Indices</span>
        {indices.map((idx, i) => (
          <div className="asset" key={idx.name}>
            <div className="asset-title">
              <div className="asset-icon"></div>
              <span className="asset-name">{idx.name}</span>
            </div>
            <span className="amount">
              {Number(indexBalances[i]).toFixed(5) + "..."}
            </span>
          </div>
        ))}
        <span className="asset-type">Other Assets</span>
        {balances.map((balance) => (
          <div className="asset" key={balance.name}>
            <div className="asset-title">
              <div className="asset-icon"></div>
              <span className="asset-name">{balance.name}</span>
            </div>
            <span className="amount">
              {Number(balance.value).toFixed(5) + "..."}
            </span>
          </div>
        ))}
      </div>
      {SamsaraSVG("black")}
      <div className="header-menu">
        <div
          className="user-icon"
          onClick={() => {
            setShowWalletModal(true);
          }}
        ></div>
        <GearSVG />
        <NavLink to={location.pathname === "/" ? "/cycler" : "/"}>
          <div className="cycler-link">
            {location.pathname === "/" ? "Get sETH" : "Trade Now"}
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Header;
