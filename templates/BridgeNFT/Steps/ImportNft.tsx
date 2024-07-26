import React, { useEffect, useState } from "react";
import SenderBlockchain from "@/components/Select/SenderBlockchain";
import ReceiverBlockchain from "@/components/Select/ReceiverBlockchain";
import { InputField } from "@/components/InputField";
import Button from "@/components/Button";
import { cutAddress } from "@/functions/helpers";
import { nftPreview, nftName } from "../mocks";
import { NftDetails } from "@/configs/interfaces";
import { Address, erc721ABI, usePublicClient } from "wagmi";
import axios from "axios";
import Web3 from "web3";

interface BlockchainInfo {
  logo: string;
  label: string;
}

interface ImportNftProps {
  showNextPhase: boolean;
  stepCompleted: boolean;
  senderBlockchain: BlockchainInfo | null;
  receiverBlockchain: BlockchainInfo | null;
  contractAddress: string;
  tokenID: string;
  handleSenderChange: (value: any) => void;
  handleReceiverChange: (value: any) => void;
  handleContractAddressChange: (value: string) => void;
  handleTokenIDChange: (value: string) => void;
  handleConfirmImport: () => void;
  nftDetails?: NftDetails;
  close?: () => void;
}

const ImportNft: React.FC<ImportNftProps> = ({
  showNextPhase,
  close,
  stepCompleted,
  senderBlockchain,
  receiverBlockchain,
  contractAddress,
  tokenID,
  handleSenderChange,
  handleReceiverChange,
  handleContractAddressChange,
  handleTokenIDChange,
  handleConfirmImport,
  nftDetails,
}) => {
  const [image, setImage] = useState("");
  const publicClient = usePublicClient();

  const getTokenUri = async (nftAddress: Address, tokenId: bigint) => {
    console.log(nftAddress)
    console.log(tokenId)
    try{
      const res = await publicClient.readContract({
        address: nftAddress,
        abi: erc721ABI,
        functionName: "tokenURI",
        args: [tokenId],
      });
      console.log(res)
      return res;
    }catch(e){
      console.log(e)
    }
    
  };

  useEffect(() => {
    if (!contractAddress || !tokenID) return;
    if(!Web3.utils.isAddress(contractAddress)) return 
    getTokenUri(contractAddress as Address, BigInt(tokenID)).then((res) => {
      if(!res) return 
      let link = res;
      if (res.startsWith("ipfs://")) {
        link = `https://ipfs.io/ipfs/${res.slice(7)}`;
      }
      axios.get(link).then((res) => {
        let image = res.data.image;
        // console.log(image)
        if (image) {
          image = image.startsWith("ipfs://")
            ? `https://ipfs.io/ipfs/${image.slice(7)}`
            : image;
          setImage(image);
        }
        // console.log(res)
      }).catch((e) => {
        
      });
      // console.log(res)
    });
  }, [tokenID]);

  return (
    <div className="shadow-lg w-full p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#272727] rounded lg:rounded-md mt-5">
      <div className="leading-6">
        <div className="mb-5">
          <div className="mb-2 body-2 text-[#363636] dark:text-white text-2xl font-bold">
            <span className="bg-[#FECE00] mr-3 px-4 py-2 rounded-md text-[#363636] dark:text-white font-bold w-full text-lg">
              1
            </span>
            Import an NFT
          </div>
          {!showNextPhase ? (
            <div className="mt-5">
              <div className="mb-2 body-2 text-[#363636] dark:text-white text-lg">
                Import an NFT from your wallet.
              </div>
              <div className="my-4">
                Sender Blockchain
                <SenderBlockchain
                  onChange={handleSenderChange}
                  value={senderBlockchain}
                />
              </div>
              <div className="my-4">
                Receiver Blockchain
                <ReceiverBlockchain
                  onChange={handleReceiverChange}
                  value={receiverBlockchain}
                />
              </div>
              <div className="flex space-x-4">
                <InputField
                  id="contractAddress"
                  label="Contract Address"
                  placeholder="Enter Contract Address"
                  onChange={handleContractAddressChange}
                />
                <InputField
                  id="tokenID"
                  label="Token ID"
                  placeholder="Enter Token ID"
                  onChange={handleTokenIDChange}
                />
              </div>
              <div className="mt-10 flex flex-col items-left md:flex-row sm:items-start justify-center">
                <Button
                  onClick={handleConfirmImport}
                  className={`ml-0 md:ml-0 w-full md:w-auto ${
                    !stepCompleted ? "opacity-30" : ""
                  }`}
                  disabled={!stepCompleted}
                >
                  Confirm Import
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 relative">
              <div className="flex space-x-4 items-center mb-5">
                <button
                  className="text-3xl absolute -top-16 right-2"
                  onClick={close}
                >
                  &times;
                </button>

                <img
                  className="rounded-xl"
                  src={image}
                  alt="NFT"
                  width="80"
                  height="80"
                />
                <div className="text-xl">{nftDetails?.name}</div>
              </div>
              <div className="text-[#363636] dark:text-white flex mb-5">
                <BlockchainDetails
                  title="Sender Blockchain"
                  blockchain={senderBlockchain}
                />
                <BlockchainDetails
                  title="Receiver Blockchain"
                  blockchain={receiverBlockchain}
                />
              </div>
              <div className="text-[#363636] dark:text-white flex">
                <AddressDetails
                  title="Contract Address"
                  address={cutAddress(contractAddress, 9, 5)}
                />
                <AddressDetails
                  title="Token ID"
                  address={cutAddress(tokenID, 10, 6)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BlockchainDetails = ({
  title,
  blockchain,
}: {
  title: string;
  blockchain: BlockchainInfo | null;
}) => (
  <div className="flex-col flex w-[200px]">
    <div>{title}</div>
    <div className="flex items-center">
      <img
        className="rounded-full w-7 mr-2"
        src={blockchain?.logo || ""}
        alt={blockchain?.label || "logo"}
      />
      <div className="opacity-50">{blockchain?.label || "Blockchain name"}</div>
    </div>
  </div>
);

const AddressDetails = ({
  title,
  address,
}: {
  title: string;
  address: string;
}) => (
  <div className="flex-col flex w-[200px]">
    <div>{title}</div>
    <div className="opacity-50">{address}</div>
  </div>
);

export default ImportNft;
