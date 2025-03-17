import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation to access state
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faShoppingCart, faHome, faBox, faHistory, faTicketAlt, faTruck } from '@fortawesome/free-solid-svg-icons';
import Logo from "../assets/logoo.png"; // Ensure this path is correct

const OrderPlaced = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const studentUsername = location.state?.studentUsername; // Assuming studentUsername is passed via state

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <LogoImg src={Logo} alt="Logo" />
                        <WelcomeMessage>Order Confirmation</WelcomeMessage>
                    </LogoContainer>
                </HeaderContent>
            </Header>

            <Section>
                <ConfirmationCard>
                    <SuccessIcon>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </SuccessIcon>
                    <SuccessMessage>Order Successfully Placed!</SuccessMessage>
                    <ContinueButton onClick={() => navigate("/available-products", { state: studentUsername })}>
                        <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "8px" }} />
                        Continue Shopping
                    </ContinueButton>
                </ConfirmationCard>
            </Section>

            <Footer>
                <FooterButton onClick={() => navigate("/home")}>
                    <FontAwesomeIcon icon={faHome} style={{ marginRight: "8px" }} />
                    Home
                </FooterButton>
                <FooterButton onClick={() => navigate("/available-products", { state: studentUsername })}>
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
};

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

const ConfirmationCard = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 30px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 50px;
`;

const SuccessIcon = styled.div`
    font-size: 4rem;
    color: #2ecc71; /* Green for success */
`;

const SuccessMessage = styled.div`
    font-size: 1.75rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    text-align: center;
    text-transform: uppercase;
`;

const ContinueButton = styled.div`
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
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Consistent hover color */
        transform: scale(1.05); /* Consistent hover effect */
    }
`;

export default OrderPlaced;