import "@splidejs/react-splide/css";
import "tippy.js/animations/shift-toward.css";
import "./globals.css";
import { Poppins } from "next/font/google";
import Theme from './theme/theme-provider'
// import { useEffect } from "react";


const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "block",
    variable: "--font-poppins",
});

export const metadata = {
    title: "Aimagine Bridge",
    description:
        "Aimagine..",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
				<meta name="description" content="Aimagine elevates the trading experience on decentralized exchanges to a new level, offering sophisticated trading features commonly found on centralized exchanges, accessible across various chains and DEXs." />
				<meta name="keywords" content="bridge" />

				<meta property="og:locale" content="en_US" />
				<meta property="og:url" content="" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Aimagine" />
				<meta property="og:site_name" content="Aimagine" />
				<meta property="og:description" content="Aimagine elevates the trading experience on decentralized exchanges to a new level, offering sophisticated trading features commonly found on centralized exchanges, accessible across various chains and DEXs." />
				<meta property="og:image" content="%PUBLIC_URL%/fb-og-image.png" />
            </head>

            <body
                className={`${poppins.variable} font-sans bg-[#F7F7F7] dark:bg-[#363636] text-n-1 text-base`}
            >
                <Theme>{children}</Theme>
            </body>
        </html>
    )
}
