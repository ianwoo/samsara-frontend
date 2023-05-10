import ky from "ky";
import { useEffect, useState } from "react";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";

type Props = {
  samETHBalance: number;
};

const INTERVAL = 10000;

function SamEthEstimate(props: Props) {
  const { samETHBalance } = props;

  const isBrowserTabActiveRef = useIsBrowserTabActive();
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>();

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

  return (
    <span className="usd">~${ethPrice ? samETHBalance * ethPrice : "..."}</span>
  );
}

export default SamEthEstimate;
