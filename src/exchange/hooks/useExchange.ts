import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback } from "react";
import { useExchangeSystem } from "./useExchangeSystem";

export const useExchange = () => {
  const { account } = useWeb3React();
  const contract = useExchangeSystem();

  const handleExchange = useCallback(
    async (
      sourceKey: string,
      amount: string,
      addr: string,
      destKey: string
    ) => {
      if (account) {
        //hardcoding to sETH for now
        const sk = ethers.utils.formatBytes32String(sourceKey);
        const dk = ethers.utils.formatBytes32String(destKey);
        const amountWei = ethers.utils.parseEther(Number(amount).toFixed(18));
        const tx = await contract.exchange(sk, amountWei, addr, dk);
        const receipt = await tx.wait();
        return receipt.status;
      }
    },
    [contract, account]
  );

  return { onExchange: handleExchange };
};
