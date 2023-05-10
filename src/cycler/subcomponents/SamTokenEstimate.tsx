import ky from "ky";
import { useEffect, useState } from "react";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { usePrice } from "../../hooks/usePrices";

type Props = {
  samTokenBalance: number;
};

const INTERVAL = 10000;

function SamTokenEstimate(props: Props) {
  const { samTokenBalance } = props;

  const isBrowserTabActiveRef = useIsBrowserTabActive();
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>();
  const { price, onGetPrice: handleGetPrice } = usePrice("SAM");

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    ky.get(
      "https://api.coingecko.com/api/v3/simple/price?vs_currencies=USD&ids=ethereum"
    )
      .json()
      .then((res: any) => setEthPrice(res.ethereum.usd));
  }, [refreshCounter]);

  handleGetPrice();

  return (
    <span className="usd">
      ~${price && ethPrice ? samTokenBalance * Number(price) * ethPrice : "..."}
    </span>
  );
}

export default SamTokenEstimate;
