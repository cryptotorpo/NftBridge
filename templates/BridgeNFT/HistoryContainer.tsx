import { SetStateAction, useEffect, useState } from "react";
import ItemHistory from "./Steps/ItemHistory";
import { Address, useAccount, useContractEvent, usePublicClient } from "wagmi";
import { abi, getContractAddress } from "@/configs";

export const HistoryContainer = () => {
  const [senderBlockchain, setSenderBlockchain] = useState(null);
  const [receiverBlockchain, setReceiverBlockchain] = useState(null);
  const publicClient = usePublicClient();
  const [swaps, setSwaps] = useState<any[]>([]);
  const {address} = useAccount()
  // const event = useContractEvent({})

  const getHistory = async (address : Address) => {
    const contractAddress = getContractAddress(publicClient.chain.id);
    console.log(contractAddress);
    console.log(publicClient.chain.id); 
    const events = await publicClient.getContractEvents({
      address: contractAddress as Address,
      abi: abi,
      // strict : false,
      fromBlock: 6338972n,

      eventName: "CrossSwap",
      args: {recipient : address}
    });


    // console.log(events[0].args.recipient);
    // console.log(address)
    const filtered = events.filter((event : any) => event.args.recipient.toLowerCase() == address.toLowerCase())
    console.log(filtered)
    setSwaps(filtered);
    // const events = await
  };

  useEffect(() => {
    if(!address)return 
    getHistory(address);
  }, [address]);

  useEffect(() => {}, []);

  return (
    <div>
      {swaps.map((swap, index) => (
        <ItemHistory
          senderBlockchain={senderBlockchain}
          receiverBlockchain={receiverBlockchain}
          event={swap}
        />
      ))}
      {swaps.length == 0 && (
        <div className="no-bridging">No bridging history</div>
      )}
    </div>
  );
};
