import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { addproductRoute } from "../utils/APIRoutes";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

function Addproduct() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const seller = state?.seller;

    const [product, setProduct] = useState({
        username: seller?.username || "", // Attach seller username
        productName: "",
        cost: "",
        category: "",
        quantity: "",
        description: "",
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(addproductRoute, product);
            toast.success("Product added successfully!");
            navigate("/shome"); // Redirect to dashboard
        } catch (err) {
            toast.error("Error adding product");
        }
    };

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <img src={Logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </LogoContainer>
                <Title>Add Product</Title>
                <BackButton onClick={() => navigate(-1)} aria-label="Back">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </BackButton>
            </Header>

            <Section>
                <FormContainer>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            type="text"
                            name="productName"
                            placeholder="Product Name"
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            type="number"
                            name="cost"
                            placeholder="Cost (₹)"
                            onChange={handleChange}
                            required
                        />
                        <FormSelect
                            name="category"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Stationery">Stationery</option>
                            <option value="Home">Home</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Sports">Sports</option>
                            <option value="Food">Food</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Other">Other</option>
                        </FormSelect>
                        <FormInput
                            type="number"
                            name="quantity"
                            placeholder="Stock Quantity"
                            onChange={handleChange}
                            required
                        />
                        <FormTextarea
                            name="description"
                            placeholder="Product Description"
                            onChange={handleChange}
                            required
                        />
                        <FormButton type="submit">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
                            Add Product
                        </FormButton>
                    </form>
                </FormContainer>
            </Section>

            <ToastContainer />
        </Container>
    );
}

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background-color: #f0f4f8; /* Consistent pastel background */
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Enable vertical scrolling */
    scroll-behavior: smooth; /* Smooth scrolling */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font with fallback */
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 30px;
    background-color: #ffffff; /* White background for header */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    position: sticky;
    top: 0;
    z-index: 10; /* Ensure header stays above content */
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
    flex: 1; /* Center the title */
`;

const BackButton = styled.button`
    background-color: #e74c3c; /* Red for back button */
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c0392b; /* Darker red on hover */
    }

    svg {
        font-size: 1.25rem;
    }
`;

const Section = styled.section`
   width: 100%;
    max-width: 600px; /* Narrower form for simplicity */
    padding: 20px 40px; /* Increased side padding for margins in full-screen */
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow */
    margin: 0 auto; /* Center the section with auto margins */

    @media (max-width: 768px) {
        padding: 20px 20px; /* Reduce padding on smaller screens */
    }
`;

const FormContainer = styled.div`
    background-color: #ffffff; /* White form background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    form {
        display: flex;
        flex-direction: column;
        gap: 15px; /* Reduced gap for a tighter layout */
        width: 100%;
    }
`;

const FormInput = styled.input`
    background-color: #f9f9f9; /* Light gray background for inputs */
    padding: 12px 15px; /* Slightly adjusted padding */
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    color: #2e4a6d; /* Dark text for contrast */
    width: 100%;
    font-size: 1rem;
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #2980b9; /* Darker blue on focus */
        outline: none;
    }
`;

const FormSelect = styled.select`
    background-color: #f9f9f9; /* Light gray background */
    padding: 12px 15px; /* Consistent padding */
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    color: #2e4a6d; /* Dark text for contrast */
    width: 100%;
    font-size: 1rem;
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #2980b9; /* Darker blue on focus */
        outline: none;
    }
`;

const FormTextarea = styled.textarea`
    background-color: #f9f9f9; /* Light gray background */
    padding: 12px 15px; /* Consistent padding */
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    color: #2e4a6d; /* Dark text for contrast */
    width: 100%;
    font-size: 1rem;
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    height: 100px; /* Fixed height for simplicity */
    resize: vertical; /* Allow vertical resizing */
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #2980b9; /* Darker blue on focus */
        outline: none;
    }
`;

const FormButton = styled.button`
    background-color: #3498db; /* Consistent blue button */
    color: white;
    padding: 12px 20px; /* Larger padding for emphasis */
    border: none;
    cursor: pointer;
    border-radius: 10px; /* Consistent radius */
    font-size: 1.1rem; /* Slightly larger font */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Darker blue on hover */
        transform: scale(1.05); /* Slight scale on hover */
    }

    svg {
        font-size: 1.25rem;
        margin-right: 8px;
    }
`;

export default Addproduct;