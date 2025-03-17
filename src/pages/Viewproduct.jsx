import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { getProductDetails, addToCartAPI } from "../utils/APIRoutes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faBoxOpen, faPlus, faHistory, faTicketAlt, faTruck, faHome, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/logoo.png"; // Ensure this path is correct

function ViewProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const productId = location.state;

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [studentUsername, setStudentUsername] = useState("");

    useEffect(() => {
        const storedStudent = localStorage.getItem("student-user");
        if (storedStudent) {
            const parsedStudent = JSON.parse(storedStudent);
            setStudentUsername(parsedStudent.username);
            console.log("Student Username set:", parsedStudent.username); // Debugging
        }

        if (productId) {
            axios.get(getProductDetails(productId))
                .then(response => {
                    setProduct(response.data);
                    console.log("Product data:", response.data); // Debugging
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching product details:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [productId]);

    const addToCart = async () => {
        if (!studentUsername || quantity <= 0) return;

        try {
            await axios.post(addToCartAPI, { studentUsername, productId, quantity });
            alert("Product added to cart!");
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    if (loading) {
        return (
            <LoadingMessage>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                Loading product...
            </LoadingMessage>
        );
    }

    if (!product) {
        return (
            <ErrorMessage>
                <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "1.5rem", color: "#dc2626", marginRight: "10px" }} />
                Product not found.
            </ErrorMessage>
        );
    }

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <LogoImg src={Logo} alt="Logo" />
                        <WelcomeMessage>Product Details</WelcomeMessage>
                    </LogoContainer>
                    <CartButton onClick={() => navigate("/cart", { state: studentUsername })}>
                        <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                        Cart
                    </CartButton>
                    <BackButton onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>

            <Section>
                <ProductCard>
                    <ImageContainer>
                        <ProductImage src="https://picsum.photos/200" alt={product.productName} />
                    </ImageContainer>
                    <ContentContainer>
                        <ProductTitle>{product.productName}</ProductTitle>
                        <ProductDescription>{product.description}</ProductDescription>
                        <DetailsGrid>
                            <DetailItem><strong>Category:</strong> {product.category}</DetailItem>
                            <DetailItem><strong>Price:</strong> ₹{product.cost}</DetailItem>
                            <DetailItem><strong>Available:</strong> {product.quantity} in stock</DetailItem>
                            <DetailItem><strong>Seller:</strong> {product.seller.username}</DetailItem>
                        </DetailsGrid>
                        <QuantitySelector>
                            <QuantityLabel>Quantity:</QuantityLabel>
                            <QuantityInput>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </QuantityInput>
                        </QuantitySelector>
                        <ButtonContainer>
                            <ActionButton onClick={addToCart}>
                                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
                                Add to Cart
                            </ActionButton>
                            <ActionButton
                                onClick={() => navigate("/purchasingpage", { state: { quantity, product, studentUsername } })}
                            >
                                <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                                Buy Now
                            </ActionButton>
                        </ButtonContainer>
                    </ContentContainer>
                </ProductCard>
            </Section>

            <Footer>
                <FooterButton onClick={() => navigate("/home")}>
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
    width: 100%;
    background-color: #ffffff; /* White background for header */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 15px 30px;
    position: sticky;
    top: 0;
    z-index: 10; /* Ensure header stays above content */
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
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

const ProductCard = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 30px;
    max-width: 600px; /* Slightly wider than PurchasingPage for balance */
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ProductImage = styled.div`
    width: 100%;
    max-width: 250px;
    height: 250px;
    background-image: url('https://picsum.photos/200');
    background-size: cover;
    background-position: center;
    border-radius: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const ProductTitle = styled.div`
    font-size: 1.75rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    text-align: center;
    text-transform: uppercase;
`;

const ProductDescription = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    text-align: center;
    line-height: 1.4;
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2-column grid */
    gap: 15px;
    text-align: left;
`;

const DetailItem = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 600;
    }
`;

const QuantitySelector = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;

const QuantityLabel = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
`;

const QuantityInput = styled.div`
    padding: 8px 12px;
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    background-color: #f9f9f9; /* Light gray background */
    width: 60px;
    transition: border-color 0.3s ease;

    input {
        width: 100%;
        border: none;
        background: transparent;
        outline: none;
        font-family: 'Quicksand', 'Arial', sans-serif;
        font-size: 1rem;
        color: #2e4a6d;
        text-align: center;
    }

    &:focus-within {
        border-color: #2980b9; /* Darker blue on focus */
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
`;

const ActionButton = styled.div`
    background-color: #3498db; /* Consistent blue button */
    color: white;
    padding: 12px 20px;
    border-radius: 10px; /* Consistent radius */
    font-size: 1rem;
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    text-transform: uppercase;
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

const Footer = styled.div`
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

const FooterButton = styled.div`
    background-color: #3498db; /* Consistent color scheme */
    color: white;
    padding: 12px 20px; /* Consistent padding */
    border-radius: 10px; /* Consistent radius */
    font-size: 1rem;
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Consistent hover color */
        transform: scale(1.05); /* Consistent hover effect */
    }

    svg {
        font-size: 1.5rem; /* Consistent icon size */
    }
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.4rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
`;

const ErrorMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.4rem;
    color: #dc2626; /* Consistent error color */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
`;

export default ViewProduct;