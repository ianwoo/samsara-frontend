import { useMemo } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import ExchangeSystem from "../../abis/ExchangeSystem.json";

export const useExchangeSystem = () => {
  const signer = getSigner();
  return useMemo(
    () =>
      getContract(
        ExchangeSystem.abi,
        "0xd3dAf0CA9B84Ae8fcAD6448514A715481b05D05e",
        signer
      ),
    [signer]
  );
};
