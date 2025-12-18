'use client';
import Header from "./component/Header";

 var localStorage = globalThis?.localStorage;
function RootLayout({ children } : { children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Header nom={localStorage.length > 0 ? localStorage.getItem('prenom')+ ' '+ localStorage.getItem('nom'): null}/>
        {children}
      </body>
    </html>
  );



}
export default RootLayout;