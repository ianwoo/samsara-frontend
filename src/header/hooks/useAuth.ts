import { useCallback, useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";

enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
  // BSC = "bsc"
}

const chainId = 43113;

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: "https://api.avax-test.network/ext/bc/C/rpc" },
  supportedChainIds: [chainId],
  qrcode: true,
  bridge: "https://bridge.walletconnect.org",
});

const injected = new InjectedConnector({
  supportedChainIds: [chainId],
});

const connectorsByName = {
  ["injected"]: injected,
  ["walletconnect"]: walletconnect,
};

const nodes = ["https://api.avax-test.network/ext/bc/C/rpc"];

const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider?.request) {
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Avalanche FUJI C-Chain",
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: ["https://testnet.snowtrace.io"],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the AVAX network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();

  const login = useCallback(
    (connectorID: string) => {
      const connector =
        connectorID === "injected"
          ? connectorsByName.injected
          : connectorsByName.walletconnect;
      window.localStorage.setItem("connectorIdv2", connectorID);
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector);
            }
          } else {
            if (error instanceof NoEthereumProviderError) {
              console.error(error);
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              console.log(error);
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = undefined;
              }
            } else {
              console.error(error);
            }
          }
        });
      } else {
        console.error("cannot connect");
      }
    },
    [activate]
  );

  const logout = useCallback(() => {
    deactivate();
    if (window.localStorage.getItem("walletconnect")) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = undefined;
      window.localStorage.removeItem("walletconnect");
    }
    window.localStorage.removeItem("connectorIdv2");
  }, [deactivate]);

  return { login, logout };
};

export const useEagerConnect = () => {
  const { login } = useAuth();

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      "connectorIdv2"
    ) as ConnectorNames;
    if (connectorId) {
      login(connectorId);
    }
  }, [login]);
};

export default useAuth;
