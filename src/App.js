import "./App.css";
import { useEffect, useState } from "react";
import { displayNumber } from "./shared";

function App() {
  const [coinData, setCoinData] = useState([]);

  const filterCoinData = (data = []) => {
    const filteredData = [];

    data.forEach((rawRow) => {
      const filteredRow = [];
      const keys = Object.keys(rawRow);
      keys.forEach((key) => {
        if (["name", "symbol"].includes(key)) {
          filteredRow[key] = rawRow[key];
        } else if (key === "circulating_supply") {
          filteredRow[key] = displayNumber(rawRow[key]);
        } else if (key === "quote" && !!rawRow.quote.USD) {
          const data = rawRow.quote.USD;
          filteredRow["price"] = displayNumber(data.price);
          filteredRow["marketcap"] = displayNumber(data.marketcap);
          filteredRow["percent_change_24h"] = displayNumber(
            data.percent_change_24h
          );
        }
      });
      filteredData.push(filteredRow);
    });
    return filteredData;
  };

  useEffect(() => {
    const getApi = async () => {
      console.log("getting");
      const response = await fetch("http://localhost:4000/get");
      const responseObj = await response.json();
      console.log("setting");
      console.log(responseObj.data);
      setCoinData(responseObj.data);
    };
    getApi();
  }, []);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Market Cap</th>
            <th scope="col">Circulating Supply</th>
            <th scope="col">Change &</th>
          </tr>
        </thead>
        <tbody>
          {coinData?.length > 0 &&
            filterCoinData(coinData).map((row, i) => (
              <tr>
                <td>
                  <div className="row_header">
                    <div style={{ fontWeight: "bold" }}>{row.name}</div>
                    <div style={{ fontSize: 6 }}>{row.symbol}</div>
                  </div>
                </td>
                <td>{row.price}</td>
                <td>{row.marketcap}</td>
                <td>{row.circulating_supply}</td>
                <td>{row.percent_change_24h}</td>
              </tr>
            ))}
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
