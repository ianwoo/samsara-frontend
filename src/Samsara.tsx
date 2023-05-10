// import { useCallback, useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// import { Web3Provider } from "@ethersproject/providers";
// import { useWeb3React } from "@web3-react/core";
import About from "./about/About";
import Footer from "./footer/Footer";
import HeaderV2, { HeaderBG } from "./header_v2/header_v2";
import Indices from "./nft-indices.json";
import Partners from "./partners/Partners";
import PriceFeed from "./pricefeed/PriceFeed";
import Splash from "./splash/Splash";

function Samsara() {
  // const [connected, setConnected] = useState(false); //control state
  // const { account } = useWeb3React<Web3Provider>();

  // const {
  //   balance: AVAXBalance,
  //   fetchBalance: fetchAVAXBalance,
  //   resetBalance: resetAVAXBalance,
  // } = useMetamaskAvaxBalance();
  // const {
  //   balance: samETHBalance,
  //   fetchBalance: fetchSamETHBalance,
  //   resetBalance: resetSamETHBalance,
  // } = useARC20Balance("0xC96CdFb35036a85f06e8f387F8B38cce2E12c8e5");
  // const {
  //   balance: samTokenBalance,
  //   fetchBalance: fetchSamTokenBalance,
  //   resetBalance: resetSamTokenBalance,
  // } = useARC20Balance("0x6F6C956Eda3f610B945CA3FE97F21D135ddEE829");
  // const {
  //   balances: indexBalances,
  //   fetchBalances,
  //   resetBalances,
  // } = useMultiARC20Balance(Indices.map((idx) => idx.address));

  // const refreshBalances = useCallback(() => {
  //   fetchAVAXBalance();
  //   fetchSamETHBalance();
  //   fetchSamTokenBalance();
  //   fetchBalances();
  // }, [
  //   fetchAVAXBalance,
  //   fetchSamETHBalance,
  //   fetchSamTokenBalance,
  //   fetchBalances,
  // ]);

  // const reset = useCallback(() => {
  //   resetAVAXBalance();
  //   resetSamETHBalance();
  //   resetSamTokenBalance();
  //   resetBalances();
  // }, [
  //   resetAVAXBalance,
  //   resetSamETHBalance,
  //   resetSamTokenBalance,
  //   resetBalances,
  // ]);

  // useEffect(() => {
  //   if (!connected && account) {
  //     refreshBalances();
  //     setConnected(true);
  //   }
  // }, [connected, account, refreshBalances]);

  const layout = (routeElement: JSX.Element, headerBG: HeaderBG) => [
    // <Header
    //   key="header"
    //   indices={Indices}
    //   AVAXBalance={AVAXBalance}
    //   samETHBalance={samETHBalance}
    //   samTokenBalance={samTokenBalance}
    //   indexBalances={indexBalances}
    //   reset={reset}
    //   setConnected={setConnected}
    // />,
    routeElement,
    <HeaderV2 key="header" bg={headerBG} />,
    <Footer />,
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={layout(<Splash key="splash" />, HeaderBG.Black)} />
        <Route path="/about" element={layout(<About key="about" />, HeaderBG.White)} />
        <Route path="/partners" element={layout(<Partners key="partners" />, HeaderBG.White)} />
        <Route path="/feeds" element={layout(<PriceFeed key="feeds" indices={Indices} />, HeaderBG.White)} />
        {/* <Route
          path="/exchange"
          element={layout(
            <Exchange
              key="exchange"
              samETHBalance={samETHBalance}
              indexBalances={indexBalances}
              indices={Indices}
              refreshBalances={refreshBalances}
            />
          )}
        />
        <Route
          path="/cycler"
          element={layout(
            <Cycler
              key="cycler"
              AVAXBalance={AVAXBalance}
              samTokenBalance={samTokenBalance}
              samETHBalance={samETHBalance}
              refreshBalances={refreshBalances}
            />
          )}
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Samsara;
