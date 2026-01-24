import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "/api/megawatt";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.post(API_URL);
      if (res.data.errorFlag === "F") {
        setData(res.data);
        setError("");
      } else {
        setError(res.data.error || "Backend error");
        setData(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from backend");
      setData(null);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="error-msg">{error}</div>;
  if (!data) return <div className="loading-msg">Loading...</div>;

  return (
    <div className="page">

      {/* ===== Header ===== */}
      <table className="header-table">
        <tbody>
          <tr>
            <th className="title-main">THE DURGAPUR PROJECTS LIMITED</th>
          </tr>
          <tr>
            <th className="title-sub">
              A Government of West Bengal Enterprise | CIN: U40102WB1961SGC025250
            </th>
          </tr>
          <tr>
            <th className="title-tagline">Generating Power for Generations</th>
          </tr>
        </tbody>
      </table>

      {/* ===== Source ===== */}
      <div className="source-box">
        <span className="source-label">
          Source: {data.source.charAt(0)}
        </span>
      </div>

      {/* ===== Section Title ===== */}
      <table className="section-title">
        <tbody>
          <tr>
            <th>
              <span className="live-dot"></span>
              LIVE GENERATION DATA
            </th>
          </tr>
        </tbody>
      </table>

      {/* ===== Date / Time / Frequency ===== */}
      <table className="data-table">
        <tbody>
          <tr>
            <th>Date</th>
            <td>{data.reading_date}</td>
            <th>Time</th>
            <td>{data.reading_time}</td>
            <th>Freq. (Hz)</th>
            <td>{data.frequency}</td>
          </tr>
        </tbody>
      </table>

      {/* ===== Main Generation ===== */}
      <table className="data-table">
        <tbody>
          <tr>
            <th>Unit</th>
            <th>Generation (MW)</th>
            <th>Block No</th>
            <td>{data.block_no}</td>
          </tr>

          <tr>
            <th>#7</th>
            <td>{data.seven}</td>
            <th>DC (MW)</th>
            <td>{data.dc_sch}</td>
          </tr>

          <tr>
            <th>#8</th>
            <td>{data.eight}</td>
            <th>SG (MW)</th>
            <td>{data.sg_sch}</td>
          </tr>

          <tr className="total-row">
            <th>Total</th>
            <td>{data.total}</td>
            <th>AG (MW)</th>
            <td>{data.act_sent_out}</td>
          </tr>
        </tbody>
      </table>

      <div className="note">
        * This page refreshes automatically
      </div>

      {/* ===== Info Marquee ===== */}
      <div className="above-footer">
        <marquee scrollamount="15">
          EVER HIGHEST YEARLY GENERATION (2024-25)(80.68% PLF) → 3887 MU |
          LOWEST APC → 10.31% |
          HIGHEST RAKES → 695 Nos.
        </marquee>
      </div>

      {/* ===== Footer ===== */}
      <div className="footer">
        <marquee scrollamount="10">
          Happiness in life is Ultimate Treasure, Do your job taking SAFETY Measure...
          <span className="bn"> সুরক্ষা নিশ্চিত হলে কাজে আসে গতি</span>
        </marquee>
      </div>

    </div>
  );
}
