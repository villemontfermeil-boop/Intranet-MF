'use client';
import { useEffect, useState } from "react";
import Header from "./component/Header";
import Footer from "./component/footer";

function RootLayout({ children }: { children: React.ReactNode }) {
  const [fullname, setFullname] = useState<string | null>(null);

  useEffect(() => {
    try {
      const prenom = sessionStorage.getItem('prenom');
      const nom = sessionStorage.getItem('nom');
      if (prenom && nom) setFullname(`${prenom} ${nom}`);
      else setFullname(null);
    } catch (e) {
      setFullname(null);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <div>
          <Header nom={fullname} />
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
