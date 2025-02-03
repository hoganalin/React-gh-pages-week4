import { useState } from "react";
import axios from "axios";
// import LoginPage from "./pages/LoginPage";
import ProductPage from "./assets/pages/ProductPage";
import LoginPage from "./assets/pages/LoginPage";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch {
      alert("取得產品失敗");
    }
  };
// 🔹 新增 checkUserLogin 並傳遞
const checkUserLogin = async () => {
  try {
    await axios.post(`${BASE_URL}/v2/api/user/check`);
    setIsAuth(true);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      {isAuth ? (
       <ProductPage 
       getProducts={getProducts} 
       products={products} 
       pageInfo={pageInfo}
       setPageInfo={setPageInfo} 
       setIsAuth={setIsAuth} 
       checkUserLogin={checkUserLogin}
       /> 
      ) : (
        <LoginPage setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;