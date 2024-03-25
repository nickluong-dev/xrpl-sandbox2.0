import { useEffect, useState } from "react";
import { Client, xrpToDrops, dropsToXrp } from "xrpl";

export default function Test() {
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState();
  const [walletInfo, setWalletInfo] = useState();
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));

  const [paymentButtonText, setPaymentButtonText] = useState(
    "Waiting for wallet to be funded..."
  );
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    console.log("starting connection...");

    // attempt connection
    client.connect().then(() => {
      console.log("connection successful!");
      console.log("funding wallet...");

      // adjust wallet and balance
      client.fundWallet().then((fundResult) => {
        console.log(fundResult);
        setBalance(fundResult.balance);
        setWallet(fundResult.wallet);
        setPaymentButtonText("Send a 100 XRP Payment.");
      });
    });

    client.disconnect();
  }, []);

  const sendPayment = async () => {
    console.log("Creating a payment transaction...");
    setStatusText("Sending a payment of 100 XRP... ");

    const transaction = {
      TransactionType: "Payment",
      Account: wallet?.address,
      Amount: xrpToDrops("100"),
      Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    };

    console.log(wallet);

    // submit transaction
    console.log("Submitting transaction... give it a second...");
    const submittedTransaction = await client.submitAndWait(transaction, {
      autofill: true,
      wallet: wallet,
    });

    // check transaction
    console.log(
      "Transaction Result:",
      submittedTransaction?.result.meta?.TransactionResult
    );
    setStatusText("Transaction sent. Check console.log for more info.");

    // Look up the new account balances by sending a request to the ledger
    const accountInfo = await client.request({
      command: "account_info",
      account: wallet.address,
    });

    // update new balance
    const balance = accountInfo.result.account_data.Balance;
    console.log(`New account balance: ${balance}`);
    setBalance(dropsToXrp(balance));
  };

  const getWalletInfo = async () => {
    const response = await client.request({
      command: "account_info",
      account: wallet.address,
      ledger_index: "validated",
    });

    console.log(response);
    setWalletInfo(response);
  };

  return (
    <div className="h-full flex flex-col items-center">
      {client.isConnected() ? (
        <h2 className="text-green-400">connected</h2>
      ) : (
        <h2 className="text-red-500">not connected</h2>
      )}

      <h1 className="text-xl">
        {balance ? (
          <p>
            The new wallet currently has {balance} XRP <br />
            <br />
          </p>
        ) : (
          "Funding wallet..."
        )}
      </h1>

      <button onClick={sendPayment} className="m-5">
        {paymentButtonText}
      </button>
      <p>Watch the console to see the payment flow in action!</p>
      <p>
        <i>{statusText}</i>
      </p>

      <button onClick={getWalletInfo} className="m-5">
        Get Wallet Info
      </button>
      <div>
        {walletInfo ? (
          <>
            <h2> Wallet Info: </h2>
            <div>ID: {walletInfo.id}</div>
            <div>Ledger Hash: {walletInfo.result.ledger_hash}</div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
