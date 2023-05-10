import {
  useGetUserTotalCollateralInETH,
  useGetUserCollateral,
} from "../hooks/useGetCollateral";
import { SETHSVG } from "../svgs/SETHSVG";
// import { useGetUserDebtProportion } from "../hooks/useGetUserDebtProportion";
import SamEthEstimate from "./SamEthEstimate";
import Price from "../../shared/Price";
import SamTokenEstimate from "./SamTokenEstimate";
import { ethers } from "ethers";
import { useGetUserDebtBalanceInETH } from "../hooks/useGetUserDebtBalanceInETH";

type Props = {
  AVAXBalance: string;
  samTokenBalance: string;
  samETHBalance: string;
};

function Assets(props: Props) {
  const { AVAXBalance, samTokenBalance, samETHBalance } = props;

  const {
    userTotalCollateralInETH: totalCollateral,
    onGetUserTotalCollateralInETH: handleGetUserTotalCollateral,
  } = useGetUserTotalCollateralInETH();

  const { userCollateral, onGetUserCollateral: handleGetUserCollateral } =
    useGetUserCollateral("SAM");

  const {
    userDebtBalanceInETH: debtBalance,
    onGetUserDebtBalanceInETH: handleGetUserDebtBalance,
  } = useGetUserDebtBalanceInETH();

  //TO ASK K.TAI: IS DEBTPROPORTION THE SAME AS COLLATERAL RATIO?!?!
  //AND IF SO, WHY AM I GETTING SUCH A MASSIVE FIGURE??
  // const {
  //   userDebtProportion: collateralRatio,
  //   onGetUserDebtProportion: handleGetUserDebtProportion,
  // } = useGetUserDebtProportion();

  handleGetUserTotalCollateral();
  handleGetUserCollateral();
  handleGetUserDebtBalance();
  // handleGetUserDebtProportion();

  const FTC = ethers.utils.formatEther(totalCollateral).toString();
  // const FCR = ethers.utils.formatEther(collateralRatio).toString();
  const FCR = debtBalance
    ? Number(FTC) / Number(ethers.utils.formatEther(debtBalance).toString())
    : 0;

  return (
    <div className="assets">
      <span className="total-balance">
        Approximate Total Balance in ETH value
      </span>
      <div className="sETH">
        <div className="sETH-icon">{SETHSVG("32")}</div>
        <div className="totalCollateral">{FTC}</div>
      </div>
      <div className="health-gauge">
        <span className="collateral-ratio">Collateral Ratio</span>
        <div className="gauge">
          <div className="body">
            <div
              className="fill"
              style={{
                transform: "rotate(" + Number(FCR) / 10 + "turn)",
                backgroundColor:
                  Number(FCR) <= 0.3
                    ? "#D76A66"
                    : Number(FCR) <= 0.5
                    ? "#DCA657"
                    : "#6DCA87",
              }}
            />
            <div className="cover">
              <span className="ratio">{Number(FCR).toFixed(2)}x</span>
            </div>
          </div>
        </div>
        <div className="gauge-label">
          <span className="bottom">0</span>
          <span className="liq">Liq.: 1.5x / Target: 5x</span>
          <span className="top">5x</span>
        </div>
      </div>
      <div className="divider" />
      <div className="title">
        <div className="title-label tcv">
          <span className="label">Total Collateral Value</span>
          <br />
          <span className="rate">
            1 SAM = <Price currencyKey="SAM" classString="" /> sETH
          </span>
        </div>
        <span className="total totalCollateral">{FTC}</span>
      </div>
      <div className="asset">
        <div className="asset-type">
          <div className="asset-icon">{SETHSVG("32")}</div>
          <div className="asset-name">
            <span className="name">SAM</span>
            <br />
            <span className="usd">USD</span>
          </div>
        </div>
        <div className="asset-amt">
          <span className="amt">{samTokenBalance}</span>
          <br />
          <span className="usd">
            <SamTokenEstimate samTokenBalance={Number(samTokenBalance)} />
          </span>
        </div>
      </div>
      <div className="subtotal staked">
        <span className="label">Staked</span>
        <span className="amt">{userCollateral}</span>
      </div>
      <div className="subtotal available">
        <span className="label">Available</span>
        <span className="amt">{samTokenBalance}</span>
      </div>
      <div className="title">
        <div className="title-label">
          <span className="label">Total Synthetic ETH Value</span>
          <br />
          <span className="rate">1 sETH = 1 ETH</span>
        </div>
        <span className="total totalCollateralValue">{samETHBalance}</span>
      </div>
      <div className="asset">
        <div className="asset-type">
          <div className="asset-icon">{SETHSVG("32")}</div>
          <div className="asset-name">
            <span className="name">sETH</span>
            <br />
            <span className="usd">USD</span>
          </div>
        </div>
        <div className="asset-amt">
          <span className="amt">{samETHBalance}</span>
          <br />
          <SamEthEstimate samETHBalance={Number(samETHBalance)} />
        </div>
      </div>
      <div className="divider" />
      <span className="where-to-buy">Where to buy SAM?</span>
    </div>
  );
}
export default Assets;
