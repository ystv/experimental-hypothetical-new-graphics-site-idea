/* eslint-disable @next/next/no-page-custom-font */
import { WebsocketProvider } from "@/app/_components/websocket-provider";
import { TRPCReactProvider } from "@/trpc/react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz@0,14..32;1,14..32&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, overflow: "hidden" }}>
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            height: "1080px",
            width: "1920px",
            margin: 0,
          }}
        >
          <WebsocketProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </WebsocketProvider>
        </div>
      </body>
    </html>
  );
}
