import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getcompletedordersRoute } from "../utils/APIRoutes";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle, faHome, faSpinner, faClock } from '@fortawesome/free-solid-svg-icons';
import { getcurrentordersRoute } from "../utils/APIRoutes";// Update with your actual API route

function CurrentOrders() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const seller = state?.seller;
    const [currentOrders, setCurrentOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (seller?.username) {
            fetchCurrentOrders(currentPage);
        }
    }, [seller, currentPage]);

    const fetchCurrentOrders = async (page) => {
        if (!seller?.username) {
            toast.error("Seller username is missing");
            return;
        }

        if (!hasMoreOrders || loading) return;

        setLoading(true);
        try {
            const res = await axios.get(getcurrentordersRoute(seller.username, page, 10));
            if (res.data.orders.length > 0) {
                setCurrentOrders(prevOrders => {
                    const combinedOrders = [...prevOrders, ...res.data.orders];
                    return combinedOrders.filter((order, index, self) =>
                        index === self.findIndex(o => o._id === order._id)
                    );
                });
            } else {
                setHasMoreOrders(false);
            }
        } catch (err) {
            toast.error("Error fetching current orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
                hasMoreOrders &&
                !loading
            ) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMoreOrders, loading]);

    return (
        <Container>
            <Header>
                <LogoContainer>
                    <img src={Logo} alt="Logo" style={{ height: "50px", width: "auto" }} />
                </LogoContainer>
                <Title>Current Orders</Title>
                <BackButton onClick={() => navigate(-1)} aria-label="Back">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </BackButton>
            </Header>

            <Section>
                {currentOrders.length > 0 ? (
                    <OrdersGrid>
                        {currentOrders.map(order => (
                            <OrderCard key={order._id}>
                                <OrderDetail>
                                    <strong>Order ID:</strong> {order._id}
                                </OrderDetail>
                                <OrderDetail>
                                    <strong>Product:</strong>{" "}
                                    {order.products.length > 0 ? order.products[0].productName : "No Product"}
                                </OrderDetail>
                                <OrderDetail>
                                    <strong>Cost:</strong> ₹{order.totalCost.toFixed(2)}
                                </OrderDetail>
                                <OrderStatus>
                                    <FontAwesomeIcon icon={faClock} style={{ color: "#f1c40f", marginRight: "5px" }} />
                                    In Progress
                                </OrderStatus>
                            </OrderCard>
                        ))}
                    </OrdersGrid>
                ) : (
                    <NoOrdersMessage>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                        No current orders found.
                    </NoOrdersMessage>
                )}
                {loading && (
                    <LoadingMessage>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                        Loading more orders...
                    </LoadingMessage>
                )}
            </Section>

            <Footer>
                <FooterButton onClick={() => navigate("/shome")} aria-label="Back to Dashboard">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </FooterButton>
            </Footer>

            <ToastContainer />
        </Container>
    );
}

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
    max-width: 1200px; /* Consistent max-width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1; /* Allows section to grow */
`;

const OrdersGrid = styled.div`
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

const OrderCard = styled.div`
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

const OrderDetail = styled.p`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    margin: 0;

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 600;
    }
`;

const OrderStatus = styled.p`
    font-size: 0.9rem;
    color: #2ecc71; /* Green for delivered status */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    margin: 0;
    display: flex;
    align-items: center;
`;

const NoOrdersMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.4rem;
    color: #95a5a6; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
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
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
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

export default CurrentOrders;