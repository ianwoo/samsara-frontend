import ky from "ky";
import { ethers } from "ethers";
import Indices from "../../nft-indices.json";

type PriceFeed = {
  historicalPrices: any[];
  oneDayChange: string;
};

export const getPriceFeeds = async () => {
  const priceFeeds: PriceFeed[] = await Promise.all(
    Indices.map(async (idx) =>
      ky
        .get("http://18.119.96.11:8080/twap/" + idx.currencyKey)
        .json()
        .then((res: any) => {
          return {
            historicalPrices: res,
            oneDayChange: (
              1 -
              Number(
                ethers.utils
                  .parseEther(res[res.length - 49].twap.toString())
                  .toString()
              ) /
                Number(
                  ethers.utils
                    .parseEther(res[res.length - 1].twap.toString())
                    .toString()
                )
            ).toString(),
          };
        })
    )
  );

  return priceFeeds;
};

export const getVolumes = async () => {
  const volumes: number[] = await Promise.all(
    Indices.map(async (idx) =>
      ky
        .get(
          "https://api.opensea.io/api/v1/collection/" +
            idx.openseaApiKey +
            "/stats"
        )
        .json()
        .then((res: any) => {
          return res.stats.one_day_volume;
        })
    )
  );
  return volumes;
};
