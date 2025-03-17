import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAvailableCouponsRoute } from "../utils/APIRoutes";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTag, faHome, faSpinner, faBan } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart, faFilter, faBoxOpen, faHistory, faTicketAlt, faTruck, faEye, faEnvelope, faTags, faStoreSlash, faBox } from '@fortawesome/free-solid-svg-icons';

const AvailableCoupons = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state;
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(getAvailableCouponsRoute(username));
                setCoupons(response.data.coupons || []);
            } catch (error) {
                console.error("Error fetching coupons:", error);
                setCoupons([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchCoupons();
        }
    }, [username]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <img src={Logo} alt="Logo" />
                        <Title>Available Coupons</Title>
                    </LogoContainer>
                    <BackButton onClick={() => navigate(-1)} aria-label="Back">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>

            <Section>
                {isLoading ? (
                    <Loading>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                        Loading coupons...
                    </Loading>
                ) : coupons.length === 0 ? (
                    <NoCoupons>
                        <FontAwesomeIcon icon={faBan} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                        No available coupons found.
                    </NoCoupons>
                ) : (
                    <CouponsGrid>
                        {coupons.map(coupon => (
                            <CouponCard key={coupon._id}>
                                <CouponDetail>
                                    <FontAwesomeIcon icon={faTag} style={{ color: "#3498db", marginRight: "8px" }} />
                                    <strong>Code:</strong> {coupon.couponCode}
                                </CouponDetail>
                                <CouponDetail>
                                    <strong>Discount:</strong> {coupon.discountPercentage}% off
                                </CouponDetail>
                                <CouponDetail>
                                    <strong>Max Discount:</strong> ₹{coupon.maxDiscountAmount}
                                </CouponDetail>
                                <CouponDetail>
                                    <strong>Min Order:</strong> ₹{coupon.minOrderValue || "N/A"}
                                </CouponDetail>
                                <CouponDetail>
                                    <strong>Expires:</strong> {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "N/A"}
                                </CouponDetail>
                            </CouponCard>
                        ))}
                    </CouponsGrid>
                )}
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
                           <FooterButton onClick={() => navigate("/previous-orders", { state: username })}>
                               <FontAwesomeIcon icon={faHistory} style={{ marginRight: "8px" }} />
                               Orders
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/scoupons", { state: username })}>
                               <FontAwesomeIcon icon={faTicketAlt} style={{ marginRight: "8px" }} />
                               Coupons
                           </FooterButton>
                           <FooterButton onClick={() => navigate("/track-order", { state: username })}>
                               <FontAwesomeIcon icon={faTruck} style={{ marginRight: "8px" }} />
                               Track
                           </FooterButton>
                       </Footer>
        </Container>
    );
};

// Styled Components (using div only)
const Container = styled.div`
    min-height: 100vh;
    background-color: #f0f4f8; /* Consistent pastel background */
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Enable scrolling on the container */
    scroll-behavior: smooth; /* Smooth scrolling */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font with fallback */
`;

const Header = styled.div`
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 15px 30px;
    position: sticky;
    top: 0;
    z-index: 10;
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

    img {
        height: 50px;
        width: auto;
    }
`;

const Title = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
`;

const BackButton = styled.div`
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

const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.2rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-weight: 600;
    gap: 10px;
`;

const NoCoupons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.4rem;
    color: #95a5a6; /* Consistent color scheme */
    font-weight: 600;
    gap: 10px;
    text-align: center;
`;

const CouponsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns for desktop */
    gap: 15px;
    width: 100%;
    padding: 0 15px;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
`;

const CouponCard = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-3px); /* Consistent hover effect */
    }
`;

const CouponDetail = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 700;
    }
`;

const Footer = styled.div`
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%); /* Consistent gradient */
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    position: sticky;
    bottom: 0;
    z-index: 10;
    border-top: 1px solid #e8ecef; /* Consistent border */
`;

const FooterButton = styled.div`
    background-color: #3498db; /* Consistent color scheme */
    color: white;
    padding: 12px;
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

export default AvailableCoupons;