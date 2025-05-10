import { ToastContainer } from "react-toastify";
import Banner from "./components/Banner";
import Contact from "./components/Contact";
import Header from "./components/Header";
import Product from "./components/Product";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div>
      <Header />
      <Banner />
      <Product />
      <Contact />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Footer />
    </div>
  );
}
