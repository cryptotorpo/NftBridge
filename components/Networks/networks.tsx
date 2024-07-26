/* eslint-disable */

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import React, { useState } from 'react';
import { useChainId, useSwitchNetwork } from 'wagmi';
import preconfiguredChains from '@/configs/chains';
import { Modal } from '@/components/Modal';
//@ts-ignore
const Networks = (props) => {
  const [openNetworks, setOpenNetworks] = useState(false);

  const { switchNetwork, isLoading, error } = useSwitchNetwork();
  const chainId = useChainId();
  const selectedNetwork = Object.values(preconfiguredChains).find((it) => it.id === chainId);

  const handleNetworkSelection = (chainId: number) => {
    if (isLoading) return;
    if (chainId === selectedNetwork?.id) return;
    switchNetwork?.(chainId);
    setOpenNetworks(false);
  };

  useEffect(() => {
    if (error) {
      //TODO: use error notifier component here instead confirm
      confirm(error?.message);
    }
  }, [error]);

  if (!selectedNetwork) return null;
  
  return (
    <div>
      <div className="flex items-center justify-center hover:text-color-1">
        <button
          type="button"
          onClick={() => setOpenNetworks(true)}
          className="flex justify-center items-center px-3 py-2 font-semibold text-dark transition rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
        >
          <img
            src={`../../images/networks/${selectedNetwork.network}.png`}
            alt={selectedNetwork.name}
            className="h-5 w-5 rounded-md object-cover mr-2"
          />
          {!props.hideName && <span className='mt-[1px] hidden md:flex'>{selectedNetwork.name}</span>}
          <svg className={`inline-block h-5 w-4 ${props.hideName ? "ml-0" : "ml-2"}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <Modal className={"modal-token-list-content"} showModal={openNetworks} title='Select Network' closeModal={() => setOpenNetworks(false)}>
        <div className="dropdown">
          <ul className="max-h-[300px] overflow-scroll font-semibold text-dark dark:text-[#363636] dark:text-[#FFFFFF] dark:text-[#363636] dark:text-white-light/90">
            {(Object.values(preconfiguredChains)).map((network) => (
              <li key={network.id} className='flex items-center px-2 mb-4 last:mb-0 cursor-pointer h-[53px]'>
                <div className='justify-items-start flex flex-row items-center' onClick={() => handleNetworkSelection(network.id)}>
                  <img
                    src={`../../images/networks/${network.network}.png`}
                    alt={network.name}
                    className="h-7 w-7 rounded-md object-cover"
                  />
                  <span className="ml-3 mr-3">{network.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default Networks;
