import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@/components/Button";
import { cutAddress, cutString } from "@/functions/helpers";
import {
  nftPreview,
  nftName,
  hashTrx,
  CheckSVG,
  CopySVG,
  ArrowRightSVG,
} from "../mocks";
import { blockchainOptions } from "@/components/Select/blockchainOptions";
import { NftDetails } from "@/configs/interfaces";

interface Blockchain {
  logo: string;
  label: string;
  link: string;
}

interface SuccessProps {
  senderBlockchain?: Blockchain | null;
  receiverBlockchain?: Blockchain | null;
  transactionHash: string | null;
  nftDetail: NftDetails | undefined;
}

interface BlockchainInfoProps {
  blockchain?: Blockchain | null;
}

const Success: React.FC<SuccessProps> = ({
  senderBlockchain,
  receiverBlockchain,
  transactionHash,
  nftDetail,
}) => {
  const handleCopy = () => console.log("Address copied to clipboard");

  const blockchainLink = blockchainOptions.find(
    (option) => option.label === receiverBlockchain?.label
  )?.link;
  const transactionUrl = blockchainLink
    ? `${blockchainLink}${transactionHash}`
    : "#";

  return transactionHash ? (
    <div className="shadow-lg w-full p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#272727] rounded lg:rounded-md mt-5">
      <div className="leading-6">
        <CompletionStatus />
        <TransactionDetails
          transactionUrl={transactionUrl}
          hashTrx={transactionHash}
        />
        <div className="mt-10 flex justify-between flex-col sm:flex-row">
          <NFTDetails />
          <div className="border border-[#DDDDDD] dark:border-[#606060] mx-2 hidden sm:block"></div>
          <BlockchainTransfer
            senderBlockchain={senderBlockchain}
            receiverBlockchain={receiverBlockchain}
          />
        </div>
        <Actions />
      </div>
    </div>
  ) : (
    <></>
  );
};

const CompletionStatus = () => (
  <>
    <div className="mb-4 body-2 text-[#363636] dark:text-white text-2xl flex items-center justify-center">
      <CheckSVG />
      Completed
    </div>
    <div className="mb-2 body-2 text-[#363636] dark:text-white text-sm text-center">
      Congratulations! You have succesfully transfered your NFT through AImagine
      NFT Bridge
    </div>
  </>
);

interface TransactionDetailsProps {
  transactionUrl: string;
  hashTrx: string;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionUrl,
  hashTrx,
}) => (
  <div className="mt-5 bg-[#F7F7F7] dark:bg-[#363636] p-4">
    <div className="mb-2 body-2 text-[#363636] dark:text-white text-sm">
      Transaction Hash
    </div>
    <div className="body-2 text-[#363636] dark:text-white text-md flex space-x-2">
      <a
        href={transactionUrl}
        className="underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {cutAddress(hashTrx, 8, 10)}
      </a>
      <CopyToClipboard
        text={hashTrx}
        onCopy={() => console.log("Address copied to clipboard")}
      >
        <button>
          <CopySVG />
        </button>
      </CopyToClipboard>
    </div>
  </div>
);

const NFTDetails = () => (
  <div className="flex space-x-2 items-center mb-4 sm:mb-0">
    <img
      className="rounded-xl w-[65px] h-[65px]"
      src={nftPreview}
      alt="NFT"
      width="65"
      height="65"
    />
    <div className="flex flex-col">
      <div className="text-sm">Name</div>
      <div className="text-md">{cutString(nftName, 30)}</div>
    </div>
  </div>
);

interface BlockchainTransferProps {
  senderBlockchain?: Blockchain | null;
  receiverBlockchain?: Blockchain | null;
}

const BlockchainTransfer: React.FC<BlockchainTransferProps> = ({
  senderBlockchain,
  receiverBlockchain,
}) => (
  <div className="flex flex-col sm:flex-row">
    <BlockchainInfo title="Sender Blockchain" blockchain={senderBlockchain} />
    <ArrowRightSVG />
    <BlockchainInfo
      title="Receiver Blockchain"
      blockchain={receiverBlockchain}
    />
  </div>
);

const BlockchainInfo: React.FC<BlockchainInfoProps & { title: string }> = ({
  title,
  blockchain,
}) => (
  <div className="flex-col flex flex-1 text-sm mb-4 sm:mb-0">
    {title}
    <div className="flex items-center">
      <img
        className="rounded-full w-7 mr-2"
        src={blockchain?.logo ?? ""}
        alt={blockchain?.label ?? ""}
      />
      <div className="opacity-50">{blockchain?.label ?? "..."}</div>
    </div>
  </div>
);

const Actions = () => (
  <div className="mt-5 sm:mt-10 flex flex-col items-left sm:flex-row sm:items-start justify-center space-y-4 sm:space-x-4 sm:space-y-0">
    <Button
      onClick={() => console.log("View on explorer")}
      className="ml-0 md:ml-0 w-full md:w-auto"
      secondaryBtn
    >
      View on explorer
    </Button>
    <Button
      onClick={() => console.log("View all history")}
      className="ml-0 md:ml-0 w-full md:w-auto"
    >
      View all history
    </Button>
  </div>
);

export default Success;
