import { useState, useEffect } from "react";
import { isoTimeToRippleTime } from "xrpl";

export default function SellOfferFormContainer({ client, wallet }) {
  const [nftId, setNftId] = useState("");
  const [sellAmount, setSellAmount] = useState("");

  const [offerIndex, setOfferIndex] = useState("");
  const [cancelOfferIndex, setCancelOfferIndex] = useState("");

  const createSellOffer = async () => {
    // set expirtation to 1 day
    let d = new Date();
    d.setDate(d.getDate() + 1);
    const expirationDate = isoTimeToRippleTime(d);

    const transaction = {
      TransactionType: "NFTokenCreateOffer",
      Account: wallet.address,
      NFTokenID: nftId,
      Amount: sellAmount,
      Flags: 1, // 1 means sell
      Expiration: expirationDate,
      // Destination: sellDestinationAccount,
    };

    try {
      const tx = await client.submitAndWait(transaction, {
        wallet: wallet,
      });

      console.log(tx);

      setNftId("");
      setSellAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const acceptSellOffer = async () => {
    const transaction = {
      TransactionType: "NFTokenAcceptOffer",
      Account: wallet.address,
      NFTokenSellOffer: offerIndex,
    };

    try {
      const tx = await client.submitAndWait(transaction, {
        wallet: wallet,
      });
      console.log(tx);
      setOfferIndex("");
    } catch (error) {
      console.log(error);
    }
  };

  const cancelSellOffer = async () => {
    const transaction = {
      TransactionType: "NFTokenCancelOffer",
      Account: wallet.address,
      NFTokenOffers: [cancelOfferIndex],
    };

    try {
      const tx = await client.submitAndWait(transaction, {
        wallet: wallet,
      });
      console.log(tx);
      setCancelOfferIndex("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col pb-5">
      <form action="" className="flex flex-col gap-2 px-5 py-2">
        <label>Create Sell Offer</label>
        <input
          type="text"
          placeholder="NFT Id"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
        />
        <input
          type="text"
          placeholder="XRP Amount"
          value={sellAmount}
          onChange={(e) => setSellAmount(e.target.value)}
        />

        <button
          className="bg-blue-400"
          onClick={(e) => {
            e.preventDefault();
            createSellOffer();
          }}
        >
          Create Sell Offer
        </button>
      </form>

      <form action="" className="flex flex-col gap-2 px-5 py-2">
        <label>Accept Sell Offer</label>
        <input
          type="text"
          placeholder="Offer Index"
          value={offerIndex}
          onChange={(e) => setOfferIndex(e.target.value)}
        />
        <button
          className="bg-green-500"
          onClick={(e) => {
            e.preventDefault();
            acceptSellOffer();
          }}
        >
          Accept Sell Offer
        </button>
      </form>

      <form action="" className="flex flex-col gap-2 px-5 py-2">
        <label>Cancel Sell Offer</label>
        <input
          type="text"
          placeholder="Offer Index"
          value={cancelOfferIndex}
          onChange={(e) => setCancelOfferIndex(e.target.value)}
        />
        <button
          className="bg-red-500"
          onClick={(e) => {
            e.preventDefault();
            cancelSellOffer();
          }}
        >
          Cancel Sell Offer
        </button>
      </form>
    </div>
  );
}
