import { useState } from "react";
import { BigNumber } from "bignumber.js";
import { useBurnAndUnstakeMax } from "../hooks/useBurnAndUnstakeMax";
import { useStakeAndBuildMax } from "../hooks/useStakeAndBuildMax";
import { ArrowDownSVG } from "../svgs/arrowDown";
import { SETHSVG } from "../svgs/SETHSVG";
import { useCheckApprove, useApprove } from "../hooks/useApprove";
import Price from "../../shared/Price";

type Props = {
  samETHBalance: string;
  samTokenBalance: string;
  refreshBalances: () => void;
};

enum ActionTab {
  Stake = 0,
  Withdraw = 1,
  Earn = 2,
}

function ActionPanel(props: Props) {
  const { samETHBalance, samTokenBalance, refreshBalances } = props;

  const [activeTab, setActiveTab] = useState<ActionTab>(ActionTab.Stake);
  const [waitingOnApproval, setWaitingOnApproval] = useState<boolean>(false);
  const [approvalFailed, setApprovalFailed] = useState<boolean>(false);
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);
  const [transactionFailed, setTransactionFailed] = useState<boolean>(false);

  const [input, setInput] = useState("");

  const { onStakeAndBuildMax: handleStakeAndBuildMax } = useStakeAndBuildMax();
  const { onBurnAndUnstakeMax: handleBurnAndUnstakeMax } =
    useBurnAndUnstakeMax();
  const { onCheckApprove } = useCheckApprove(
    "0x6F6C956Eda3f610B945CA3FE97F21D135ddEE829", //SAM tokens
    "0xCD0Ce887db3D0BCa6fba1Eb2621E8d18CDcBa9d5" //collateral system contract
  );
  const { onApprove: handleApprove } = useApprove();

  const confirmAction = async () => {
    const approved = await onCheckApprove();
    if (approved) {
      setProcessingTransaction(true);
      try {
        activeTab === ActionTab.Stake
          ? await handleStakeAndBuildMax(input)
          : await handleBurnAndUnstakeMax(input);
      } catch (e) {
        console.log(e);
        setTransactionFailed(true);
      } finally {
        setProcessingTransaction(false);
        refreshBalances();
      }
    } else {
      approve(
        "0x6F6C956Eda3f610B945CA3FE97F21D135ddEE829", //SAM tokens
        "0xCD0Ce887db3D0BCa6fba1Eb2621E8d18CDcBa9d5" //collateral system contract
      );
    }
  };

  const approve = async (
    approveTokenAddress: string,
    contractAddress: string
  ) => {
    setWaitingOnApproval(true);
    try {
      await handleApprove(approveTokenAddress, contractAddress);
    } catch (e) {
      console.error(e);
      setApprovalFailed(true);
    } finally {
      setWaitingOnApproval(false);
      refreshBalances();
    }
  };

  const tabs = [ActionTab.Stake, ActionTab.Withdraw, ActionTab.Earn];
  const tabTexts = ["Stake", "Withdraw", "Earn"];

  const modalOff =
    !waitingOnApproval && !approvalFailed && !processingTransaction;

  return (
    <div className="action-panel">
      {waitingOnApproval ? (
        <div className="waitingOnApproval modal">Waiting for approval...</div>
      ) : null}
      {approvalFailed ? (
        <div className="approvalFailed modal">
          Approval Failed.
          <button onClick={() => setApprovalFailed(false)}>OK</button>
        </div>
      ) : null}
      {processingTransaction ? (
        <div className="processingTransaction modal">
          Processing transaction...
        </div>
      ) : null}
      {transactionFailed ? (
        <div className="transactionFailed modal">
          Transaction failed.
          <button onClick={() => setTransactionFailed(false)}>OK</button>
        </div>
      ) : null}

      {modalOff
        ? [
            <div key="actions" className="tabs actions">
              {tabs.map((t) => (
                <div
                  key={tabTexts[t]}
                  className={
                    "tab " + tabTexts[t] + (activeTab === t ? " selected" : "")
                  }
                  onClick={() => {
                    setActiveTab(t);
                  }}
                >
                  {tabTexts[t]}
                </div>
              ))}
            </div>,
            <div key="info-text" className="info-text">
              <span className="stakingAPR">Staking APR: --%</span>
              {activeTab === ActionTab.Stake ? (
                <span className="action-description">
                  Provide SAM as collateral to borrow sETH to trade NFT index.
                </span>
              ) : null}
              {activeTab === ActionTab.Withdraw ? (
                <span className="action-description">
                  Withdraw your SAM by burning your sETH.
                </span>
              ) : null}
              {activeTab === ActionTab.Earn ? (
                <span className="action-description">
                  Collect your rewards for staking SAM!
                </span>
              ) : null}
              <span className="rate">
                1 SAM = <Price currencyKey="SAM" classString="" /> sETH
              </span>
            </div>,
          ]
        : null}

      {modalOff && activeTab !== ActionTab.Earn ? (
        <div className="action-amounts">
          <div className="input amount">
            <div className="label">
              {SETHSVG("40")}
              <div className="text">
                {activeTab === ActionTab.Stake ? (
                  <span className="bold stake-sam">Stake SAM</span>
                ) : null}
                {activeTab === ActionTab.Withdraw ? (
                  <span className="bold burn-eth">Burn sETH</span>
                ) : null}
                {activeTab === ActionTab.Stake ? (
                  <span className="subtext available-sam">
                    Available: {samTokenBalance}
                  </span>
                ) : null}
                {activeTab === ActionTab.Withdraw ? (
                  <span className="subtext available-seth">
                    Available: {samETHBalance}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="input">
              <input
                className={
                  "bigbold" +
                  (new BigNumber(input).comparedTo(
                    new BigNumber(
                      activeTab === ActionTab.Stake
                        ? samTokenBalance
                        : samETHBalance
                    )
                  ) > 0
                    ? " invalid"
                    : "")
                }
                type="number"
                min={0}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button
                className="max"
                onClick={() =>
                  setInput(
                    activeTab === ActionTab.Stake
                      ? samTokenBalance
                      : samETHBalance
                  )
                }
              >
                Max
              </button>
            </div>
          </div>
          <div className="arrow">
            <ArrowDownSVG />
          </div>
          <div className="output amount">
            <div className="label">
              {SETHSVG("40")}
              <div className="text">
                {activeTab === ActionTab.Stake
                  ? [
                      <span key="borrow-sam" className="bold borrow-sam">
                        Mint sETH
                      </span>,
                      <span
                        key="samETHBalance"
                        className="subtext samETHBalance"
                      >
                        Balance: {samETHBalance}
                      </span>,
                    ]
                  : null}
                {activeTab === ActionTab.Withdraw
                  ? [
                      <span key="withdraw-sam" className="bold withdraw-sam">
                        Withdraw SAM
                      </span>,
                      <span
                        key="samTokenBalance"
                        className="subtext samTokenBalance"
                      >
                        Balance: {samTokenBalance}
                      </span>,
                    ]
                  : null}
              </div>
            </div>
            <div className="bigbold expectedOutput"></div>
          </div>
          <span className="postActionRatio">Your new collateral ratio: --</span>
          <button className="confirm" onClick={confirmAction}>
            Confirm
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ActionPanel;
