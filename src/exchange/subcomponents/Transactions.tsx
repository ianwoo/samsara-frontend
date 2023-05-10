import { useState } from "react";
import { Index } from "../../types/Index";

type Props = {
  indices: Index[];
  indexBalances: string[];
};

enum TxnTab {
  Positions = 0,
  History = 1,
}

function Transactions(props: Props) {
  const { indices, indexBalances } = props;
  const [activeTab, setActiveTab] = useState<TxnTab>(TxnTab.Positions);

  return (
    <div className="transaction-history">
      <div className="txn-tabs">
        <div
          className={
            "tab positions" +
            (activeTab === TxnTab.Positions ? " selected" : "")
          }
          onClick={() => setActiveTab(TxnTab.Positions)}
        >
          Positions
        </div>
        <div
          className={
            "tab history" + (activeTab === TxnTab.History ? " selected" : "")
          }
          onClick={() => setActiveTab(TxnTab.History)}
        >
          History
        </div>
      </div>
      <div className="txn-table">
        {indices.map((idx, i) => (
          <div className="asset" key={idx.name}>
            <div className="asset-title">
              <div className="asset-icon"></div>
              <span className="asset-name">{idx.name}</span>
            </div>
            <span className="amount">
              {Number(indexBalances[i]).toFixed(5) + "..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Transactions;
