import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useDebtSystem } from "./useDebtSystem";

export const useGetUserDebtProportion = () => {
  const [userDebtProportion, setUserDebtProportion] = useState<string>("0");
  const { account } = useWeb3React();
  const contract = useDebtSystem();

  const handleGetUserDebtProportion = useCallback(async () => {
    if (account) {
      const debtProp = await contract.GetUserCurrentDebtProportion(account);
      setUserDebtProportion(ethers.utils.formatEther(debtProp).toString());
    }
  }, [contract, account]);

  return {
    userDebtProportion,
    onGetUserDebtProportion: handleGetUserDebtProportion,
  };
};
