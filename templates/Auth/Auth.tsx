/* eslint-disable */
import React, { useState, Fragment, useEffect } from 'react';
import _Common from '@ethereumjs/common';
import { useTheme } from 'next-themes';

import {
  useConnect,
  useAccount,
  useChainId,
  usePrepareSendTransaction,
  useSendTransaction,
  useDisconnect,

} from 'wagmi';

import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { Dialog, Transition } from '@headlessui/react';
import Identicon from '@/components/Jdenticon/Icon';
import { cutAddress } from '@/functions/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { reset, setTokens } from '@/store/walletSlice';
import Button from '@/components/Button';
import { preconfiguredChains } from '@/configs';
import tokensApi from '@/services/tokensApi';

const ConnectedAccount = () => {
  const { theme } = useTheme();
  const strokeColor = theme === 'dark' ? '#FFFFFF' : '#363636';

  const { isConnected, address } = useAccount();

  if (!address) return null;

  const { disconnect } = useDisconnect();
  const logOut = () => {
    disconnect();
  }
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="gap-1 md:gap-4 flex items-center">
      {/* <Networks /> */}
      <div className='text-[#363636] dark:text-white flex justify-center items-center px-3 py-2 font-semibold border border-[#DDDDDD] dark:border-[#606060] border-2 rounded-[10px]'>
        <Identicon value={address} size={20} className='mr-2 bg-white rounded-md sm:block hidden' />
        <div className="mt-[1px]">{cutAddress(address, 5, 4)}</div>
        <div className='flex justify-center items-center ml-2 cursor-pointer' onClick={logOut}>
          <svg className='icon-logout-hover' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2621 4.54211V3.84236C10.2621 2.31611 9.0246 1.07861 7.49835 1.07861H3.8421C2.3166 1.07861 1.0791 2.31611 1.0791 3.84236V12.1899C1.0791 13.7161 2.3166 14.9536 3.8421 14.9536H7.50585C9.0276 14.9536 10.2621 13.7199 10.2621 12.1981V11.4909" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.3574 8.01599H6.32666" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.1611 5.82971L15.3571 8.01596L13.1611 10.203" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

const Auth = () => {
  const [modal, setModal] = useState(false);
  const [payload, setPayload] = useState(null);
  const onCloseDeployDialog = () => setPayload(null);


  const MetaMaskConnector = useConnect({
    connector: new InjectedConnector(),
  });

  const walletConnectConnector = useConnect({
    connector: new WalletConnectConnector({
      chains: Object.values(preconfiguredChains.default),
      options: {
        projectId: '5a49e7afc834c2b0e9367b3f912caf37',
      },
    }),
  });

  const connectToMetaMask = async () => {
    setModal(false);
    MetaMaskConnector.connect();
  };

  const connectToWalletConnect = async () => {
    setModal(false);
    await walletConnectConnector.connectAsync();
    // storeConnector('connectToWalletConnect');
    // dispatch(setConnector('walletConnectConnector'));
  }

  const { isConnected, address, isDisconnected } = useAccount();
  const chainId = useChainId();
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const getTokens = async () => {
      // reset wallet redux
      dispatch(reset());
      const tokens = await tokensApi.getTokens();
      dispatch(setTokens(tokens));
    }
    getTokens();

  }, [chainId, dispatch, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setModal(true);
    }
  }, [isConnected]);

  useEffect(() => {
    dispatch(reset());
  }, [address, chainId, dispatch, isConnected]);


  return (
    <>
      <div className="flex items-center justify-center">
        {isConnected ? <ConnectedAccount /> :
          <div data-type="button" onClick={() => setModal(true)}>
            <Button className="flex" width={180}>
              Connect Wallet
            </Button>
          </div>
        }
      </div>
      <Transition appear show={modal} as={Fragment}>
        <Dialog as="div" open={modal} onClose={() => setModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-center justify-center px-4">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel as="div" className="panel my-8 sm:w-[400px] w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-[#363636] dark:text-white modal-token-list-content bg-[#F7F7F7] dark:bg-[#363636]">
                  <div className="flex items-center justify-between px-5 py-3">
                    <h5 className="text-lg font-bold mt-2">Connect a wallet</h5>
                    <button type="button" className="text-[#363636] dark:text-[#FFFFFF] hover:text-dark no-outline" onClick={() => setModal(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <div className="p-5">
                    <ul className="list-none p-0 m-0">
                      <li
                        onClick={connectToMetaMask} className="mb-2 cursor-pointer p-2 rounded-lg flex items-center gap-2 bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                        <img
                          src="../../images/wallets/metamask.png"
                          alt={'icon'}
                          width={22}
                          height={22}
                        />
                        <span className="font-semibold text-base">MetaMask</span>
                      </li>
                      <li
                        onClick={connectToWalletConnect}
                        className="mb-2 cursor-pointer p-2 rounded-lg flex items-center gap-2 bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                        <img
                          src="../../images/wallets/wallet-connect.png"
                          alt={'icon'}
                          width={22}
                          height={22}
                        />
                        <span className="font-semibold text-base">WalletConnect</span>
                      </li>
                    </ul>

                  </div>
                  <div className="p-5 text-sm text-[#363636] dark:text-[#FFFFFF] pt-0">
                    By connecting a wallet, you accept to Aimagine <button type="button" className="hover:text-blue-800 text-primary">Terms of Service</button> and consent to its <button type="button" className="hover:text-blue-800 text-primary">Privacy Policy</button>.
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Auth;