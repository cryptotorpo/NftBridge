import Header from "../Header";
import Footer from "../Footer";

type LayoutProps = {
    hideFooter?: boolean;
    children: React.ReactNode;
    connectWallet?: boolean;
};

const Layout = ({ hideFooter, children, connectWallet = false }: LayoutProps) => (
    <div className={`pt-[4.75rem] lg:pt-[5.25rem] bg-[#F7F7F7] dark:bg-[#363636] ${connectWallet && 'connect-wallet'}`}>
        <Header connectWallet={connectWallet} />
        {children}
        {hideFooter ? null : <Footer />}
    </div>
);

export default Layout;
