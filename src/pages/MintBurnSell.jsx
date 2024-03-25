import GenericContainer from "../components/GenericContainer";
import WalletInfoContainer from "../components/WalletInfoContainer";
import NFTsContainer from "../components/NFTsContainer";

import { Client, Wallet, convertStringToHex, isoTimeToRippleTime } from "xrpl";
import { useState, useEffect } from "react";
import { DESTINATION_WALLET_SEED, WALLET_SEED } from "../utils/definitions";
import SellOfferFormContainer from "../components/SellOfferFormContainer";
import MintingBurningFormContainer from "../components/MintingBurningFormContainer";

export default function MintAndBurn() {
  const [connected, setConnected] = useState(false);
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));
  const myWallet = Wallet.fromSeed(WALLET_SEED);
  const destinationWallet = Wallet.fromSeed(DESTINATION_WALLET_SEED);
  const [destinationNfts, setDestinationNfts] = useState([]);
  const [nfts, setNfts] = useState([]);

  // control connect/fetching flow
  const main = async () => {
    await connect();
    await getNfts(myWallet.address, setNfts);
    await getNfts(destinationWallet.address, setDestinationNfts);
  };

  const connect = async () => {
    try {
      await client.connect();
      setConnected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const getNfts = async (address, set) => {
    const nfts = await client.request({
      method: "account_nfts",
      account: address,
    });
    set(nfts.result.account_nfts);
  };

  const getSellOffers = async (id) => {
    try {
      const offers = await client.request({
        method: "nft_sell_offers",
        nft_id: id,
      });
      return offers.result.offers;
    } catch (err) {
      console.log("No sell offers");
    }
  };

  const getBuyOffers = async () => {};

  useEffect(() => {
    main();
  }, []);

  return (
    <GenericContainer>
      {!connected ? (
        <h2 className="text-red-500">not connected</h2>
      ) : (
        <>
          <h2 className="text-green-400 pb-10">connected</h2>

          <div className="grid grid-cols-2 gap-8 pb-5">
            {/* my wallet */}
            <div className="px-5">
              <WalletInfoContainer
                label={"My Wallet"}
                client={client}
                wallet={Wallet.fromSeed(WALLET_SEED)}
              />

              <NFTsContainer
                label={"My NFTs"}
                client={client}
                walletAddress={myWallet.address}
                getSellOffers={getSellOffers}
                nfts={nfts}
              />

              <MintingBurningFormContainer
                client={client}
                wallet={myWallet}
                getNfts={getNfts}
                setNfts={setNfts}
              />

              <SellOfferFormContainer
                client={client}
                wallet={myWallet}
                destinationWallet={destinationWallet}
              />
            </div>

            {/* destination wallet */}
            <div className="px-5">
              <WalletInfoContainer
                label={"Destination Wallet"}
                client={client}
                wallet={Wallet.fromSeed(DESTINATION_WALLET_SEED)}
              />

              <NFTsContainer
                label={"Destination NFTs"}
                client={client}
                walletAddress={destinationWallet.address}
                getSellOffers={getSellOffers}
                nfts={destinationNfts}
              />

              <MintingBurningFormContainer
                client={client}
                wallet={destinationWallet}
                getNfts={getNfts}
                setNfts={setDestinationNfts}
              />

              <SellOfferFormContainer
                client={client}
                myWallet={destinationWallet}
                destinationWallet={destinationWallet}
              />
            </div>
          </div>
        </>
      )}
    </GenericContainer>
  );
}
