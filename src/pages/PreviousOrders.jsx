import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPreviousOrders } from "../utils/APIRoutes";
import styled from "styled-components";
import Logo from "../assets/logoo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner, faBoxOpen, faShoppingBag, faDollarSign, faTruck, faIdBadge, faHome, faCircle } from '@fortawesome/free-solid-svg-icons';

const PreviousOrders = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state;
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(getPreviousOrders(username));
                setOrders(response.data.orders || []);
            } catch (error) {
                console.error("Error fetching previous orders:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchOrders();
        }
    }, [username]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <img src={Logo} alt="Logo" />
                        <h2>Previous Orders</h2>
                    </LogoContainer>
                    <BackButton onClick={() => navigate(-1)} aria-label="Back">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>
            <Content>
                {isLoading ? (
                    <Loading>
                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: "1.5rem", color: "#3498db", marginRight: "10px" }} />
                        Loading orders...
                    </Loading>
                ) : orders.length === 0 ? (
                    <NoOrders>
                        <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "1.5rem", color: "#95a5a6", marginRight: "10px" }} />
                        No previous orders found!
                    </NoOrders>
                ) : (
                    <OrdersList>
                        {orders.map((order) => (
                            <OrderCard key={order._id}>
                                <ImageContainer>
                                    <img src={order.products[0]?.image || "https://picsum.photos/200"} alt="Product" />
                                </ImageContainer>
                                <OrderDetails>
                                    <Section>
                                        <SectionTitle>
                                            <FontAwesomeIcon icon={faShoppingBag} style={{ marginRight: "8px" }} />
                                            Products:
                                        </SectionTitle>
                                        <ProductList>
                                            {order.products.length > 0 ? (
                                                order.products.map((product) => (
                                                    <ProductItem key={product.productId}>
                                                        <FontAwesomeIcon icon={faCircle} style={{ fontSize: "0.5rem", color: "#3498db", marginRight: "8px" }} />
                                                        {product.productName}
                                                    </ProductItem>
                                                ))
                                            ) : (
                                                <NoProducts>No products found</NoProducts>
                                            )}
                                        </ProductList>
                                    </Section>
                                    <Section>
                                        <SectionTitle>
                                            <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: "8px" }} />
                                            Total Cost:
                                        </SectionTitle>
                                        <Text>₹{order.totalCost}</Text>
                                    </Section>
                                    <Section>
                                        <SectionTitle>
                                            <FontAwesomeIcon icon={faTruck} style={{ marginRight: "8px" }} />
                                            Status:
                                        </SectionTitle>
                                        <OrderStatus status={order.status}>{order.status}</OrderStatus>
                                    </Section>
                                    <Section>
                                        <SectionTitle>
                                            <FontAwesomeIcon icon={faIdBadge} style={{ marginRight: "8px" }} />
                                            Order ID:
                                        </SectionTitle>
                                        <Text>{order._id}</Text>
                                    </Section>
                                </OrderDetails>
                            </OrderCard>
                        ))}
                    </OrdersList>
                )}
            </Content>
            <Footer>
                <FooterButton onClick={() => navigate("/home")} aria-label="Back to Home">
                    <FontAwesomeIcon icon={faHome} />
                </FooterButton>
            </Footer>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    height: 100vh; /* Ensure full viewport height */
    background-color: #f0f4f8;
    display: flex;
    flex-direction: column;
    font-family: 'Quicksand', 'Arial', sans-serif;
`;

const Header = styled.header`
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

    h2 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2e4a6d;
        font-family: 'Roboto', 'Arial', sans-serif;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin: 0;
    }
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

const Content = styled.div`
    flex-grow: 1; /* Allows it to take available space */
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto; /* Make it scrollable */
`;

const Loading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.2rem;
    color: #7f8c8d;
    font-weight: 600;
    gap: 10px;
`;

const NoOrders = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    font-size: 1.4rem;
    color: #95a5a6;
    font-weight: 600;
    text-align: center;
    gap: 10px;
`;

const OrdersList = styled.div`
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 15px;
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
`;


const OrderCard = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 15px;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-3px);
    }
`;

const ImageContainer = styled.div`
    flex: 0 0 auto;

    img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        border: 2px solid #e8ecef;
    }
`;

const OrderDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
     overflow-y: auto; /* Enable scrolling on the container */
    scroll-behavior: smooth; /* Smooth scrolling */
`;

const SectionTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: #2e4a6d;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Text = styled.div`
    font-size: 0.95rem;
    color: #7f8c8d;
    font-weight: 600;
`;

const ProductList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const ProductItem = styled.div`
    font-size: 0.9rem;
    color: #34495e;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const NoProducts = styled.div`
    font-size: 0.9rem;
    color: #e74c3c;
    font-weight: 600;
`;

const OrderStatus = styled.div`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ status }) => (status === "Delivered" ? "#2ecc71" : "#7f8c8d")};
`;

const Footer = styled.footer`
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    position: sticky;
    bottom: 0;
    z-index: 10;
    border-top: 1px solid #e8ecef;
`;

const FooterButton = styled.button`
    background-color: #3498db;
    color: white;
    padding: 12px;
    border: none;
    cursor: pointer;
    border-radius: 12px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #2980b9;
        transform: scale(1.15);
    }

    svg {
        font-size: 1.5rem;
    }
`;

export default PreviousOrders;