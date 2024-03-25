import React, { useEffect, useState } from "react";
import TokensContainer from "./TokensContainer";

export default function NFTsContainer({ getSellOffers, nfts, label }) {
  return (
    <div>
      {nfts && nfts.length > 0 ? (
        <div>
          <label>{label}</label>
          <div className="px-10">
            {nfts.map((nft) => {
              return (
                <div key={nft.nft_serial}>
                  <TokensContainer nft={nft} getSellOffers={getSellOffers} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="px-5"> No NFTs</p>
      )}
    </div>
  );
}
