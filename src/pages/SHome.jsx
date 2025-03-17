import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag, faShoppingBag, faCheckCircle, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';

function SHome() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        const storedSeller = localStorage.getItem("seller-user");
        if (storedSeller) {
            setSeller(JSON.parse(storedSeller));
        } else {
            navigate("/slogin"); // Redirect to seller login if not authenticated
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("seller-user");
        navigate("/slogin");
    };

    if (!seller) return null; // Prevent rendering if seller data isn't available yet

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <img src={Logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </LogoContainer>
                <WelcomeMessage>Welcome, {seller.username}</WelcomeMessage>
                <LogoutButton onClick={handleLogout} aria-label="Logout">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </LogoutButton>
            </Header>

            <Section>
                <SectionTitle>Seller Dashboard</SectionTitle>
                <DashboardGrid>
                    <DashboardButton onClick={() => navigate("/add-product", { state: { seller } })}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginBottom: "10px" }} />
                        Add Product
                    </DashboardButton>
                    <DashboardButton onClick={() => navigate("/add-coupon", { state: { seller } })}>
                        <FontAwesomeIcon icon={faTag} style={{ marginBottom: "10px" }} />
                        Add Coupons
                    </DashboardButton>
                    <DashboardButton onClick={() => navigate("/current-orders", { state: { seller } })}>
                        <FontAwesomeIcon icon={faShoppingBag} style={{ marginBottom: "10px" }} />
                        Current Orders
                    </DashboardButton>
                    <DashboardButton onClick={() => navigate("/completed-orders", { state: { seller } })}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ marginBottom: "10px" }} />
                        Completed Orders
                    </DashboardButton>
                </DashboardGrid>
            </Section>

            <Footer>
                <FooterButton onClick={() => navigate("/shome")} aria-label="Back to Home">
                    <FontAwesomeIcon icon={faHome} />
                </FooterButton>
                <FooterButton onClick={handleLogout} aria-label="Logout">
                    <FontAwesomeIcon icon={faSignOutAlt} />
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
    font-family: 'Quicksand', 'Arial', sans-serif; /* Fallback for debugging */
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
    font-family: 'Roboto', 'Arial', sans-serif; /* Fallback for debugging */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
    flex: 1; /* Center the title */
`;

const LogoutButton = styled.button`
    background-color: #e74c3c; /* Red for logout */
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
    max-width: 1200px; /* Consistent max-width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow and push footer to bottom */
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Fallback for debugging */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
    text-align: center;
`;

const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns for desktop */
    gap: 15px;
    width: 100%;
    padding: 0 15px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
`;

const DashboardButton = styled.button`
    background-color: #3498db; /* Consistent color scheme */
    color: white;
    padding: 20px; /* Larger padding for prominence */
    border: none;
    cursor: pointer;
    border-radius: 15px; /* Consistent radius */
    font-size: 1.2rem;
    font-family: 'Roboto', 'Arial', sans-serif; /* Fallback for debugging */
    font-weight: 600;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */

    &:hover {
        background-color: #2980b9; /* Consistent hover color */
        transform: translateY(-3px); /* Consistent hover effect */
    }

    svg {
        font-size: 2rem; /* Larger icons for dashboard */
        margin-bottom: 10px;
    }
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

export default SHome;