import { useState } from "react";
import { Index } from "../types/Index";
import "./exchange.scss";
import MainView from "./subcomponents/MainView";
import Transactions from "./subcomponents/Transactions";

type Props = {
  samETHBalance: string;
  indexBalances: string[];
  indices: Index[];
  refreshBalances: () => void;
};

function Exchange(props: Props) {
  const { samETHBalance, indexBalances, indices, refreshBalances } = props;

  const [selectedSynthIndex, setSelectedSynthIndex] = useState<number>(0);

  return (
    <div className="exchange">
      <MainView
        selectedSynthIndex={selectedSynthIndex}
        setSelectedSynthIndex={setSelectedSynthIndex}
        samETHBalance={samETHBalance}
        indexBalances={indexBalances}
        refreshBalances={refreshBalances}
      />
      <Transactions indices={indices} indexBalances={indexBalances} />
    </div>
  );
}

export default Exchange;
