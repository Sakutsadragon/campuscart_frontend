import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { getSellerProducts } from "../utils/APIRoutes";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner, faBoxOpen, faHistory, faTicketAlt, faTruck, faBox , faTags, faHome} from '@fortawesome/free-solid-svg-icons';

function SellerProducts() {
    const location = useLocation();
    const navigate = useNavigate();
    const sellerName = location.state; // Retrieve sellerName from navigation state

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const isFetchingRef = useRef(false); // Prevent multiple API calls

    // Fetch student username from localStorage
    const [studentUsername, setStudentUsername] = useState("");
    useEffect(() => {
        const storedStudent = localStorage.getItem("student-user");
        if (storedStudent) {
            const parsedStudent = JSON.parse(storedStudent);
            setStudentUsername(parsedStudent.username);
        }
    }, []);

    // Function to fetch products with pagination
    const fetchProducts = async (pageNum) => {
        if (!sellerName || !hasMore || isFetchingRef.current) return;

        isFetchingRef.current = true; // Mark request in progress
        setLoading(true);

        try {
            const response = await axios.get(getSellerProducts(sellerName) + `&page=${pageNum}`);
            setProducts(prevProducts => {
                const newProducts = response.data.products.filter(
                    newProduct => !prevProducts.some(product => product._id === newProduct._id)
                );
                return [...prevProducts, ...newProducts];
            });
            setHasMore(response.data.hasMore); // Update availability of more products
        } catch (error) {
            console.error("Error fetching seller products:", error);
        } finally {
            setLoading(false);
            isFetchingRef.current = false; // Reset fetching status
        }
    };

    useEffect(() => {
        if (!sellerName) {
            navigate("/"); // Redirect to home if no sellerName is found
            return;
        }
        fetchProducts(page);
    }, [sellerName, page, navigate]);

    // Infinite Scroll Event Listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore]);

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <img src={Logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </LogoContainer>
                <WelcomeMessage>{sellerName}'s Products</WelcomeMessage>
                <CartButton onClick={() => navigate("/cart",{ state: studentUsername })} aria-label="Go to Cart">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </CartButton>
            </Header>

            <Section>
                <ProductsGrid>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product._id}
                                onClick={() => navigate(`/viewproduct`, { state: product._id })}
                            >
                                <ProductImage src={product.image || "https://picsum.photos/200"} alt={product.productName} />
                                <ProductInfo>
                                    <ProductName>{product.productName}</ProductName>
                                    <ProductDetail>
                                        <FontAwesomeIcon icon={faTags} style={{ marginRight: "5px", color: "#3498db" }} />
                                        {product.category}
                                    </ProductDetail>
                                    <ProductDetail>
                                        <FontAwesomeIcon icon={faBox} style={{ marginRight: "5px", color: "#3498db" }} />
                                        {product.quantity} in stock
                                    </ProductDetail>
                                    <ProductPrice>₹{product.cost}</ProductPrice>
                                </ProductInfo>
                            </ProductCard>
                        ))
                    ) : (
                        <NoProductsMessage>
                            <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                            No products available.
                        </NoProductsMessage>
                    )}
                </ProductsGrid>
                {loading && (
                    <LoadingMessage>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                        Loading more products...
                    </LoadingMessage>
                )}
            </Section>

            <Footer>
                 <FooterButton onClick={() => navigate("/home")} aria-label="Back to Home">
                                    <FontAwesomeIcon icon={faHome} />
                 </FooterButton>
                <FooterButton onClick={() => navigate("/available-products")} aria-label="View All Products">
                    <FontAwesomeIcon icon={faBoxOpen} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/previous-orders", { state: studentUsername })} aria-label="Previous Orders">
                    <FontAwesomeIcon icon={faHistory} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/scoupons", { state: studentUsername })} aria-label="Available Coupons">
                    <FontAwesomeIcon icon={faTicketAlt} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/track-order", { state: studentUsername })} aria-label="Track Order">
                    <FontAwesomeIcon icon={faTruck} />
                </FooterButton>
            </Footer>
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
    font-family: 'Quicksand', sans-serif; /* Consistent font */
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

const WelcomeMessage = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
    flex: 1; /* Center the title */
`;

const CartButton = styled.button`
    background-color: #3498db; /* Consistent color scheme */
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
        background-color: #2980b9; /* Slightly darker shade for hover */
    }

    svg {
        font-size: 1.25rem;
    }
`;

const Section = styled.section`
    width: 100%;
    max-width: 1280px; /* Consistent max-width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow and push footer to bottom */
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* Fixed 4 columns as original */
    gap: 15px; /* Adjusted gap for consistency */
    width: 100%;
    padding: 0 15px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr); /* Adjust to 3 columns on smaller screens */
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr); /* Adjust to 2 columns on mobile */
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr; /* Single column on very small screens */
    }
`;

const ProductCard = styled.div`
    background-color: #ffffff; /* Consistent color scheme */
    border-radius: 15px; /* Consistent border radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 250px; /* Consistent max-width */
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-3px); /* Consistent hover effect */
    }
`;

const ProductImage = styled.img`
    width: 100%;
    height: 8rem; /* Kept original height as requested */
    object-fit: cover;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`;

const ProductInfo = styled.div`
    padding: 10px; /* Adjusted padding for consistency */
    text-align: center;
    width: 100%;
`;

const ProductName = styled.h3`
    font-size: 1.1rem; /* Slightly adjusted for consistency */
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    margin-bottom: 5px;
`;

const ProductDetail = styled.p`
    font-size: 0.9rem; /* Adjusted for consistency */
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', sans-serif; /* Consistent font */
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`;

const ProductPrice = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: #3498db; /* Highlight price with consistent color */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    margin-top: 5px;
`;

const NoProductsMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.4rem;
    color: #95a5a6; /* Consistent color scheme */
    font-family: 'Quicksand', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
    text-align: center;
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', sans-serif; /* Consistent font */
    font-weight: 600;
    margin-top: 20px;
    gap: 10px;
`;

const Footer = styled.footer`
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%); /* Consistent gradient */
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 15px 0; /* Consistent padding */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px; /* Consistent gap */
    position: sticky;
    bottom: 0;
    z-index: 10; /* Ensure footer stays above content */
    border-top: 1px solid #e8ecef; /* Consistent border */
`;

const FooterButton = styled.button`
    background-color: #3498db; /* Consistent color scheme */
    color: white;
    padding: 12px; /* Consistent padding */
    border: none;
    cursor: pointer;
    border-radius: 12px; /* Consistent radius */
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Consistent hover color */
        transform: scale(1.15); /* Consistent hover effect */
    }

    svg {
        font-size: 1.5rem; /* Consistent icon size */
    }
`;

export default SellerProducts;