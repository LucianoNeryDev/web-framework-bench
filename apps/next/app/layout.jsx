import { site } from "../lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

const THEME_SCRIPT =
  'try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}';

export default function RootLayout({ children }) {
  return (
    // The theme script sets data-theme before hydration, so React must not warn about the attribute.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
