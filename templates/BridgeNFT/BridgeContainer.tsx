import { useEffect, useState } from "react";
// import { useSwitchChain } from 'wagmi'
// import { useSwitchChain } from 'wagmi'

import ImportNft from "./Steps/ImportNft";
import Transfer from "./Steps/Transfer";
import Success from "./Steps/Success";
import ItemHistory from "./Steps/ItemHistory";
import {
  Address,
  erc721ABI,
  useAccount,
  useConnect,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import web3 from "web3";
import { NftDetails } from "@/configs/interfaces";
import { abi, getContractAddress } from "@/configs";
import { isTestNetwork } from "@/components/Select/blockchainOptions";

type ChainIds = {
  [key: string]: number;
};

const chainIds: ChainIds = {
  ethereum: 1,
  arbitrum: 42161,
  opbnb: 97,
  optimism: 10,
};

interface BlockchainInfo {
  logo: string;
  label: string;
  link: string;
  value: string;
}

export const BridgeContainer = () => {
  const [senderBlockchain, setSenderBlockchain] =
    useState<BlockchainInfo | null>(null);
  const [receiverBlockchain, setReceiverBlockchain] =
    useState<BlockchainInfo | null>(null);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [tokenID, setTokenID] = useState<string>("");
  const [stepCompleted, setStepCompleted] = useState<boolean>(false);
  const [showNextPhase, setShowNextPhase] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const {data : walletClient } = useWalletClient()

  // const {switchNetworkAsync} = ()
  // const { chains, switchChain } = useSwitchChain()

  const [nftDetail, setNftDetail] = useState<NftDetails | undefined>();
  const publicClient = usePublicClient();

  const getNftDetails = async (nftAddress: Address) => {
    console.log(publicClient.chain.id);
    console.log(nftAddress);
    const res = await publicClient.multicall({
      contracts: [
        {
          address: nftAddress,
          abi: erc721ABI,
          functionName: "name",
        },

        {
          address: nftAddress,
          abi: erc721ABI,
          functionName: "symbol",
        },

        {
          address: nftAddress,
          abi: erc721ABI,
          functionName: "totalSupply",
        },
      ],
      allowFailure: true,
    });

    const hasNonSuccessStatus = res.some((ob) => ob.status !== "success");

    if (hasNonSuccessStatus) return null;

    const details: NftDetails = {
      name: res[0].result!,
      symbol: res[1].result!,
      totalSupply: res[2].result!,
    };

    return details;
  };

  const handleSenderChange = (selectedOption: BlockchainInfo | null) => {
    if (
      selectedOption?.label == receiverBlockchain?.label
    ) {
      alert("Sender Blockchain and Receiver Blockchain cannot be the same");
      // return;
    }
    
    const isTestnetSender = isTestNetwork(selectedOption ? selectedOption.value : "")
    const isTestnetReceiver = isTestNetwork(receiverBlockchain ? receiverBlockchain.value : "")
    
    if(isTestnetSender && !isTestnetReceiver || isTestnetReceiver && !isTestnetSender){
      if(receiverBlockchain){
        alert("Can't swap from mainnet to testnet")
      }
      
      // return 
    }
    if(selectedOption){
      const chainId = chainIds[selectedOption.value]
      // if(chainId) switchChain(chainId)
      
    }
    // switchNetworkAsync(selectedOption?.label)
    setSenderBlockchain(selectedOption);
    checkAllFieldsFilled();
  };

  const handleReceiverChange = (selectedOption: BlockchainInfo | null) => {
    if (selectedOption?.label == senderBlockchain?.label) {
      alert("Sender Blockchain and Receiver Blockchain cannot be the same");
      // return;
    }
    const isTestnetSender = isTestNetwork(senderBlockchain ? senderBlockchain.value : "")
    const isTestnetReceiver = isTestNetwork(selectedOption ? selectedOption.value : "")
    

    if(isTestnetSender && !isTestnetReceiver || isTestnetReceiver && !isTestnetSender){
      
      if(senderBlockchain){
        alert("Can't swap from mainnet to testnet")
      }
      
      // return 
    }




    // if (senderBlockchain?.value === selectedOption?.value) {
    //   alert("Sender Blockchain and Receiver Blockchain cannot be the same");
    //   // return;
    // }

    setReceiverBlockchain(selectedOption);
    checkAllFieldsFilled();
  };

  const handleContractAddressChange = (value: string) => {
    setContractAddress(value);
    checkAllFieldsFilled();
  };

  const handleTokenIDChange = (value: string) => {
    setTokenID(value);
    checkAllFieldsFilled();
  };

  const checkAllFieldsFilled = () => {
    const filled =
      senderBlockchain !== null &&
      receiverBlockchain !== null &&
      contractAddress !== "" &&
      tokenID !== "";
    setStepCompleted(filled);
  };

  const getNFTOwner = async (contractAddress : Address,  tokenID : bigint) => {
    console.log(contractAddress)
    console.log(tokenID)
    const owner = await publicClient.readContract({
        address : contractAddress,
        abi : erc721ABI,
        functionName : "ownerOf",
        args : [tokenID]
    })

    return owner
}

  const handleConfirmImport = async () => {
    
    const isTestnetSender = isTestNetwork(senderBlockchain ? senderBlockchain.value : "")
    const isTestnetReceiver = isTestNetwork(receiverBlockchain ? receiverBlockchain.value : "")
    
    if(isTestnetSender && !isTestnetReceiver){
      alert("Can't swap from mainnet to testnet")
      return 
    }
    
    if(isTestnetReceiver && !isTestnetSender) {
      alert("Can't swap from testnet to mainnet")
      return
    }

    
    
    
    const swapzAddress : any = getContractAddress(publicClient.chain.id)
    
    if(!swapzAddress) {
      alert("Invalid Network")
      return 
    }
    if (senderBlockchain?.value === receiverBlockchain?.value) {
      alert("Sender Blockchain and Receiver Blockchain cannot be the same");
      return;
    }

    const isAddress = web3.utils.isAddress(contractAddress);
    if (!isAddress) {
      alert("Invalid contract address");
      return;
    }
    const checkSummed = web3.utils.toChecksumAddress(contractAddress);
    
    const isSupported = await publicClient.readContract({
      address : swapzAddress as Address,
      abi : abi,
      functionName : "tokenToAllowed",
      args : [checkSummed]
    })
    console.log(isSupported)
    
    if(!isSupported){
      setModalContent({
        title : "Token Not Supported",
        content : "Token is not supported"
      })
      
      alert("Token Not Supported")
      return 
    }


    
    const res = await getNftDetails(checkSummed as Address);

    if (!res) {
      alert("Contract not found on this network");
      return;
    }


    if(BigInt(tokenID) > res.totalSupply) {
      alert("Token greater than total supploy")
      return 
    }
    try{
      if(!walletClient) return 
      const owner = await getNFTOwner(contractAddress as Address, BigInt(tokenID))
      if(owner != walletClient.account.address) {
        alert("You're not the owner of this nft")
        return
      }
    }catch(e){
      alert("Nft with the given ID doesn't exist")
      return 
    }

    

    setNftDetail(res);
    if (stepCompleted) {
      setShowNextPhase(true);
    }
  };

  return (
    <div>
      <ImportNft
        showNextPhase={showNextPhase}
        stepCompleted={stepCompleted}
        senderBlockchain={senderBlockchain}
        receiverBlockchain={receiverBlockchain}
        contractAddress={contractAddress}
        tokenID={tokenID}
        handleSenderChange={handleSenderChange}
        handleReceiverChange={handleReceiverChange}
        handleContractAddressChange={handleContractAddressChange}
        handleTokenIDChange={handleTokenIDChange}
        handleConfirmImport={handleConfirmImport}
        nftDetails={nftDetail}
        close={() => setShowNextPhase(false)}
      />
      <Transfer
        showNextPhase={showNextPhase}
        stepCompleted={stepCompleted}
        modalContent={modalContent}
        contractAddress={contractAddress}
        tokenID={tokenID}
        setTransactionHash={setTransactionHash}
        // close={() => setShowNextPhase(false)}
      />

      {/* for testing */}
      {/* The confirmation screen appears from above after successful swap */}

      <Success
        senderBlockchain={senderBlockchain}
        transactionHash={transactionHash}
        receiverBlockchain={receiverBlockchain}
        nftDetail={nftDetail}
      />

      {/* <ItemHistory
                senderBlockchain={senderBlockchain}
                receiverBlockchain={receiverBlockchain}
      /> */}

      {/* for testing */}
    </div>
  );
};
