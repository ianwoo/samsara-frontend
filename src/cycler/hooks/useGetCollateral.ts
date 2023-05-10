import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useCollateralSystem } from "./useCollateralSystem";

export const useGetUserTotalCollateralInETH = () => {
  const [userTotalCollateralInETH, setUserTotalCollateralInETH] =
    useState<string>("0");
  const { account } = useWeb3React();
  const contract = useCollateralSystem();

  const handleGetUserTotalCollateralInETH = useCallback(async () => {
    if (account) {
      const totalCollateral = await contract.GetUserTotalCollateralInETH(
        account
      );
      setUserTotalCollateralInETH(totalCollateral.toString());
    }
  }, [contract, account]);

  return {
    userTotalCollateralInETH,
    onGetUserTotalCollateralInETH: handleGetUserTotalCollateralInETH,
  };
};

export const useGetUserCollateral = (currencyKey: string) => {
  const [userCollateral, setUserCollateral] = useState<string>("0");
  const { account } = useWeb3React();
  const contract = useCollateralSystem();
  const bytes32 = ethers.utils.formatBytes32String(currencyKey);

  const handleGetUserCollateral = useCallback(async () => {
    if (account) {
      const uColl = await contract.GetUserCollateral(account, bytes32);
      setUserCollateral(ethers.utils.formatEther(uColl).toString());
    }
  }, [contract, account, bytes32]);

  return {
    userCollateral,
    onGetUserCollateral: handleGetUserCollateral,
  };
};
