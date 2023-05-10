import './PriceFeed.scss';

import {
  useEffect,
  useState,
} from 'react';

import { Index } from '../types/Index';
import {
  getPriceFeeds,
  getVolumes,
} from './hooks/getPriceFeeds';
import DataPanel from './subcomponents/DataPanel';

type Props = {
  indices: Index[];
};

const PriceFeed = (props: Props) => {
  const { indices } = props;
  const [selectedSynthIndex, setSelectedSynthIndex] = useState<number>(0);
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

  return historicalPrices && oneDayVolumes && oneDayChanges ? (
    <DataPanel
      selectedSynthIndex={selectedSynthIndex}
      setSelectedSynthIndex={setSelectedSynthIndex}
      historicalPrices={historicalPrices}
      oneDayVolumes={oneDayVolumes}
      oneDayChanges={oneDayChanges}
      indices={indices}
      selectedSynthKey={indices[selectedSynthIndex].currencyKey}
    />
  ) : null;
};
export default PriceFeed;
