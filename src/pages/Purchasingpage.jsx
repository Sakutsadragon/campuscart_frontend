import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Logo from "../assets/logoo.png"; // Ensure this path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowLeft, faTag, faPhone, faCreditCard, faHome, faBox, faCheck, faBoxOpen, faHistory, faTicketAlt, faTruck } from '@fortawesome/free-solid-svg-icons';

function PurchasingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, quantity, studentUsername } = location.state || {};

    const [couponCode, setCouponCode] = useState("");
    const [locationDetails, setLocationDetails] = useState("");
    const [modeOfPayment, setModeOfPayment] = useState("Cash on Delivery");
    const [studentPhNo, setStudentPhNo] = useState("");

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await axios.get("https://ipapi.co/json/");
                setLocationDetails(res.data.city + ", " + res.data.country_name);
            } catch (err) {
                console.error("Error fetching location:", err);
            }
        };
        fetchLocation();
    }, []);

    const handleOrderPlacement = async () => {
        try {
            const orderData = {
                studentUsername,
                products: [{ productId: product._id, productName: product.productName, quantity, price: product.cost }],
                couponCode,
                location: locationDetails,
                modeofpayment: modeOfPayment,
                studentphno: studentPhNo,
            };

            const response = await axios.post("http://localhost:7000/api/order/placeorder", orderData);

            if (modeOfPayment === "Online Payment") {
                window.location.href = `https://checkout.stripe.com/pay/${response.data.sessionId}`;
            } else {
                alert("Order placed successfully!");
                navigate("/order-success", { state: { order: response.data.order } });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order.");
        }
    };

    if (!product || !studentUsername) {
        return (
            <ErrorMessage>
                <FontAwesomeIcon icon={faBox} style={{ fontSize: "1.5rem", color: "#dc2626", marginRight: "10px" }} />
                Invalid order details.
            </ErrorMessage>
        );
    }

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <LogoContainer>
                        <LogoImg src={Logo} alt="Logo" />
                        <WelcomeMessage>Checkout</WelcomeMessage>
                    </LogoContainer>
                    <CartButton onClick={() => navigate("/cart", { state: studentUsername })} aria-label="Go to Cart">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </CartButton>
                    <BackButton onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </BackButton>
                </HeaderContent>
            </Header>

            <Section>
                <CheckoutCard>
                    <CheckoutTitle>Order Summary</CheckoutTitle>
                    <OrderDetail><strong>Product:</strong> {product.productName}</OrderDetail>
                    <OrderDetail><strong>Quantity:</strong> {quantity}</OrderDetail>
                    <OrderDetail><strong>Total Price:</strong> ₹{product.cost * quantity}</OrderDetail>
                    <OrderDetail><strong>Location:</strong> {locationDetails || "Fetching..."}</OrderDetail>

                    <FormContainer>
                        <InputGroup>
                            <InputLabel>
                                <FontAwesomeIcon icon={faTag} style={{ marginRight: "8px" }} />
                                Coupon Code
                            </InputLabel>
                            <InputWrapper>
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                            </InputWrapper>
                        </InputGroup>

                        <InputGroup>
                            <InputLabel>
                                <FontAwesomeIcon icon={faPhone} style={{ marginRight: "8px" }} />
                                Phone Number
                            </InputLabel>
                            <InputWrapper>
                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={studentPhNo}
                                    onChange={(e) => setStudentPhNo(e.target.value)}
                                />
                            </InputWrapper>
                        </InputGroup>

                        <InputGroup>
                            <InputLabel>
                                <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: "8px" }} />
                                Payment Method
                            </InputLabel>
                            <SelectWrapper>
                                <select
                                    value={modeOfPayment}
                                    onChange={(e) => setModeOfPayment(e.target.value)}
                                >
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Online Payment">Online Payment</option>
                                </select>
                            </SelectWrapper>
                        </InputGroup>

                        <PlaceOrderButton onClick={handleOrderPlacement}>
                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: "8px" }} />
                            Place Order
                        </PlaceOrderButton>
                    </FormContainer>
                </CheckoutCard>
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

const CheckoutCard = styled.div`
    background-color: #ffffff; /* White background */
    border-radius: 15px; /* Consistent radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Consistent shadow */
    padding: 30px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const CheckoutTitle = styled.div`
    font-size: 1.75rem;
    font-weight: 700;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Roboto', 'Arial', sans-serif; /* Consistent font with fallback */
    text-align: center;
    text-transform: uppercase;
`;

const OrderDetail = styled.div`
    font-size: 0.9rem;
    color: #7f8c8d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    text-align: center;

    strong {
        color: #2e4a6d; /* Darker color for labels */
        font-weight: 600;
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const InputLabel = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: #2e4a6d; /* Consistent color scheme */
    font-family: 'Quicksand', 'Arial', sans-serif; /* Consistent font */
    display: flex;
    align-items: center;
`;

const InputWrapper = styled.div`
    padding: 12px 15px;
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    background-color: #f9f9f9; /* Light gray background */
    transition: border-color 0.3s ease;

    input {
        width: 100%;
        border: none;
        background: transparent;
        outline: none;
        font-family: 'Quicksand', 'Arial', sans-serif;
        font-size: 1rem;
        color: #2e4a6d;
    }

    &:focus-within {
        border-color: #2980b9; /* Darker blue on focus */
    }

    input::placeholder {
        color: #95a5a6; /* Consistent placeholder color */
    }
`;

const SelectWrapper = styled.div`
    padding: 12px 15px;
    border: 1px solid #3498db; /* Consistent blue border */
    border-radius: 10px; /* Consistent radius */
    background-color: #f9f9f9; /* Light gray background */
    position: relative;
    transition: border-color 0.3s ease;

    select {
        width: 100%;
        border: none;
        background: transparent;
        outline: none;
        font-family: 'Quicksand', 'Arial', sans-serif;
        font-size: 1rem;
        color: #2e4a6d;
        cursor: pointer;
        appearance: none;
        padding-right: 20px; /* Space for custom arrow */
    }

    &:focus-within {
        border-color: #2980b9; /* Darker blue on focus */
    }

    &::after {
        content: '▼'; /* Custom arrow */
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #3498db;
        font-size: 0.8rem;
        pointer-events: none;
    }
`;

const PlaceOrderButton = styled.div`
    background-color: #3498db; /* Consistent blue button */
    color: white;
    padding: 12px 20px;
    border-radius: 10px; /* Consistent radius */
    font-size: 1.1rem;
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
    text-align: center;
`;

export default PurchasingPage;