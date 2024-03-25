import { Client, xrpToDrops, dropsToXrp, Wallet } from "xrpl";
import { useState, useEffect } from "react";
import { WALLET_SEED } from "../utils/definitions";
import GenericContainer from "../components/GenericContainer";
export default function CreateAndSend() {
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));
  const [connected, setConnected] = useState(false);
  const [myXrpBalance, setMyXrpBalance] = useState();
  const [destinationWallet, setDestinationWallet] = useState();
  const [destinationBalance, setDestinationBalance] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);

  const connect = async () => {
    try {
      await client.connect();
      setConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const myWallet = Wallet.fromSeed(WALLET_SEED);

  const getMyBalance = async () => {
    const myBalance = await client.getXrpBalance(myWallet.address);
    setMyXrpBalance(myBalance);
  };

  const generateWallet = async () => {
    const { wallet, balance } = await client.fundWallet();
    setDestinationBalance(balance);
    setDestinationWallet(wallet);
  };

  const sendXRP = async () => {
    const transaction = {
      TransactionType: "Payment",
      Account: myWallet.address,
      Destination: destinationAddress,
      Amount: sendAmount,
    };

    try {
      const response = await client.submitAndWait(transaction, {
        wallet: myWallet,
      });
      console.log(response);

      const newBalance = await client.getXrpBalance(destinationAddress);
      setDestinationBalance(newBalance);
      getMyBalance();
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
    }
  };

  useEffect(() => {
    //generate new destination wallet for test
    connect();
    getMyBalance();
  }, []);

  return (
    <>
      <GenericContainer>
        {!connected ? (
          <h2 className="text-red-500">not connected</h2>
        ) : (
          <>
            <h2 className="text-green-400 mb-5">connected</h2>

            <div>
              <div className="flex flex-col pb-10">
                {myXrpBalance ? (
                  <>
                    <h1 className="text-lg">My Wallet</h1>
                    <div>Address: {myWallet.address}</div>
                    <div>XRP Balance: {myXrpBalance}</div>
                  </>
                ) : (
                  <button onClick={getMyBalance}>Get My Wallet</button>
                )}
              </div>

              <div>
                {destinationWallet ? (
                  <>
                    <div className="pb-10">
                      <h1 className="text-lg">Destination Wallet</h1>
                      <div>Address: {destinationWallet.address}</div>
                      <div>XRP Balance: {destinationBalance}</div>
                    </div>
                    <div>
                      <h1 className="text-lg">Send XRP</h1>

                      <div>
                        <input
                          type="text"
                          placeholder="Destination Address"
                          onChange={(e) =>
                            setDestinationAddress(e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="XRP Amount"
                          className="ml-2"
                          onChange={(e) => setSendAmount(e.target.value)}
                        />
                      </div>
                      <button onClick={sendXRP}>Send</button>
                    </div>
                  </>
                ) : (
                  <button onClick={generateWallet}>
                    Generate Destination Wallet
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </GenericContainer>
    </>
  );
}
