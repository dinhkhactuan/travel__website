import axios from 'axios'
import Stripe from 'stripe'
import { showAlert } from './alert'

const stripe = Stripe(`${process.env.STRIPE_PUBLICKEY}`)

// var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
export const booking = async tourId => {
    try {
        const session = await axios(`http://localhost:3000/booking/check-sessions/${tourId}`)
        console.log(session)
        await stripe.redirectToCheckout({
            sessionId: session.data.sessions.id
        })
    } catch (err) {
        console.log(err)
        showAlert('error', 'lỗi');
    }
}