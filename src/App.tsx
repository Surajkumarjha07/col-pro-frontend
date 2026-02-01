import "./App.css";
import Home from "./pages/home";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LogIn from "./pages/logIn";
import SignUp from "./pages/signUp";
import { useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useAppDispatch } from "./redux/hooks";
import { setOpenProfileBadge } from "./redux/slices/profileBadge";
import Products from "./pages/product";
import ManageAccount from "./pages/manage-account";
import Cart from "./pages/cart";
import Order from "./pages/order";
import About from "./pages/about";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const publicURLs = ["/log-in", "/sign-up"];
  const hideNavURLs = ["/manage-account"];
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/log-in");
      return;
    }

    console.log("PATHNAME:::::::::::::::::: ", location.pathname);

    if (publicURLs.includes(location.pathname) && token) {
      navigate("/");
      return;
    }

    const handleClick = (e: React.MouseEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest(".profilebadge")) {
        dispatch(setOpenProfileBadge(true));
      } else {
        dispatch(setOpenProfileBadge(false));
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, [location.pathname, navigate, dispatch]);
  
  
  const isHideNavbar = hideNavURLs.includes(location.pathname) || publicURLs.includes(location.pathname);;

  return (
    <>
      {!isHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/manage-account" element={<ManageAccount />} />
        <Route path="/products" element={<Products/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<Order/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      {!isHideNavbar && <Footer />}
    </>
  );
}

export default App;
