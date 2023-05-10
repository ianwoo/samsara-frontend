import { useWeb3React } from "@web3-react/core";
import ky from "ky";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useIsBrowserTabActive } from "../../hooks/useIsBrowserTabActive";
import { usePrice } from "../../hooks/usePrices";
import { Index } from "../../types/Index";
import { useExchange } from "../hooks/useExchange";

type Props = {
  selectedSynth: Index;
  selectedSynthBalance: string;
  samETHBalance: string;
  refreshBalances: () => void;
};

const INTERVAL = 10000;

function OrderPanel(props: Props) {
  const {
    selectedSynth,
    selectedSynthBalance,
    samETHBalance,
    refreshBalances,
  } = props;

  const { account } = useWeb3React();

  const { price: selectedSynthPrice, onGetPrice: handleGetSynthPrice } =
    usePrice(selectedSynth.currencyKey);

  const isBrowserTabActiveRef = useIsBrowserTabActive();
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>();

  const { onExchange: handleExchange } = useExchange();

  const [isBuying, setIsBuying] = useState<boolean>(true);
  const [processingTransaction, setProcessingTransaction] =
    useState<boolean>(false);
  const [transactionFailed, setTransactionFailed] = useState<boolean>(false);

  const [input, setInput] = useState<string>("0.0");
  const [amount, setAmount] = useState<string>("0");
  const [USDvalue, setUSDvalue] = useState<string>("");

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

  //since we have to rerender every 10 secs *anyway*, we might as well just run this on every render
  handleGetSynthPrice();

  useEffect(() => {
    const handleAmountCalc = () => {
      input === ""
        ? setAmount("")
        : isBuying
        ? setAmount(
            new BigNumber(input)
              .dividedBy(new BigNumber(selectedSynthPrice))
              .toString()
          )
        : setAmount(
            new BigNumber(input)
              .times(new BigNumber(selectedSynthPrice))
              .toString()
          );

      setUSDvalue(
        input.length > 0
          ? new BigNumber(input.length > 0 ? input : "0")
              .times(new BigNumber(ethPrice ? ethPrice.toString() : "1"))
              .toFixed(2)
          : ""
      );
    };
    handleAmountCalc();
  }, [input, isBuying, selectedSynthPrice, ethPrice]);

  const maxPurchaseableCalc =
    samETHBalance !== "0" && selectedSynthPrice !== "0"
      ? new BigNumber(samETHBalance)
          .dividedBy(new BigNumber(selectedSynthPrice))
          .toString()
      : "0";
  const [maxPurchaseable, setMaxPurchaseable] =
    useState<string>(maxPurchaseableCalc);
  useEffect(() => {
    setMaxPurchaseable(maxPurchaseableCalc);
  }, [samETHBalance, selectedSynthPrice, maxPurchaseableCalc]);

  const quarters = [0.25, 0.5, 0.75, 1];
  const quarterClasses = ["fourth", "half", "three", "max"];
  const handleQuarters = (multiplier: number) => {
    setInput(
      new BigNumber(isBuying ? maxPurchaseable : selectedSynthBalance)
        .times(multiplier)
        .toString()
    );
  };

  const handleTransaction = async (
    sourceKey: string,
    amount: string,
    addr: string,
    destKey: string
  ) => {
    if (amountInvalid) return;
    setProcessingTransaction(true);
    try {
      await handleExchange(sourceKey, amount, addr, destKey);
    } catch (e) {
      console.log(e);
      setTransactionFailed(true);
    } finally {
      setProcessingTransaction(false);
      refreshBalances();
    }
  };

  const modalOff = !transactionFailed && !processingTransaction;

  const amountInvalid =
    new BigNumber(input).comparedTo(
      new BigNumber(isBuying ? samETHBalance : selectedSynthBalance)
    ) > 0;

  return (
    <div className="order">
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
            <div key="buysell" className="tabs buysell">
              <div
                className={"tab buy" + (isBuying ? " selected" : "")}
                onClick={() => {
                  setInput("");
                  setIsBuying(true);
                }}
              >
                <span>Buy</span>
              </div>
              <div
                className={"tab sell" + (!isBuying ? " selected" : "")}
                onClick={() => {
                  setInput("");
                  setIsBuying(false);
                }}
              >
                <span>Sell</span>
              </div>
            </div>,
            <div key="balance-input" className="order-panel-card balance-input">
              <span className="order-action pay-seth">
                {isBuying ? "Pay sETH" : "Sell " + selectedSynth.name}
              </span>
              <span className="available">
                Available:{" "}
                {isBuying
                  ? Number(samETHBalance).toFixed(5)
                  : Number(selectedSynthBalance).toFixed(5)}
                ...
              </span>
              <input
                className={"amount-input" + (amountInvalid ? " invalid" : "")}
                type="number"
                min={0}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <span>~{input.length > 0 ? USDvalue : ""} USD</span>
              <div className="quarters">
                {quarters.map((q, i) => (
                  <div
                    key={quarterClasses[i]}
                    className={"quarter " + quarterClasses[i]}
                    onClick={() => handleQuarters(q)}
                  >
                    {q !== 1 ? q * 100 + "%" : "Max"}
                  </div>
                ))}
              </div>
            </div>,
            <div
              key="amount-received"
              className="order-panel-card amount-received"
            >
              <div className="amount-text">
                <span className="amount-label">
                  {isBuying ? "Buy " + selectedSynth.name : "For sETH"}
                </span>
                <span className="maxPurchaseable">
                  You can {isBuying ? "buy" : "sell"} up to{" "}
                  {isBuying
                    ? Number(maxPurchaseable).toFixed(2)
                    : Number(selectedSynthBalance).toFixed(2)}
                </span>
                <div className={"amount" + (amountInvalid ? " invalid" : "")}>
                  {Number(amount).toFixed(5) + "..."}
                </div>
              </div>
              <div className="estimate-received">
                <div className="est-received">Est. received (i)</div>
                <div className="estimateReceived">?</div>
              </div>
            </div>,
            <button
              key="order-action-button"
              className="order-action-button"
              disabled={!account && amountInvalid}
              onClick={() => {
                if (account) {
                  isBuying
                    ? handleTransaction(
                        "sETH",
                        input,
                        account,
                        selectedSynth.currencyKey
                      )
                    : handleTransaction(
                        selectedSynth.currencyKey,
                        input,
                        account,
                        "sETH"
                      );
                }
              }}
            >
              {isBuying ? "Buy" : "Sell"}
            </button>,
          ]
        : null}
    </div>
  );
}
export default OrderPanel;
