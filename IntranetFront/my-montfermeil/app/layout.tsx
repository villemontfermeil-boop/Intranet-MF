'use client';
import Header from "./component/Header";
import Footer from "./component/footer";
 var localStorage = globalThis?.localStorage;
function RootLayout({ children } : { children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div>
        <Header nom={localStorage.length > 0 ? localStorage.getItem('prenom')+ ' '+ localStorage.getItem('nom'): null}/>
          
        </div>
        <div>
        {children}

        </div>
       <div>
        <Footer />

       </div>
      </body>
    </html>
  );



}
export default RootLayout;