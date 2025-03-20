import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="font-sans flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;