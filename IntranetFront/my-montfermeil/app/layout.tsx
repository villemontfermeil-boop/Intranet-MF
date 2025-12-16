'use client';
import Header from "./component/Header";


function RootLayout({ children } : { children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Header isConnectd={false}/>
        {children}
      </body>
    </html>
  );



}
export default RootLayout;