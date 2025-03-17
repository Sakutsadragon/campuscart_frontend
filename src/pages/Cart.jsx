import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { getcartdetailsRoute } from "../utils/APIRoutes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShoppingCart, faBoxOpen, faSpinner, faHome, faBox, faHistory, faTicketAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/logoo.png"; // Ensure this path is correct

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const studentUsername = location.state;

    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentUsername) {
            alert("Student details not found");
            navigate("/login"); // Redirect to login if no student found
            return;
        }

        const fetchCart = async () => {
            try {
                const response = await axios.get(getcartdetailsRoute(studentUsername));
                setCartProducts(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setLoading(false);
            }
        };

        fetchCart();
    }, [studentUsername, navigate]);

    if (loading) {
        return (
            <LoadingMessage>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                Loading cart...
            </LoadingMessage>
        );
    }

    if (!cartProducts.length) {
        return (
            <EmptyCartMessage>
                <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                Your cart is empty
            </EmptyCartMessage>
        );
    }

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <LogoImg src={Logo} alt="Logo" />
                        <WelcomeMessage>Shopping Cart</WelcomeMessage>
                    </LogoContainer>
                    <BackButton onClick={() => navigate("/available-products")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>

            <Section>
                <CartItems>
                    {cartProducts.map((item) => (
                        <CartItem key={item.productId._id}>
                            <ItemImage src="https://picsum.photos/200" alt={item.productId.productName} />
                            <ItemDetails>
                                <ItemTitle
                                    onClick={() => navigate("/viewProduct", { state: item.productId._id })}
                                >
                                    {item.productId.productName}
                                </ItemTitle>
                                <ItemDetail><strong>Quantity:</strong> {item.quantity}</ItemDetail>
                                <ItemDetail><strong>Price:</strong> ₹{item.price}</ItemDetail>
                                <BuyButton
                                    onClick={() => navigate("/purchasingpage", { state: { product: item.productId, quantity: item.quantity, studentUsername } })}
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                                    Buy Now
                                </BuyButton>
                            </ItemDetails>
                        </CartItem>
                    ))}
                </CartItems>
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

const CartItems = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const CartItem = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 15px;
    display: flex;
    gap: 15px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-3px); /* Consistent hover effect */
    }
`;

const ItemImage = styled.div`
    width: 100px;
    height: 100px;
    background-image: url('https://picsum.photos/200');
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
`;

const ItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ItemTitle = styled.div`
    font-size: 1.25rem;
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    cursor: pointer;

    &:hover {
        color: #3498db; /* Blue on hover */
    }
`;

const ItemDetail = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 600;
    }
`;

const BuyButton = styled.div`
    background-color: #3498db; /* Consistent blue button */
    color: white;
    padding: 10px 15px;
    border-radius: 10px; /* Consistent radius */
    font-size: 0.9rem;
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    align-self: flex-start;

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
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Consistent hover color */
        transform: scale(1.05); /* Consistent hover effect */
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

const EmptyCartMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.4rem;
    color: #95a5a6; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
`;

export default Cart;