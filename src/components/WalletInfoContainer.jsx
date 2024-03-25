import { useEffect, useState } from "react";

export default function WalletInfoContainer({ client, wallet, label }) {
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    const balance = await client.getXrpBalance(wallet.address);
    return balance;
  };
  const main = async () => {
    const balance = await getBalance();
    setBalance(balance);
  };
  useEffect(() => {
    main();
  });

  return (
    <>
      {balance ? (
        <>
          <div className="pt-5">
            <label>{label} </label>
            <div className="px-10">
              <div>{wallet.address}</div>
              <div>XRP Balance: {balance}</div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
