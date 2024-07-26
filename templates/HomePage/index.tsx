"use client"
import BridgeNFT from "@/templates/BridgeNFT";
import WagmiProvider from "@/provider/Wagmi";

const Login = () => (
  <WagmiProvider>
    <BridgeNFT />
  </WagmiProvider>
);

export default Login;
