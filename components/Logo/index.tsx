import Link from "next/link";
import Image from "next/image";
import { useTheme } from 'next-themes';

type LogoProps = {
    className?: string;
};

const logoDark = "/images/aimagine-logo.svg";
const logoLight = "/images/aimagine-logo-light.svg";

const Logo = ({ className = "" }: LogoProps) => {
    const { theme } = useTheme();

    return (
        <Link className={`block logo ${className}`} href="/">
            {theme === 'light' ? (
                <Image
                    src={logoLight}
                    width={120}
                    height={20}
                    priority
                    alt="Aimagine"
                />
            ) : (
                <Image
                    src={logoDark}
                    width={120}
                    height={20}
                    priority
                    alt="Aimagine"
                />
            )}
        </Link>
    );
};

export default Logo;
