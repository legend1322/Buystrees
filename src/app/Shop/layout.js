// app/layout.jsx
import { AuthProvider } from "@/utils/client/AuthContext";
import Header from "@/components/User/Header";
import Footer from "@/components/User/Footer";
import "../globals.css"; // adjust this path as needed

export const metadata = {
  title: "BuyTrees",
  description: "Your online plant shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="mt-[100px]">{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}