
type Links = {
    [key: number]: string;
};

const links : Links = {
    11155111 : "https://sepolia.etherscan.io/tx"
}


export const getTransactionLink = (chainId : number, hash : string) => {
    let link = links[chainId]
    
    if(link) {
        return `${link}/${hash}`
    }

    return ""
}


