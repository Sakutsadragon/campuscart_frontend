import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { trackOrdersRoute, updateOrderStatusRoute } from "../utils/APIRoutes";

const TrackOrder = () => {
    const location = useLocation();
    const username = location.state;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(trackOrdersRoute(username));
                const filteredOrders = response.data.orders?.filter(
                    (order) => order.status !== "Received" && order.status !== "Delivered"
                ) || [];
                setOrders(filteredOrders);
            } catch (error) {
                console.error("Error fetching tracking orders:", error);
                setOrders([]);
            }
        };

        fetchOrders();
    }, [username]);

    const handleOrderReceived = async (orderId) => {
        try {
            await axios.put(updateOrderStatusRoute(orderId), { status: "Delivered" });
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };
    const handleOrderCancelled = async (orderId)=>{
        try {
            await axios.put(updateOrderStatusRoute(orderId), { status: "Cancelled" });
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <Container>
            <Header>
                <h2>Track Your Orders</h2>
            </Header>
            {orders.length === 0 ? (
                <NoOrders>
                    <p>
                        <i className="fas fa-box-open"></i> No pending orders found!
                    </p>
                </NoOrders>
            ) : (
                <OrdersList>
                    {orders.map((order) => (
                        <OrderCard key={order._id}>
                            <ImageContainer>
                                <img src={order.products[0]?.image || "https://picsum.photos/200"} alt="Product" />
                            </ImageContainer>
                            <OrderContent>
                                <OrderSection>
                                    <SectionTitle>
                                        <i className="fas fa-shopping-bag"></i> Products:
                                    </SectionTitle>
                                    <ProductList>
                                        {order.products.length > 0 ? (
                                            order.products.map((product) => (
                                                <ProductItem key={product.productId}>
                                                    <i className="fas fa-circle"></i> {product.productName}
                                                </ProductItem>
                                            ))
                                        ) : (
                                            <NoProducts>No products found</NoProducts>
                                        )}
                                    </ProductList>
                                </OrderSection>
                                <OrderSection>
                                    <SectionTitle>
                                        <i className="fas fa-dollar-sign"></i> Total Cost:
                                    </SectionTitle>
                                    <SectionContent>${order.totalCost}</SectionContent>
                                </OrderSection>
                                <OrderSection>
                                    <SectionTitle>
                                        <i className="fas fa-truck"></i> Status:
                                    </SectionTitle>
                                    <Status status={order.status}>{order.status}</Status>
                                </OrderSection>
                                <OrderSection>
                                    <SectionTitle>
                                        <i className="fas fa-map-marker-alt"></i> Location:
                                    </SectionTitle>
                                    <SectionContent>{order.location}</SectionContent>
                                </OrderSection>
                                <ButtonContainer>
                                    <Button onClick={() => handleOrderCancelled(order._id)}>
                                    <i className="fas fa-check"></i> Order Cancelled
                                    </Button>
                                    <Button onClick={() => handleOrderReceived(order._id)}>
                                        <i className="fas fa-check"></i> Order Received
                                    </Button>
                                </ButtonContainer>
                            </OrderContent>
                        </OrderCard>
                    ))}
                </OrdersList>
            )}
        </Container>
    );
};

// Styled Components

const Container = styled.div`
    padding: 30px;
    font-family: "Quicksand", sans-serif;
    background-color: #f0f4f8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.div`
    margin-bottom: 25px;
    text-align: center;

    h2 {
        font-size: 2rem;
        font-weight: 700;
        color: #2e4a6d;
        font-family: "Roboto", sans-serif;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
`;

const NoOrders = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;

    p {
        font-size: 1.4rem;
        color: #95a5a6;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;

const OrdersList = styled.div`
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 100vh;
    margin-bottom:20px;
    overflow-y: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        width: 0px;
        display: none;
    }
`;

const OrderCard = styled.div`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 15px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 15px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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

const OrderContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const OrderSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const SectionTitle = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: #2e4a6d;
    font-family: "Roboto", sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SectionContent = styled.div`
    font-size: 0.95rem;
    color: #7f8c8d;
    font-weight: 600;
`;

const ProductList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 20px;
`;

const ProductItem = styled.div`
    font-size: 0.9rem;
    color: #34495e;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
        font-size: 0.5rem;
        color: #3498db;
    }
`;

const NoProducts = styled.div`
    font-size: 0.9rem;
    color: #e74c3c;
    font-weight: 600;
`;

const Status = styled.div`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ status }) => (status === "Shipped" ? "#e67e22" : status === "Out for Delivery" ? "#3498db" : "#7f8c8d")};
    background-color: ${({ status }) =>
        status === "Shipped" ? "#f9e4bc" : status === "Out for Delivery" ? "#d6eaf8" : "#e8ecef"};
    padding: 4px 8px;
    border-radius: 8px;
    display: inline-block;
`;

const ButtonContainer = styled.div`
    display: flex; /* Makes the container a flexbox */
    gap: 20px; /* Adds spacing between flex items (replace 20px with your desired spacing) */
    margin-top: 10px; /* Adds a top margin */

`;

const Button = styled.div`
    background-color: #ff6f61;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e65b50;
    }
`;

export default TrackOrder;
