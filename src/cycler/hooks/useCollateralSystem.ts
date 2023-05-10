import { useMemo } from "react";
import { getContract, getSigner } from "../../hooks/getContract";
import CollateralSystem from "../../abis/CollateralSystem.json";

export const useCollateralSystem = () => {
  const signer = getSigner();
  return useMemo(
    () =>
      getContract(
        CollateralSystem.abi,
        "0xCD0Ce887db3D0BCa6fba1Eb2621E8d18CDcBa9d5",
        signer
      ),
    [signer]
  );
};
