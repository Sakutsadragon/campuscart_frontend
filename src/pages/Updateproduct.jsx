import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { updateproductRoute } from "../utils/APIRoutes";

function Updateproduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const seller = state?.seller;

    const [product, setProduct] = useState({
        productName: "",
        cost: "",
        category: "",
        quantity: "",
        description: "",
        sellerUsername: seller?.username || "",
    });

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${updateproductRoute}?username=${seller?.username}`);
            setProduct(res.data.product);
        } catch (err) {
            toast.error("Error fetching product details");
        }
    };

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/seller/update-product/${id}`, product);
            toast.success("Product updated successfully!");
            navigate("/");
        } catch (err) {
            toast.error("Error updating product");
        }
    };

    return (
        <div>
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="productName" value={product.productName} onChange={handleChange} required />
                <input type="number" name="cost" value={product.cost} onChange={handleChange} required />
                <input type="text" name="category" value={product.category} onChange={handleChange} required />
                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required />
                <textarea name="description" value={product.description} onChange={handleChange} required></textarea>
                <button type="submit">Update Product</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Updateproduct;
