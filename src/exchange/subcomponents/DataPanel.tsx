import React, { useEffect, useState } from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
} from "victory";
import { SearchIconSVG } from "../svgs/search";
import { EthereumSVG } from "../svgs/eth";
import { Index } from "../../types/Index";
import { ethers } from "ethers";
import Price from "../../shared/Price";

enum ChartTab {
  Chart = 0,
  Details = 1,
}

function escapeRegExp(s: string) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function filterList(q: string, list: any[]) {
  const words = q
    .split(/\s+/g)
    .map((s) => s.trim())
    .filter((s) => !!s);
  const hasTrailingSpace = q.endsWith(" ");
  const searchRegex = new RegExp(
    words
      .map((word, i) => {
        if (i + 1 === words.length && !hasTrailingSpace) {
          return `(?=.*\\b${escapeRegExp(word)})`;
        } else {
          return `(?=.*\\b${escapeRegExp(word)}\\b)`;
        }
      })
      .join("") + ".+",
    "gi"
  );
  return list.filter((item) => {
    return searchRegex.test(item.name);
  });
}

type PricePoint = {
  timestamp: string;
  twap: string;
};

type Props = {
  selectedSynthIndex: number;
  setSelectedSynthIndex: React.Dispatch<React.SetStateAction<number>>;
  indices: Index[];
  selectedSynthKey: string;
  historicalPrices: any[];
  oneDayVolumes: any[];
  oneDayChanges: any[];
};

function DataPanel(props: Props) {
  const {
    selectedSynthIndex,
    setSelectedSynthIndex,
    indices,
    selectedSynthKey,
    historicalPrices,
    oneDayVolumes,
    oneDayChanges,
  } = props;

  const [activeTab, setActiveTab] = useState<ChartTab>(ChartTab.Chart);
  const [searchBarExpanded, setSearchBarExpanded] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");

  const [chartWidth, setChartWidth] = useState<number>(window.innerWidth * 0.6);
  const [hoverPrice, setHoverPrice] = useState<string>("");

  const handleResize = () => {
    setChartWidth(window.innerWidth * 0.6);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  return (
    <div className="data">
      <div className="selection-bar">
        <div className={"selections" + (searchBarExpanded ? " searching" : "")}>
          <div
            className={
              "search-selections" + (searchBarExpanded ? " expanded" : "")
            }
          >
            <div
              className={"search-icon-wrapper"}
              onClick={() => {
                setSearchBarExpanded(!searchBarExpanded);
                setSearchInput("");
              }}
            >
              <SearchIconSVG />
            </div>
            {searchBarExpanded ? (
              <input
                className="search-input"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
            ) : null}
          </div>
          {indices.map((n, i) => (
            <div
              key={n.name}
              className={
                "selection" + (selectedSynthIndex === i ? " selected" : "")
              }
            >
              <div
                className="icon"
                style={{ backgroundImage: "url(" + n.icon + ")" }}
                onClick={() => setSelectedSynthIndex(i)}
              />
            </div>
          ))}
        </div>
        <span className="see-all">See all</span>
      </div>
      {searchBarExpanded && searchInput.length > 0 ? (
        <div className="dropdown">
          {filterList(searchInput, indices).map((n, i) => {
            const trueIndex = indices.indexOf(n);
            return (
              <div className="dropdown-option" key={trueIndex}>
                <div className="dropdown-option-inner">
                  <span className="indices-index">{i}</span>
                  <div
                    className="icon"
                    style={{ backgroundImage: "url(" + n.icon + ")" }}
                  />
                  <span className="index-name">{n.name}</span>
                  <Price
                    currencyKey={n.currencyKey}
                    classString="index-price"
                  />
                  <span className="volume">
                    {Number(oneDayVolumes[trueIndex]).toFixed(2)}
                  </span>
                  <span
                    className={
                      "percent-change " +
                      (Number(oneDayChanges[trueIndex]) > 0 ? "pos" : "neg")
                    }
                  >
                    {(Number(oneDayChanges[trueIndex]) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="chart">
        <div className="index">
          <div className="title">
            <div
              className="icon"
              style={{
                backgroundImage:
                  "url(" + indices[selectedSynthIndex].icon + ")",
              }}
            ></div>
            <div className="index-title">
              <span className="index-name">
                {indices[selectedSynthIndex].name}
              </span>
              <br />
              <span className="index">Index</span>
            </div>
          </div>
          <div className="prices">
            <div className="price eth-price">
              <Price currencyKey={selectedSynthKey} classString="figure bold" />
              <br />
              Index Price
            </div>
            <div className="price 24-vol">
              <span className="figure">
                {Number(oneDayVolumes[selectedSynthIndex]).toFixed(2)}
              </span>
              <br />
              24H Vol
            </div>
            <div className="price 24-change">
              <span
                className={
                  "figure " +
                  (Number(oneDayChanges[selectedSynthIndex]) > 0
                    ? "pos"
                    : "neg")
                }
              >
                {(Number(oneDayChanges[selectedSynthIndex]) * 100).toFixed(2)}%
              </span>
              <br />
              24 Change
            </div>
          </div>
        </div>
        <div className="chart-tabs">
          <div
            className={
              "tab chart" + (activeTab === ChartTab.Chart ? " selected" : "")
            }
            onClick={() => setActiveTab(ChartTab.Chart)}
          >
            Chart
          </div>
          <div
            className={
              "tab details" +
              (activeTab === ChartTab.Details ? " selected" : "")
            }
            onClick={() => setActiveTab(ChartTab.Details)}
          >
            NFT Details
          </div>
        </div>
        <div className="chart-content" onMouseLeave={() => setHoverPrice("")}>
          {activeTab === ChartTab.Chart ? (
            [
              <span className="hoverPrice" key="hoverPrice">
                {hoverPrice.length > 0 ? <EthereumSVG /> : null}
                {hoverPrice}
              </span>,
              <VictoryChart
                key="chart"
                width={chartWidth}
                height={375}
                containerComponent={
                  <VictoryVoronoiContainer
                    labels={({ datum }) => {
                      return "Ξ" + datum.y.toFixed(2);
                    }}
                    onActivated={(points) =>
                      setHoverPrice(points[0].y.toFixed(5))
                    }
                    activateLabels={false}
                  />
                }
              >
                <VictoryAxis
                  scale="time"
                  tickCount={3}
                  style={{
                    tickLabels: {
                      fontSize: 10,
                    },
                  }}
                  tickFormat={(t) =>
                    new Date(t).toLocaleDateString() +
                    ", " +
                    new Date(t).toLocaleTimeString()
                  }
                />
                <VictoryAxis scale="linear" dependentAxis tickCount={10} />
                <VictoryLine
                  data={historicalPrices[selectedSynthIndex].map(
                    (p: PricePoint) => ({
                      x: p.timestamp,
                      y: Number(ethers.utils.formatEther(p.twap.toString())),
                    })
                  )}
                />
              </VictoryChart>,
            ]
          ) : (
            <div className="details">
              {indices[selectedSynthIndex].description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DataPanel;
