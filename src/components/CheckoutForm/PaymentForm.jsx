import React from 'react';
import Review from './Review';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY); // we're gonna use our own public key here

const PaymentForm = ({ checkoutToken, shippingData, backStep, onCaptureCheckout, nextStep, timeout }) => {

    const handleSubmit = async (event, elements, stripe) => {
        
        event.preventDefault(); // <- this makes sure the page does not refresh when pressing the button

        if(!stripe || !elements) return; // error handler - if no stripe or elements, then we go outside the function
        // stripe can not do anything if stripe or element do not exist

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
        // this creates a payment method

        if (error) {
            console.log(error);
        } else {
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: { 
                    firstname: shippingData.firstName, 
                    lastName: shippingData.lastName, 
                    email: shippingData.email
                }, // contains all the customer's data (full name, email) from the shipping information given earlier
                shipping: {
                    name: 'Primary',
                    street: shippingData.address1, // this data coming from the file 'AddressForm.jsx'
                    town_city: shippingData.city,
                    county_state: shippingData.shippingSubdivision,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.shippingCountry 
                },
                fulfillment: { shipping_method: shippingData.shippingOption },
                payment: {
                    gateway: 'stripe',
                    stripe: { payment_method_id: paymentMethod.id }
                },
                // we have to call our commerce API to use this huge object, thus, need to create a function in 'App.js'
            }
        
            onCaptureCheckout(checkoutToken.id, orderData);

            timeout();
        
            nextStep();

        }
    }
  
    return (
        
        <React.Fragment>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant='h6' gutterBottom style={{ margin: '30px 0' }}>Payment Method</Typography>
            {/* everything below the 'stripe' will provide for us */}
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement />
                            <br /> 
                            <br />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant='outlined' onClick={backStep}>Back</Button>
                                <Button 
                                    type='submit' 
                                    variant='contained' // button 'contained' will the button with the wanted color 
                                    disabled={!stripe} 
                                    color='primary'>Pay Now { checkoutToken.live.subtotal.formatted_with_symbol }
                                </Button> 
                                {/* button won't submit if has no access to stripe */}
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </React.Fragment>
    )
};

export default PaymentForm;