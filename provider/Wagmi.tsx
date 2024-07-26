import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { WagmiConfig, configureChains, createConfig, UsePrepareContractWriteConfig } from "wagmi";
import store, { persistor } from "@/store";
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import preconfiguredChains from "@/configs/chains";


interface WagmiProviderProps {
    children: ReactNode;
}
type WagmiConfigType = any;

export default function WagmiProvider({ children }: WagmiProviderProps) {
    const [config, setConfig] = useState<WagmiConfigType | null>(null);

    useEffect(() => {
        const { publicClient, webSocketPublicClient } = configureChains(
          //@ts-ignore
            Object.values(preconfiguredChains),
            [
                publicProvider(),
            ],
        );
        console.log('[WagmiProvider]', publicClient)
        const conf = createConfig({
            autoConnect: true,
            publicClient,
            webSocketPublicClient,
        });
        setConfig(conf);
    }, []);
  if (!config) return null;

  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <WagmiConfig config={config}>
                {children}
            </WagmiConfig>
        </PersistGate>
    </Provider>
  );
}