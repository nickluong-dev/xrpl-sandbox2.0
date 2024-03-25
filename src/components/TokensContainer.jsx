import { useState, useEffect } from "react";

export default function TokensContainer({ nft, getSellOffers }) {
  const [offers, setOffers] = useState([]);

  const main = async () => {
    const data = await getSellOffers(nft.NFTokenID);
    setOffers(data);
  };

  useEffect(() => {
    main();
  }, []);

  return (
    <div>
      NFT Id: {nft.NFTokenID} Issuer: {nft.Issuer}
      {offers && offers.length > 0 ? (
        <ul className="list-disc pl-8">
          {offers.map((offer) => (
            <li className="list-disc" key={offer.nft_offer_index}>
              Offer Index: {offer.nft_offer_index} @ {offer.amount} XRP
            </li>
          ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
}
