const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Authentication Module</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://auth-module.lautaroayosa.com.ar/documentation/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              Documentation
            </a>
            <a href="https://github.com/lautaroayosa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              My GitHub
            </a>
            <a href="https://github.com/lautaroayosa/auth-module" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              Project Repo
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  