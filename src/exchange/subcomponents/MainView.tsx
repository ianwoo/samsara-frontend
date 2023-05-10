import DataPanel from "./DataPanel";
import OrderPanel from "./OrderPanel";
import Indices from "../../nft-indices.json";
import { useEffect, useState } from "react";
import { getPriceFeeds, getVolumes } from "../hooks/getPriceFeeds";

type Props = {
  selectedSynthIndex: number;
  setSelectedSynthIndex: React.Dispatch<React.SetStateAction<number>>;
  samETHBalance: string;
  indexBalances: string[];
  refreshBalances: () => void;
};

function MainView(props: Props) {
  const {
    selectedSynthIndex,
    setSelectedSynthIndex,
    samETHBalance,
    indexBalances,
    refreshBalances,
  } = props;

  const [historicalPrices, setHistoricalPrices] = useState<any[]>();
  const [oneDayVolumes, setOneDayVolumes] = useState<number[]>();
  const [oneDayChanges, setOneDayChanges] = useState<string[]>();

  useEffect(() => {
    getPriceFeeds().then((res) => {
      setHistoricalPrices(res.map((r) => r.historicalPrices));
      setOneDayChanges(res.map((r) => r.oneDayChange));
    });
    getVolumes().then((res) => setOneDayVolumes(res));
  }, []);

  return (
    <div className="main">
      {historicalPrices && oneDayVolumes && oneDayChanges ? (
        <DataPanel
          selectedSynthIndex={selectedSynthIndex}
          setSelectedSynthIndex={setSelectedSynthIndex}
          indices={Indices}
          selectedSynthKey={Indices[selectedSynthIndex].currencyKey}
          historicalPrices={historicalPrices}
          oneDayVolumes={oneDayVolumes}
          oneDayChanges={oneDayChanges}
        />
      ) : null}
      <OrderPanel
        selectedSynth={Indices[selectedSynthIndex]}
        selectedSynthBalance={indexBalances[selectedSynthIndex]}
        samETHBalance={samETHBalance}
        refreshBalances={refreshBalances}
      />
    </div>
  );
}
export default MainView;
