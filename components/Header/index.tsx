import { useEffect, useState } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Logo from "../Logo";
import dynamic from 'next/dynamic';
import { Provider } from "react-redux";
import store, { persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import preconfiguredChains from "@/configs/chains";
import ThemeToggle from "@/app/theme/theme-toggle";
// import { Link, animateScroll as scroll } from "react-scroll";


const Auth = dynamic(() => import("../../templates/Auth/Auth"), {
    ssr: false,
});

type HeaderProps = {
    connectWallet?: boolean;
};

const Header = ({ connectWallet = false }: HeaderProps) => {
    const [config, setConfig] = useState<any>(null);
    const [openNavigation, setOpenNavigation] = useState<boolean>(false);
    const handleClick = () => {
        enablePageScroll();
        setOpenNavigation(false);
    };

    useEffect(() => {
        enablePageScroll();
        setOpenNavigation(false);
    }, []);

    useEffect(() => {
        const { publicClient, webSocketPublicClient } = configureChains(
            //@ts-ignore
            Object.values(preconfiguredChains),
            [
                publicProvider(),
            ],
        );
        const conf = createConfig({
            autoConnect: true,
            publicClient,
            webSocketPublicClient,
        });
        setConfig(conf);

    }, []);

    if (!config) return null;

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };



    return (
        <div
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 ${openNavigation ? "bg-n-8 w-100" : " "
                } border-n-6 w-full lg:border-1 lg:border-stone-950`}
        >
            <div className={`${connectWallet && 'justify-between'} justify-between flex items-center h-[4.75rem] px-5 lg:h-[5.25rem] lg:px-7.5 xl:px-10`}>
                <Logo className="xl:mr-8" />
                <div className="flex items-center">
                    {connectWallet &&
                        <Provider store={store}>
                            <PersistGate loading={null} persistor={persistor}>
                                <WagmiConfig config={config}>
                                    <Auth />
                                </WagmiConfig>
                            </PersistGate>
                        </Provider>
                    }
                    <ThemeToggle/>
                </div>
            </div>
        </div>
    );
};

export default Header;
