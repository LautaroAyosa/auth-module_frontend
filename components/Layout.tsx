// components/Layout.tsx
import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-sans">
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
};

export default Layout;