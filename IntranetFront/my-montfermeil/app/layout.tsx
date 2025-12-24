'use client';

import Header from "./component/Header";
import Footer from "./component/footer";

function RootLayout({ children }: { children: React.ReactNode }) {
  const prenom = sessionStorage.getItem('prenom') || '';
  const nom = sessionStorage.getItem('nom') || '';

  return (
    <html lang="en">
      <body>
        <div>
          <Header nom={prenom && nom ? prenom + ' ' + nom : null} />
        </div>
        <div>{children}</div>
        <div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
