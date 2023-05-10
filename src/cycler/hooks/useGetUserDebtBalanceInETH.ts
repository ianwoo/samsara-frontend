import { useWeb3React } from "@web3-react/core";
import { useCallback, useState } from "react";
import { useDebtSystem } from "./useDebtSystem";

export const useGetUserDebtBalanceInETH = () => {
  const [userDebtBalanceInETH, setUserDebtBalanceInETH] = useState<string>();
  const { account } = useWeb3React();
  const contract = useDebtSystem();

  const handleGetUserDebtBalanceInETH = useCallback(async () => {
    if (account) {
      const debtBalance = await contract.GetUserDebtBalanceInETH(account);
      setUserDebtBalanceInETH(debtBalance[0].toString());
    }
  }, [contract, account]);

  return {
    userDebtBalanceInETH: userDebtBalanceInETH,
    onGetUserDebtBalanceInETH: handleGetUserDebtBalanceInETH,
  };
};
