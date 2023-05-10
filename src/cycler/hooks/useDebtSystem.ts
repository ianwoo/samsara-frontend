import { useMemo } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import DebtSystem from "../../abis/DebtSystem.json";

export const useDebtSystem = () => {
  const signer = getSigner();
  return useMemo(
    () =>
      getContract(
        DebtSystem.abi,
        "0x526003287EB3984F344d1C0E336ffE44883aaC5C",
        signer
      ),
    [signer]
  );
};
