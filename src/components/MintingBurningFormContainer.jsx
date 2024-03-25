import { useState, useEffect } from "react";
import { convertStringToHex } from "xrpl";
export default function MintingBurningFormContainer({
  client,
  wallet,
  getNfts,
  setNfts,
}) {
  const [uri, setUri] = useState("");
  const [flag, setFlag] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [account, setAccount] = useState("");
  const [tokenId, setTokenId] = useState("");

  const mintNft = async (e) => {
    e.preventDefault();
    const transaction = {
      TransactionType: "NFTokenMint",
      Account: wallet.address,
      URI: convertStringToHex(uri),
      Flags: parseInt(flag),
      TransferFee: parseInt(transferFee),
      NFTokenTaxon: 0,
    };

    try {
      const tx = await client.submitAndWait(transaction, { wallet: wallet });
      console.log(tx);
      setFlag("");
      setTransferFee("");
      setUri("");
    } catch (e) {
      console.log(e);
    }
    // update state to show after minting
    await getNfts(wallet.address, setNfts);
  };

  const burnNft = async (e) => {
    e.preventDefault();
    const transaction = {
      TransactionType: "NFTokenBurn",
      Account: account,
      NFTokenID: tokenId,
    };

    try {
      const tx = await client.submitAndWait(transaction, { wallet: wallet });
      setAccount("");
      setTokenId("");
      console.log(tx);
    } catch (e) {
      console.log(e);
    }

    // update state to show after burning
    await getNfts(wallet.address, setNfts);
  };

  return (
    <div className="p-5">
      <div className="">
        <h2>Mint NFT</h2>
        <form className="flex flex-col gap-2">
          <input
            value={uri}
            type="text"
            placeholder="uri"
            onChange={(e) => {
              setUri(e.target.value);
            }}
          />
          <input
            value={flag}
            type="text"
            placeholder="flag"
            onChange={(e) => {
              setFlag(e.target.value);
            }}
          />
          <input
            value={transferFee}
            type="text"
            placeholder="transfer fee"
            onChange={(e) => {
              setTransferFee(e.target.value);
            }}
          />
          <button
            onClick={(e) => {
              mintNft(e);
            }}
          >
            Mint
          </button>
        </form>
      </div>

      <div className="">
        <h2>Burn NFT</h2>
        <form className="flex flex-col gap-2">
          <input
            value={account}
            type="text"
            placeholder="account"
            onChange={(e) => {
              setAccount(e.target.value);
            }}
          />
          <input
            value={tokenId}
            type="text"
            placeholder="nft token id"
            onChange={(e) => {
              setTokenId(e.target.value);
            }}
          />

          <button onClick={burnNft}>Burn</button>
        </form>
      </div>
    </div>
  );
}
