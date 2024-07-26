import React, { SetStateAction, useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/ProcessingModal";
import {
  Address,
  erc721ABI,
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { abi, getContractAddress } from "@/configs";
import { Dispatch } from "@reduxjs/toolkit";
import Web3 from "web3";
// import {useWalletClient} from "wagmi/"
interface ModalContent {
  title: string;
  content: string;
}

interface TransferProps {
  showNextPhase: boolean;
  stepCompleted: boolean;
  modalContent?: ModalContent | null;
  contractAddress: string;
  tokenID: string;
  setTransactionHash: (value: string) => void;
}

const waitingConfirmation: ModalContent = {
  title: "Waiting for confirmations",
  content:
    "Please confirm the interaction on your wallet to proceed to the next step.",
};

const ownerMismatch: ModalContent = {
  title: "Owner Mismatch",
  content: "You're not the owner of this NFT",
};

const errorApprovingMsg: ModalContent = {
  title: "Approve Error",
  content: "Error approving token",
};

const errorTransferringMsg: ModalContent = {
  title: "Transfer Error",
  content: "Error transferring token",
};

const processingTransaction: ModalContent = {
  title: "Processing",
  content: "Please confirm the transaction in your wallet.",
};

enum ButtonState {
  Initial = "Approve",
  Approved = "Approved",
  EnableTransfer = "Transfer",
  Transferring = "Transferring",
}

const Transfer: React.FC<TransferProps> = ({
  showNextPhase,
  stepCompleted,
  contractAddress,
  tokenID,
  setTransactionHash,
}) => {
  const [approveState, setApproveState] = useState<ButtonState>(
    ButtonState.Initial
  );
  const [transferState, setTransferState] = useState<ButtonState>(
    ButtonState.Approved
  ); // Start as 'Approved' to be disabled initially
  const [showModal, setShowModal] = useState(false);
  const [currentModalContent, setCurrentModalContent] =
    useState<ModalContent | null>(null);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const getNFTOwner = async (contractAddress: Address, tokenID: bigint) => {
    const owner = await publicClient.readContract({
      address: contractAddress,
      abi: erc721ABI,
      functionName: "ownerOf",
      args: [tokenID],
    });

    return owner;
  };

  const approveNFt = async (contractAddress: Address, tokenId: bigint) => {
    const bridgeAddress = getContractAddress(publicClient.chain.id);
    if (!bridgeAddress) {
      alert("Invalid network");
      return;
    }

    if (!walletClient) {
      alert("Not connected");
      return;
    }

    console.log(publicClient.chain.id);
    const res = await walletClient.writeContract({
      address: contractAddress,
      abi: erc721ABI,
      functionName: "approve",
      args: [bridgeAddress, tokenId],
      value: 0n,
      chain: publicClient.chain,
    });
    return res;
  };

  const transferNft = async (nftAddress: Address, tokenId: bigint) => {
    const bridgeAddress = getContractAddress(publicClient.chain.id);
    const chainId = publicClient.chain.id;

    if (!bridgeAddress) {
      alert("Invalid network");
      return;
    }

    if (!walletClient) {
      alert("Not connected");
      return;
    }
    console.log(nftAddress);
    //   return
    // console.log(chainId)
    const chainEncoded = "0x" + chainId.toString(16);
    console.log(chainEncoded);
    const res = await walletClient.writeContract({
      address: bridgeAddress,
      abi: abi,
      functionName: "swapRequestNative",
      args: [
        tokenId,
        nftAddress,
        "0x6abf0de5e34ce0725e7a10913860e4654ef69ce4eed881e71fb8c9394e378fcc",
        walletClient.account.address,
        "0x0000000000000000000000000000000000000000",
      ],
      chain: publicClient.chain,
      value: 10000n,
    });

    return res;
  };

  const handleApproveClick = async () => {
    const owner = await getNFTOwner(
      contractAddress as Address,
      BigInt(tokenID)
    );
    console.log(owner);
    console.log(walletClient?.account.address);
    if (owner != walletClient?.account.address) {
      setCurrentModalContent(ownerMismatch);
      setShowModal(true);
      return;
    }

    setCurrentModalContent(waitingConfirmation);
    setShowModal(true);

    try {
      const res = await approveNFt(contractAddress as Address, BigInt(tokenID));
    } catch (e) {
      console.log(e);
      setCurrentModalContent(errorApprovingMsg);
      setShowModal(false);
      return;
    }

    setApproveState(ButtonState.Approved);
    setTransferState(ButtonState.EnableTransfer);
    setShowModal(false);
  };

  const handleTransferClick = async () => {
    setTransferState(ButtonState.Transferring);
    setCurrentModalContent(processingTransaction);
    setShowModal(true);
    try {
      const res = await transferNft(
        contractAddress as Address,
        BigInt(tokenID)
      );
      if(res) {
        await publicClient.waitForTransactionReceipt({hash : res})
        setTransactionHash(res as string);
        setShowModal(false);
        setTransferState(ButtonState.EnableTransfer);
      }else{
        setTransferState(ButtonState.EnableTransfer);
        setCurrentModalContent(errorTransferringMsg);
        setShowModal(true);  
      }
      
    } catch (e) {
      console.log(e);
      setTransferState(ButtonState.EnableTransfer);
      setCurrentModalContent(errorTransferringMsg);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentModalContent(null);
  };

  return (
    <div className="shadow-lg w-full p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#272727] rounded lg:rounded-md mt-5">
      <div className="leading-6">
        <div className="mb-2 body-2 text-[#363636] dark:text-white text-2xl font-bold">
          <span className="bg-[#FECE00] mr-3 px-4 py-2 rounded-md text-[#363636] dark:text-white font-bold w-full text-lg">
            2
          </span>
          Transfer
        </div>
        {showNextPhase && (
          <div className="mt-10 flex flex-col items-left sm:flex-row sm:items-start justify-center space-y-4 sm:space-x-4 sm:space-y-0">
            <Button
              onClick={handleApproveClick}
              className={`ml-0 md:ml-0 w-full md:w-auto ${
                approveState !== ButtonState.Initial ? "opacity-50" : ""
              }`}
              disabled={approveState !== ButtonState.Initial || !stepCompleted}
            >
              {approveState}
            </Button>
            <Button
              onClick={handleTransferClick}
              className={`ml-0 md:ml-0 w-full md:w-auto ${
                transferState !== ButtonState.EnableTransfer ? "opacity-30" : ""
              }`}
              disabled={transferState !== ButtonState.EnableTransfer}
            >
              {transferState === ButtonState.Transferring
                ? "Transferring"
                : "Transfer"}
            </Button>
          </div>
        )}
        {showModal && currentModalContent && (
          <Modal
            title={currentModalContent.title}
            content={currentModalContent.content}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Transfer;
