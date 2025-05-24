import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='flex-grow'
      >
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <Outlet />
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;
