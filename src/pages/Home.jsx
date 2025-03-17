import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import axios from "axios";
import { getsellerscats } from "../utils/APIRoutes";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner, faFilter, faBoxOpen, faHistory, faTicketAlt, faTruck, faEye, faEnvelope, faTags, faStoreSlash } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    // Fetch Student Data from Local Storage
    useEffect(() => {
        const storedStudent = localStorage.getItem("student-user");
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch Sellers and Their Categories
    useEffect(() => {
        setIsLoading(true); // Set loading to true before fetching
        axios
            .get(getsellerscats)
            .then((response) => {
                setSellers(response.data || []); // Ensure sellers is an array
                setIsLoading(false); // Set loading to false after fetching
            })
            .catch((error) => {
                console.error("Error fetching sellers:", error);
                setIsLoading(false); // Set loading to false even on error
            });
    }, []);

    if (!student) return null;

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <img src={Logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </LogoContainer>
                <WelcomeMessage>Welcome, {student.username}</WelcomeMessage>
                <CartButton onClick={() => navigate("/cart",{ state: student.username })} aria-label="Go to Cart">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </CartButton>
            </Header>

            <Section>
                <SectionHeader>
                    <SectionTitle>Available Sellers</SectionTitle>
                    <FilterButton aria-label="Filter Sellers">
                        <FontAwesomeIcon icon={faFilter} />
                    </FilterButton>
                </SectionHeader>
                {isLoading ? (
                    <Loading>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db" }} />
                        <span>Loading sellers...</span>
                    </Loading>
                ) : sellers.length === 0 ? (
                    <NoSellers>
                        <FontAwesomeIcon icon={faStoreSlash} style={{ fontSize: "1.5rem", color: "#95a5a6" }} />
                        <span>No sellers available at the moment.</span>
                    </NoSellers>
                ) : (
                    <SellersGrid>
                        {sellers.map((seller) => (
                            <SellerCard key={seller.username}>
                                <SellerImage src={seller.image || "https://picsum.photos/500/500"} alt={`Seller ${seller.username}`} />
                                <SellerInfo>
                                    <SellerName>{seller.username}</SellerName>
                                    <SellerDetail>
                                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "5px", color: "#3498db" }} />
                                        {seller.email}
                                    </SellerDetail>
                                    <SellerDetail>
                                        <FontAwesomeIcon icon={faTags} style={{ marginRight: "5px", color: "#3498db" }} />
                                        {seller.categories.join(", ")}
                                    </SellerDetail>
                                </SellerInfo>
                                <ViewProductsButton onClick={() => navigate(`/sellerproducts`, { state: seller.username })}>
                                    <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px" }} />
                                    View
                                </ViewProductsButton>
                            </SellerCard>
                        ))}
                    </SellersGrid>
                )}
            </Section>

            <Footer>
                <FooterButton onClick={() => navigate("/available-products")} aria-label="View All Products">
                    <FontAwesomeIcon icon={faBoxOpen} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/previous-orders", { state: student.username })} aria-label="Previous Orders">
                    <FontAwesomeIcon icon={faHistory} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/scoupons", { state: student.username })} aria-label="Available Coupons">
                    <FontAwesomeIcon icon={faTicketAlt} />
                </FooterButton>
                <FooterButton onClick={() => navigate("/track-order", { state: student.username })} aria-label="Track Order">
                    <FontAwesomeIcon icon={faTruck} />
                </FooterButton>
            </Footer>

            <ToastContainer />
        </Container>
    );
}

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background-color: #f0f4f8; /* Light pastel background matching PreviousOrders */
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
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
    max-width: 1200px; /* Consistent max-width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow and push footer to bottom */
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0;
    text-align: center;
`;

const FilterButton = styled.button`
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
        font-size: 1rem;
    }
`;

const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.2rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', sans-serif; /* Consistent font */
    font-weight: 600;
    gap: 10px;
`;

const NoSellers = styled.div`
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

const SellersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Exactly 3 columns in desktop view */
    gap: 15px;
    width: 100%;
    padding: 0 15px;
   max-height: 100vh; /* Limit height to enable scrolling */
    overflow-y: auto; /* Enable vertical scrolling */
    scroll-behavior: smooth; /* Smooth scrolling */
    
    /* Hide scrollbar */
    &::-webkit-scrollbar {
        width: 0px;
        display: none;
    }
    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
    scrollbar-width: none; /* Hide scrollbar for Firefox */


    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on medium screens */
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr; /* Single column on mobile */
    }
`;

const SellerCard = styled.div`
    background-color: #ffffff; /* Consistent color scheme */
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px; /* Slightly reduced max-width for compactness */
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-3px); /* Subtle lift on hover */
    }
`;

const SellerImage = styled.img`
    width: 100%;
    height: 20vh; /* Slightly reduced height for compactness */
    object-fit: cover;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`;

const SellerInfo = styled.div`
    padding: 8px; /* Reduced padding for compactness */
    text-align: center;
    width: 100%;
`;

const SellerName = styled.h3`
    font-size: 1rem; /* Slightly reduced font size */
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    margin-bottom: 5px;
`;

const SellerDetail = styled.p`
    font-size: 0.8rem; /* Slightly reduced font size */
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', sans-serif; /* Consistent font */
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`;

const ViewProductsButton = styled.button`
    background-color: #2ecc71; /* Consistent color scheme */
    color: white;
    padding: 6px 12px; /* Reduced padding for compactness */
    border: none;
    cursor: pointer;
    border-radius: 10px;
    font-size: 0.85rem; /* Slightly reduced font size */
    font-family: 'Roboto', sans-serif; /* Consistent font */
    margin: 8px 0; /* Reduced margin */
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #27ae60; /* Slightly darker shade for hover */
    }

    svg {
        margin-right: 5px;
    }
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

export default Home;