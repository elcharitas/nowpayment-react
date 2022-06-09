import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import NowPaymentsApi from "@nowpaymentsio/nowpayments-api-js";

const npApi = new NowPaymentsApi({
  apiKey: process.env.NEXT_PUBLIC_NOW_API_KEY,
}); // your api key

export default function Home() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("BTC");
  const [invoice, setInvoice] = useState();

  useEffect(() => {
    const getCurrencies = async () =>
      ({ currencies } = await npApi.getCurrencies());
    getCurrencies().then(setCurrencies);
  }, []);

  useEffect(() => {
    const createInvoice = async () =>
      await npApi.createInvoice({
        price_currency: currency,
        price_amount: amount,
      });
    createInvoice().then(setInvoice);
  }, [amount]);

  return (
    <>
      <Head>
        <title>Nowpayment React by elcharitas</title>
      </Head>
      <div className="card">
        <h2>Amount to pay</h2>
        {!invoice || amount < 10 ? (
          <input
            className="input"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value > 10 ? e.target.value : 0)
            }
          />
        ) : (
          invoice.price_amount
        )}
        <h2>Currency to pay</h2>
        {!invoice || amount < 10 ? (
          <select onSelect={(e) => setCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option>{currency}</option>
            ))}
          </select>
        ) : (
          invoice.price_currency
        )}
        <p>
          {invoice && (
            <a href={invoice.invoice_url}>Pay Now at {invoice.invoice_url}</a>
          )}
        </p>
      </div>
    </>
  );
}
