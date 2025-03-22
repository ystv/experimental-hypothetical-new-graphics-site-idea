import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { type Metadata } from "next";

import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { TRPCReactProvider } from "@/trpc/react";
import { AppLayout } from "../_components/app-shell";
import { SessionProvider } from "next-auth/react";
import { WebsocketProvider } from "../_components/websocket-provider";
import { auth, signIn } from "@/server/auth";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "YSTV Graphics Site",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session) {
    return signIn();
  }

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <SessionProvider>
          <WebsocketProvider>
            <TRPCReactProvider>
              <MantineProvider defaultColorScheme="auto">
                <Notifications />
                <AppLayout>{children}</AppLayout>
              </MantineProvider>
            </TRPCReactProvider>
          </WebsocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
