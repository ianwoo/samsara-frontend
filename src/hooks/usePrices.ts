import ky from "ky";
import { useCallback, useMemo, useState } from "react";
import { getContract } from "../hooks/getContract";
import Prices from "../abis/Prices.json";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";

const usePricesAbi = () => {
  return useMemo(
    () => getContract(Prices.abi, "0x0a66b58d7f3C076C3aeF164fa5F69083C00282a5"),
    []
  );
};

export const usePrice = (currencyKey: string) => {
  const [price, setPrice] = useState("0");
  const contract = usePricesAbi();

  const handleGetPrice = useCallback(async () => {
    const bytes32 = ethers.utils.formatBytes32String(currencyKey);
    const oraclePrice = await contract.getPrice(bytes32);
    const value = new BigNumber(oraclePrice.toString()).dividedBy(
      new BigNumber(10).pow(18)
    );
    setPrice(value.toString());
  }, [contract, currencyKey]);

  return { price, onGetPrice: handleGetPrice };
};

export const useCoingeckoPrice = (id: string) => {
  const [coingeckoPrice, setCoingeckoPrice] = useState<any>();

  const handleGetCoingeckoPrice = async () => {
    const result: any = await ky
      .get(
        "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=" +
          id
      )
      .json();
    setCoingeckoPrice(result[id].usd);
  };

  return { coingeckoPrice, onGetCoingeckoPrice: handleGetCoingeckoPrice };
};
