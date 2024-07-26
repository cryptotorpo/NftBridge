"use client";

import { useSelector } from "react-redux";
import { useNetwork, useAccount } from "wagmi";
import { Tab } from "@headlessui/react";

import Layout from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { BridgeContainer } from "./BridgeContainer";
import { HistoryContainer } from "./HistoryContainer";
import { abi, getContractAddress } from "@/configs";
import { RootState } from "@/store";
import { StatusErrorSVG } from "./mocks";
import { useEffect } from "react";

const BridgeNFT = () => {
  const { chain } = useNetwork();
  const store = useSelector((state: RootState) => state.wallet);
  const { isConnected } = useAccount();
  const isLoading = store.isLoading;
  //@ts-ignore
  const contractAddress = getContractAddress(chain?.id);

//   useEffect(() => {

//     const intervalId = setInterval(() => console.clear(), 1000)

//     return () => clearInterval(intervalId)
// }, [])


  return (
    <>
      <Layout hideFooter connectWallet>
        <div className="sm:px-5 px-1 py-5 flex flex-col items-center justify-center w-full lg:flex-col text-[#363636] dark:text-white">
          {contractAddress ? (
            <div className="lg:grid grid-rows-1 lg:grid-rows-1 grid-cols-1 lg:grid-cols-1 w-full sm:w-3/4 lg:w-2/4 xl:w-2/4 flex flex-col-reverse ">
              <div className="row-span-3 col-span-2 bg-n-8/0 rounded-2xl w-full">
                <div className="w-full">
                  <Tab.Group>
                    <Tab.List
                      className="w-[240px] my-0 mx-auto h-12 flex space-x-1 border-[#DDDDDD] dark:border-[#606060] border-2 p-[2px] rounded-[10px]"
                      style={{
                        pointerEvents: isLoading ? "none" : "auto",
                        opacity: isLoading ? 0.3 : undefined,
                      }}
                    >
                      {["Bridge", "History"].map((tab) => (
                        <Tab
                          key={tab}
                          className={({ selected }) =>
                            `px-4 w-full rounded-md font-bold ${
                              selected
                                ? "bg-[#FECE00] text-[#363636]"
                                : "text-[#363636] dark:text-white hover:bg-black/[0.1]"
                            }`
                          }
                        >
                          {tab}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels>
                      <Tab.Panel>
                        <BridgeContainer />
                      </Tab.Panel>
                      <Tab.Panel>
                        <HistoryContainer />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Modal
                title="This network is not supported"
                showModal={!contractAddress && isConnected}
              />
              <StatusErrorSVG />
              <p className="mt-5">
                To use the bridge, first connect the wallet!
              </p>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default BridgeNFT;
