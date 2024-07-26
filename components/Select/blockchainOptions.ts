export const blockchainOptions = [
  {
    value: "ethereum",
    label: "Ethereum",
    logo: "/images/networks/Ethereum.png",
    link: "https://etherscan.io/tx/",
  },
  {
    value: "sepolia",
    label: "Sepolia",
    logo: "/images/networks/Ethereum.png",
    link: "https://sepolia.etherscan.io/tx/",
  },
  {
    value: "arbitrum",
    label: "Arbitrum",
    logo: "/images/networks/Arbitrum.png",
    link: "https://arbiscan.io/tx/",
  },
  {
    value: "opbnb",
    label: "BSCTestnet",
    logo: "/images/networks/opBNB.png",
    link: "https://bscscan.com/tx/",
  },
  {
    value: "optimism",
    label: "Optimism",
    logo: "/images/networks/Optimism.png",
    link: "https://optimistic.etherscan.io/tx/",
  },
];

export  const testNetworks = ["sepolia", "opbnb"]
export const isTestNetwork = (network : string) => {
  return testNetworks.includes(network)
}