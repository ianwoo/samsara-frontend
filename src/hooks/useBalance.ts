import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import { getContract, getSigner, multicall } from "../hooks/getContract";
import ARC20 from "../abis/ARC20Abi.json";

export const useMetamaskAvaxBalance = () => {
  const [balance, setBalance] = useState("0");
  const { account } = useWeb3React<Web3Provider>();

  const fetchBalance = useCallback(async () => {
    const provider = window.ethereum;
    if (provider?.request && account) {
      const tokenBalance: any = await provider.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });
      const value = new BigNumber(tokenBalance.toString()).dividedBy(
        new BigNumber(10).pow(18)
      );
      setBalance(value.toString());
    }
  }, [account]);

  return { balance, fetchBalance, resetBalance: () => setBalance("0") };
};

export const useARC20Balance = (address: string) => {
  const [balance, setBalance] = useState("0");
  const { account } = useWeb3React<Web3Provider>();
  const signer = getSigner();

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    const abi = ARC20.abi;
    const contract = getContract(abi, address, signer);
    const tokenBalance = await contract.balanceOf(account);
    const value = new BigNumber(tokenBalance.toString()).dividedBy(
      new BigNumber(10).pow(18)
    );
    setBalance(value.toString());
  }, [account, address, signer]);

  return { balance, fetchBalance, resetBalance: () => setBalance("0") };
};

export const useMultiARC20Balance = (addresses: string[]) => {
  const [balances, setBalances] = useState<string[]>([]);
  const { account } = useWeb3React<Web3Provider>();

  const fetchBalances = useCallback(async () => {
    if (!account) return;
    const abi = ARC20.abi;
    const calls = addresses.map((a) => ({
      address: a,
      name: "balanceOf",
      params: [account],
    }));
    const tokenBalances = await multicall(abi, calls);
    const values = tokenBalances.map((b: any) =>
      new BigNumber(b.toString()).dividedBy(new BigNumber(10).pow(18))
    );
    const stringValues = values.map((v: any) => v.toString());
    setBalances(stringValues);
  }, [account, addresses]);

  return { balances, fetchBalances, resetBalances: () => setBalances([]) };
};
