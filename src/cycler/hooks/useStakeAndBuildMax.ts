import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback } from "react";
import { useCollateralSystem } from "./useCollateralSystem";

export const useStakeAndBuildMax = () => {
  const { account } = useWeb3React();
  const contract = useCollateralSystem();

  const handleStakeAndBuildMax = useCallback(
    async (amount: string) => {
      if (account) {
        //hardcoding to SAM coin for now
        const currencyKey = ethers.utils.formatBytes32String("SAM");
        const amountWei = ethers.utils.parseEther(amount);
        const tx = await contract.stakeAndBuildMax(currencyKey, amountWei);
        const receipt = await tx.wait();
        return receipt.status;
      }
    },
    [contract, account]
  );

  return { onStakeAndBuildMax: handleStakeAndBuildMax };
};
