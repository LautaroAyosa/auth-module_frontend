import { useEffect, useState } from "react";

const FullPageLoader = ({ isLoading }: { isLoading: boolean }) => {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setVisible(false), 500); // Wait for fade-out animation
    } else {
      setVisible(true);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-lg z-50 
        transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce" />
    </div>
  );
};

export default FullPageLoader;
