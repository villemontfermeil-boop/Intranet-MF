'use client';
import Header from "./component/Header";

 var localStorage = globalThis?.localStorage;
function RootLayout({ children } : { children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Header isConnectd={localStorage.length > 0 ? true : false}/>
        {children}
      </body>
    </html>
  );



}
export default RootLayout;