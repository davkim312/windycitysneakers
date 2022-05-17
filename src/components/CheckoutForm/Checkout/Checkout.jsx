import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Divider, Paper, Step, Stepper, StepLabel, Typography, CssBaseline } from '@material-ui/core';
import { Link , useNavigate } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Shipping Address', 'Payment information'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {

    const [activeStep, setActiveStep] = useState(0);

    const [checkoutToken, setCheckoutToken] = useState(null);

    const [shippingData, setShippingData] = useState({});

    const [isFinished, setIsFinished] = useState(false); 

    const classes = useStyles();

    const history = useNavigate();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

                setCheckoutToken(token);
            
            } catch (error) {
                history.push('/');
            }
        }

        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1); // this way we won't mutate the previous state

    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    
    const next = (data) => {
        setShippingData(data);
    
        nextStep();
    };

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 5000);
    }

    let Confirmation = () => order.customer ? ( // if only the customer exist, the below function happens, otherwise the function below will happen
        <React.Fragment>
            <div>
                <Typography variant='h5'>Your order is confirmed! Thank you for shopping with us, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'>Order Number: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant='outlined' type='button'>Back to Homepage</Button>
        </React.Fragment>
    ) : isFinished ? (
        <React.Fragment>
            <div>
                <Typography variant='h5'>Your order is confirmed! Thank you for shopping with us!</Typography>
                <Divider className={classes.divider} />
                <br />
                <Button component={Link} to='/' variant='outlined' type='button'>Back to Homepage</Button>
            </div>
        </React.Fragment>
    ) : (  
        <div className={classes.spinner}>
            <CircularProgress /> {/* this gives the user something to look at while order is processing, instead of blank screen */}
        </div>
    );

    if (error) { // 'error' comes from prop claimed in 'const checkout'
        <React.Fragment>
            <Typography variant='h5'>Error: {error}</Typography>
            <br />
            <Button component={Link} variant='outlined' type='button' to='/'>Back to Homepage</Button>
        </React.Fragment>
    }
    
    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm 
            shippingData={shippingData} 
            checkoutToken={checkoutToken} 
            nextStep={nextStep}
            backStep={backStep} 
            onCaptureCheckout={onCaptureCheckout} 
            timeout={timeout}
        />

    return (
        <React.Fragment>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant='h4' align='center'>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }
                </Paper>
            </main>
        </React.Fragment>
     );
};

export default Checkout;