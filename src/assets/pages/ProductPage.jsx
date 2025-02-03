import {  useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
  };
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductPage({ getProducts, products, pageInfo, setIsAuth, setPageInfo , checkUserLogin }) {

    const [modalMode, setModalMode] = useState(null);
    const [isProductModalOpen,setIsProductModalOpen] = useState(false)

    const delProductModalRef = useRef(null);
    const handlePageChange = (page) => {
        setPageInfo(prev => ({ ...prev, current_page: page })); // 更新當前頁面
        getProducts(page);
    };
    const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
        switch (mode) {
            case 'create':
                setTempProduct(defaultModalState);
                break;
            case 'edit':
                setTempProduct(product)
                break;

            default:
                break;
        }

        // const modalInstance = new Modal(productModalRef.current);
        // modalInstance.show();
        setIsProductModalOpen(true);
    }
    const handleOpenDelProductModal = (product) => {
        setTempProduct(product);
        
        if (delProductModalRef.current) {
            let modalInstance = Modal.getInstance(delProductModalRef.current);
            if (!modalInstance) {
                modalInstance = new Modal(delProductModalRef.current);
            }
            modalInstance.show();
        } else {
            console.error("delProductModalRef.current 為 null，請檢查 Modal 是否正確渲染");
        }
    };
    
    

    // 頁碼變更時更新狀態

    
      const handleDeleteProduct = async () => {
        try {
          await deleteProduct();
          getProducts();
          handleCloseDelProductModal();
        } catch (error) {
          alert('刪除產品失敗')
        }
      }
    

    
  {/**渲染之後才可取得dom元素 */ }
  useEffect(() => {
    getProducts();

    // 確保刪除 Modal 被初始化
    if (delProductModalRef.current) {
        new Modal(delProductModalRef.current);
    }
}, []);





  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current)
    modalInstance.hide();
  }

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  
 
  const deleteProduct = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)
    } catch (error) {
      alert('新增產品失敗')
    }
  }



    return (
        <>
            <div className="container py-5">
                <div className="row">
                    <div className="col">
                        <button
                            onClick={checkUserLogin}
                            className="btn btn-success mb-5"
                            type="button"
                        >
                            檢查使用者是否登入
                        </button>
                        <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button onClick={() => { handleOpenProductModal('create') }} type="button" className="btn btn-primary">建立新的產品</button>
              </div>



                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { handleOpenProductModal('edit', product) }}>編輯</button>
                                                <button type="button" onClick={() => { handleOpenDelProductModal(product) }} className="btn btn-outline-danger btn-sm">刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange}></Pagination>
            </div>
            <ProductModal 
            modalMode={modalMode}
            tempProduct={tempProduct}
            isOpen = {isProductModalOpen}
            setIsOpen={setIsProductModalOpen}
            getProducts={getProducts}
            />
            

        

            <div
                ref={delProductModalRef}
                className="modal fade"
                id="delProductModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">刪除產品</h1>
                            <button
                                onClick={handleCloseDelProductModal}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            你是否要刪除
                            <span className="text-danger fw-bold">{tempProduct.title}</span>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={handleCloseDelProductModal}
                                type="button"
                                className="btn btn-secondary"
                            >
                                取消
                            </button>
                            <button type="button" onClick={handleDeleteProduct} className="btn btn-danger">
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductPage