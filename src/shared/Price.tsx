import { useEffect, useState } from "react";
import { useIsBrowserTabActive } from "../hooks/useIsBrowserTabActive";
import { usePrice } from "../hooks/usePrices";

type Props = {
  currencyKey: string;
  classString: string;
};

const INTERVAL = 10000;

function Price(props: Props) {
  const { currencyKey, classString } = props;

  const { price, onGetPrice: handleGetPrice } = usePrice(currencyKey);
  const isBrowserTabActiveRef = useIsBrowserTabActive();

  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setRefreshCounter((prev) => prev + 1);
      }
    }, INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    handleGetPrice();
  }, [refreshCounter, handleGetPrice]);

  return <span className={classString}>{Number(price).toFixed(2)}</span>;
}

export default Price;
