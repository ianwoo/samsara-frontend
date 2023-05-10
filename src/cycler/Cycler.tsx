import React from "react";
import "./cycler.scss";
import ActionPanel from "./subcomponents/ActionPanel";
import Assets from "./subcomponents/Assets";

type Props = {
  AVAXBalance: string;
  samTokenBalance: string;
  samETHBalance: string;
  refreshBalances: () => void;
};

function Cycler(props: Props) {
  const { AVAXBalance, samTokenBalance, samETHBalance, refreshBalances } =
    props;

  return (
    <div className="cycler">
      <Assets
        AVAXBalance={AVAXBalance}
        samTokenBalance={samTokenBalance}
        samETHBalance={samETHBalance}
      />
      <ActionPanel
        samTokenBalance={samTokenBalance}
        samETHBalance={samETHBalance}
        refreshBalances={refreshBalances}
      />
    </div>
  );
}

export default Cycler;
