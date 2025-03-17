import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner, faFilter, faBoxOpen, faHistory, faTicketAlt, faTruck, faEye, faEnvelope, faTags, faStoreSlash, faSearch, faArrowLeft, faHome, faBox } from '@fortawesome/free-solid-svg-icons';

function AvailableProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [studentUsername, setStudentUsername] = useState("");

    useEffect(() => {
        const storedStudent = localStorage.getItem("student-user");
        if (storedStudent) {
            const parsedStudent = JSON.parse(storedStudent);
            setStudentUsername(parsedStudent.username);
        }
        fetchProducts();
    }, [category, searchQuery]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/seller/available-products`, {
                params: { category: category || undefined, search: searchQuery || undefined }
            });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <LogoImg src={Logo} alt="Logo" />
                        <WelcomeMessage>Available Products</WelcomeMessage>
                    </LogoContainer>
                    <SearchContainer>
                        <SearchInput
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <SearchIcon>
                            <FontAwesomeIcon icon={faSearch} />
                        </SearchIcon>
                    </SearchContainer>
                    <CartButton onClick={() => navigate("/cart")}>
                        <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                        Cart
                    </CartButton>
                    <BackButton onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>

            <Section>
            <FilterContainer>
                    <CategoryLabel>Filter by Category:</CategoryLabel>
                    <CategorySelect value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
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
                    </CategorySelect>
                </FilterContainer>

                <ProductsGrid>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product._id}
                                onClick={() => navigate(`/viewproduct`, { state: product._id })}
                            >
                                <ProductImage src="https://picsum.photos/200" alt={product.productName} />
                                <ProductInfo>
                                    <ProductName>{product.productName}</ProductName>
                                    <ProductDetail><strong>Category:</strong> {product.category}</ProductDetail>
                                    <ProductDetail><strong>Cost:</strong> ₹{product.cost}</ProductDetail>
                                    <ProductDetail><strong>Rating:</strong> {product.rating} ⭐</ProductDetail>
                                    <ProductDetail><strong>Seller:</strong> {product.seller.username}</ProductDetail>
                                </ProductInfo>
                            </ProductCard>
                        ))
                    ) : (
                        <NoProductsMessage>
                            <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                            No products found
                        </NoProductsMessage>
                    )}
                </ProductsGrid>
            </Section>

            <Footer>
                           <FooterButton onClick={() => navigate("/home")}>
                               <FontAwesomeIcon icon={faHome} style={{ marginRight: "8px" }} />
                               Home
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/available-products")}>
                               <FontAwesomeIcon icon={faBox} style={{ marginRight: "8px" }} />
                               Products
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/previous-orders", { state: studentUsername })}>
                               <FontAwesomeIcon icon={faHistory} style={{ marginRight: "8px" }} />
                               Orders
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/scoupons", { state: studentUsername })}>
                               <FontAwesomeIcon icon={faTicketAlt} style={{ marginRight: "8px" }} />
                               Coupons
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/track-order", { state: studentUsername })}>
                               <FontAwesomeIcon icon={faTruck} style={{ marginRight: "8px" }} />
                               Track
                           </FooterButton>
                       </Footer>
        </Container>
    );
}

// Styled Components (using styled.div only)
const Container = styled.div`
    min-height: 100vh;
    background-color: #f0f4f8; /* Consistent pastel background */
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Enable vertical scrolling */
    scroll-behavior: smooth; /* Smooth scrolling */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font with fallback */
`;

const Header = styled.div`
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

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const LogoImg = styled.div`
    height: 50px;
    width: auto;
    background-image: url(${Logo});
    background-size: contain;
    background-repeat: no-repeat;
`;

const WelcomeMessage = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const SearchContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 300px;
`;

const SearchInput = styled.div`
    width: 100%;
    padding: 12px 40px 12px 15px; /* Space for icon */
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    font-size: 1rem;
    color: #2e4a6d;
    background-color: #f9f9f9; /* Light gray background */
    transition: border-color 0.3s ease;

    input {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
        outline: none;
        font-family: 'Quicksand', 'Arial', sans-serif;
        font-size: 1rem;
        color: #2e4a6d;
    }

    &:focus-within {
        border-color: #2980b9; /* Darker blue on focus */
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    right: 15px;
    color: #7f8c8d;
    font-size: 1.25rem;
`;

const CartButton = styled.div`
    background-color: #3498db; /* Consistent blue button */
    color: white;
    padding: 12px 20px;
    border-radius: 10px; /* Consistent radius */
    font-size: 1rem;
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Darker blue on hover */
        transform: scale(1.05); /* Slight scale on hover */
    }
`;

const BackButton = styled.div`
    background-color: #e74c3c; /* Red for back button */
    color: white;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c0392b; /* Darker red on hover */
    }

    svg {
        font-size: 1.25rem;
    }
`;

const Section = styled.div`
    width: 100%;
    max-width: 1200px; /* Consistent max-width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow */
    margin: 0 auto;
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const CategoryLabel = styled.label`
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937; /* Matches Tailwind's text-gray-800 */
`;

const CategorySelect = styled.select`
    padding: 0.75rem;
    border: 0.1rem solid #0f72ea;
    border-radius: 0.375rem;
    font-size: 1rem;
    color: #1f2937;
    background-color: #ffffff;
    cursor: pointer;

    &:focus {
        border-color: #997af0;
        outline: none;
    }
`;
const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns for desktop */
    gap: 15px;
    width: 100%;
    padding: 0 15px;
    max-height: 70vh; /* Limit height to enable scrolling */
    overflow-y: auto; /* Enable vertical scrolling */
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #3498db #f0f4f8; /* Firefox */

    &::-webkit-scrollbar {
        width: 8px; /* Chrome, Safari */
    }

    &::-webkit-scrollbar-track {
        background: #f0f4f8; /* Chrome, Safari */
    }

    &::-webkit-scrollbar-thumb {
        background: #3498db; /* Chrome, Safari */
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #2980b9; /* Chrome, Safari */
    }

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
`;

const ProductCard = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.05); /* Consistent hover effect */
    }
`;

const ProductImage = styled.div`
    width: 100%;
    height: 180px; /* Fixed height for consistency */
    background-image: url('https://picsum.photos/200');
    background-size: cover;
    background-position: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`;

const ProductInfo = styled.div`
    padding: 15px;
    text-align: center;
    width: 100%;
`;

const ProductName = styled.div`
    font-size: 1.25rem;
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    margin-bottom: 8px;
`;

const ProductDetail = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    margin-bottom: 4px;

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 600;
    }
`;

const NoProductsMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    color: #95a5a6; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
    text-align: center;
    padding: 20px;
`;

const Footer = styled.footer`
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%); /* Subtle gradient for attractiveness */
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Shadow on top */
    padding: 15px 0; /* Slightly increased padding for balance */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px; /* Increased gap for better spacing */
    position: sticky;
    bottom: 0;
    z-index: 10; /* Ensure footer stays above content */
    border-top: 1px solid #e8ecef; /* Subtle border for depth */
`;

const FooterButton = styled.button`
    background-color: #3498db; /* Consistent color scheme */
    color: white;
    padding: 12px; /* Slightly increased padding for better proportions */
    border: none;
    cursor: pointer;
    border-radius: 12px; /* Slightly larger radius for a softer look */
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */

    &:hover {
        background-color: #2980b9; /* Slightly darker shade for hover */
        transform: scale(1.15); /* Slightly larger scale for emphasis */
    }

    svg {
        font-size: 1.5rem; /* Increased icon size for better visibility */
    }
`;
export default AvailableProducts;