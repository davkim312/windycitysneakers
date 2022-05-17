import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';


const Cart = ({ cart, handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart }) => {

    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant='subtitle1'>Shopping cart is currently empty
            <Link to='/' className={classes.link}>Start adding to the cart!</Link>
        </Typography>
    );

    if(!cart.line_items) return 'Loading';
 
    const FullCart = () => (
        <div>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQuantity={handleUpdateCartQuantity} onRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant='h4'>Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                    <div>
                        <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={handleEmptyCart}>Empty Cart</Button>
                        <Button component={Link} to='/checkout' className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary'>Checkout</Button>
                    </div>
            </div>
        </div>
    );

    return (
        // 'Container' acts like a 'div' but with more padding and spacing
        // 'classes.toobar' pushes content more down so it appears under navigation bar
        <Container> 
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant='h3' gutterBottom>Shopping Cart</Typography> 
            { !cart.line_items.length ? EmptyCart() : FullCart() }
        </Container>
    );
};

export default Cart;