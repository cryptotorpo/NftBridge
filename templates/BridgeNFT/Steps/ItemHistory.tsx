import React, { useEffect, useState } from 'react';
import { cutAddress, cutString, formatDateTime } from '@/functions/helpers';
import { nftPreview, nftName, statusSent, statusPending, statusError, date, hashTrx, StatusSentSVG, StatusPendingSVG, StatusErrorSVG, CopySVG } from '../mocks';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { blockchainOptions } from '@/components/Select/blockchainOptions';
import Image from 'next/image';
import { Address, erc721ABI, usePublicClient } from 'wagmi';
import { abi } from '@/configs';
import axios from 'axios';
import { getTransactionLink } from '@/configs/links';


interface Blockchain {
    logo: string;
    label: string;
    link: string;  
}

interface ItemHistoryProps {
    senderBlockchain?: Blockchain | null;
    receiverBlockchain?: Blockchain | null;
    event : any 
}

const ItemHistory: React.FC<ItemHistoryProps> = ({ senderBlockchain, receiverBlockchain, event }) => {
  
  // console.log(event)  
  const {value, token} = event.args
  const blockNumber  = event.blockNumber

  const handleCopy = () => console.log('Address copied to clipboard');
  // console.log(event.transactionHash)
    const blockchainLink = blockchainOptions.find(option => option.label === receiverBlockchain?.label)?.link;
    const transactionUrl = blockchainLink ? `${blockchainLink}${hashTrx}` : '#';
    const provider = usePublicClient()
    
    return (
        <div className="shadow-lg w-full p-4 sm:p-6 bg-[#FFFFFF] dark:bg-[#272727] rounded lg:rounded-md mt-5">
            <div className="leading-6">
                <TransactionHeader nftAddress={token} tokenId={value} blockNumber={blockNumber as bigint}/>
                <Divider />
                <BlockchainDetails title="Sender Blockchain" blockchain={senderBlockchain} />
                <BlockchainDetails title="Receiver Blockchain" blockchain={receiverBlockchain} />
                <TransactionFooter transactionUrl={getTransactionLink(provider.chain.id, event.transactionHash)}  transactionHash={event.transactionHash}/>
            </div>
        </div>
    );
}

interface TransactionHeaderInterface {
  nftAddress : string,
  tokenId : number,
  blockNumber : bigint
} 

const TransactionHeader = ({nftAddress, tokenId, blockNumber} : TransactionHeaderInterface) => {
  
  
  const [name, setName] = useState("")
  const [uri, setURI] = useState("")
  const [time, setTime] = useState(0)
  const  publicCLient = usePublicClient()


  useEffect(() => {
    publicCLient.getBlock({blockNumber : blockNumber}).then((block : any) => {
      // new Date(block.)
      setTime(Number(block.timestamp) * 1000)
    })
    
  }, [blockNumber, publicCLient])
  

  useEffect (() => {
      publicCLient.readContract({
        address : nftAddress as Address,
        abi : erc721ABI,
        functionName : "name"
      }).then((name) =>  setName(name))
      
  }, [nftAddress, publicCLient])


  useEffect(() => {
    publicCLient.readContract({
      address : nftAddress as Address,
      abi : erc721ABI,
      functionName : "tokenURI",
      args : [BigInt(tokenId)]
    }).then((res) => {
      let link = res
      if(res.startsWith("ipfs://")) {
                link = `https://ipfs.io/ipfs/${res.slice(7)}`
                }
            axios.get(link).then((res) => {
                let image = res.data.image 
                // console.log(image)
                if(image){
                    image = image.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${image.slice(7)}` : image 
                    setURI(image)
                
                }
                // console.log(res)
            })
      setURI(uri)
    })  
    // setName(name)

  }, [tokenId, publicCLient])

  return (<div className="flex justify-between">
      <div className="flex space-x-2 items-start">
        <Image className="rounded-xl" src={uri} alt="NFT" width={65} height={65} />
        <div className="flex flex-col">
          <div className="text-sm">Name</div>
          <div className="text-md">{cutString(name, 30)}</div>
        </div>
      </div>
      <div className="flex items-end flex-col">
        <div className="mb-2 text-md flex items-center justify-center text-[#363636] dark:text-white">
          {/* <StatusSentSVG />
          {statusSent} */}
          {/* <StatusErrorSVG />
          {statusError} */}
          <StatusPendingSVG />
          {statusSent}
        </div>
        <div className="text-sm text-right text-[#363636] dark:text-white">
          {formatDateTime(time)}
        </div>
      </div>
    </div>
)};

const Divider = () => <div className="border-b border-[#DDDDDD] dark:border-[#606060] my-5"></div>;

const BlockchainDetails = ({ title, blockchain }: { title: string; blockchain?: Blockchain | null }) => (
  <div className="flex flex-1 text-sm justify-between mb-2">
    {title}
    <div className="flex items-center">
        {blockchain?.logo ? (
            <Image className="rounded-full w-7 mr-2" src={blockchain.logo} alt={blockchain.label || 'Blockchain logo'} width={28} height={28} />
        ) : (
            <div style={{ width: 28, height: 28, marginRight: '0.5rem' }}></div>
        )}
        <div className='opacity-50'>{blockchain ? blockchain.label : '...'}</div>
    </div>
  </div>
);

const TransactionFooter = ({ transactionUrl, transactionHash }: { transactionUrl: string, transactionHash : string }) => (
 
  <div className='mt-5 bg-[#F7F7F7] dark:bg-[#363636] p-4 flex items-center justify-between'>
    <div className="text-sm text-[#363636] dark:text-white">
      Transaction Hash
    </div>
    <div className="text-md flex space-x-2 text-[#363636] dark:text-white">
      <a href={transactionUrl} className='underline' target="_blank" rel="noopener noreferrer">{cutAddress(transactionHash, 8, 10)}</a>
      <CopyButton />
    </div>
  </div>
);

const CopyButton = () => (
  <CopyToClipboard text={hashTrx} onCopy={() => alert('Address copied to clipboard')}>
    <button>
        <CopySVG />
    </button>
  </CopyToClipboard>
);

export default ItemHistory;
