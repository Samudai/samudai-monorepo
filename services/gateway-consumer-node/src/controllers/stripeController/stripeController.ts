import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

export class stripeController {
    webhook = async (req: Request, res: Response, next: NextFunction) => {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err}`);
            return;
        }

        if (event.type === 'checkout.session.completed') {
            try {
                const checkoutCompleted = event.data.object;
                const client_ref_id = checkoutCompleted.client_reference_id;

                const x = client_ref_id.split('_');
                const dao_id = x[0];
                const member_id = x[1];

                const customer = checkoutCompleted.customer_details;

                console.log(customer);

                const res1 = await axios.post(`${process.env.SERVICE_DAO}/stripe/customer/add`, {
                    customer: {
                        customer_id: checkoutCompleted.customer,
                        name: customer.name,
                        email: customer.email,
                        address: customer.address,
                        phone: customer.phone,
                    },
                });

                const subscription = await stripe.subscriptions.retrieve(checkoutCompleted.subscription);

                const result = await axios.post(`${process.env.SERVICE_DAO}/stripe/subscription/add`, {
                    subscription: {
                        dao_id,
                        member_id,
                        subscription_id: checkoutCompleted.subscription,
                        customer_id: checkoutCompleted.customer,
                        invoice_ids: [checkoutCompleted.invoice],
                        subscription_status: subscription.status,
                        quantity: subscription.quantity,
                        plan: {
                            plan_id: subscription.plan.id,
                            active: subscription.plan.active,
                            currency: subscription.plan.currency,
                            interval: subscription.plan.interval,
                            interval_count: subscription.plan.interval_count,
                        },
                    },
                });
            } catch (err) {
                console.log(err);
            }
        }
        if (event.type === 'customer.subscription.updated') {
            const updatedSubscription = event.data.object;

            const result = await axios.post(`${process.env.SERVICE_DAO}/stripe/subscription/update`, {
                subscription: {
                    subscription_id: updatedSubscription.id,
                    invoice_ids: [updatedSubscription.latest_invoice],
                    subscription_status: updatedSubscription.status,
                    quantity: updatedSubscription.quantity,
                    // current_period_end,
                    // current_period_start,
                    plan: {
                        plan_id: updatedSubscription.plan.id,
                        active: updatedSubscription.plan.active,
                        currency: updatedSubscription.plan.currency,
                        interval: updatedSubscription.plan.interval,
                        interval_count: updatedSubscription.plan.interval_count,
                    },
                },
            });
        }
        if (event.type === 'customer.updated') {
            const updatedCustomer = event.data.object;

            const res1 = await axios.post(`${process.env.SERVICE_DAO}/stripe/customer/update`, {
                customer: {
                    customer_id: updatedCustomer.id,
                    name: updatedCustomer.name,
                    email: updatedCustomer.email,
                    address: updatedCustomer.address,
                    phone: updatedCustomer.phone,
                },
            });
        }

        res.send();
    };

    getPaymentLinkForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/stripe/getcustomerid/${daoId}`);

            let session;
            if (result && result.data) {
                console.log(result.data.customerId);
                const configuration = await stripe.billingPortal.configurations.create({
                    business_profile: {
                        headline: 'Samudai partners with Stripe for simplified billing.',
                    },
                    features: {
                        customer_update: {
                            allowed_updates: ['email', 'name', 'address', 'phone'],
                            enabled: true,
                        },
                        invoice_history: {
                            enabled: true,
                        },
                        payment_method_update: {
                            enabled: true,
                        },
                        subscription_pause: {
                            enabled: false,
                        },
                        subscription_cancel: {
                            cancellation_reason: {
                                enabled: true,
                                options: ['too_expensive', 'missing_features', 'switched_service', 'unused', 'other'],
                            },
                            enabled: true,
                            mode: 'immediately',
                        },
                        subscription_update: {
                            default_allowed_updates: ['quantity', 'price'],
                            enabled: true,
                            products: [
                                {
                                    prices: [process.env.STRIPE_MONTHLY_PRICE_ID, process.env.STRIPE_YEARLY_PRICE_ID],
                                    product: process.env.STRIPE_PRODUCT_ID,
                                },
                            ],
                        },
                    },
                });

                session = await stripe.billingPortal.sessions.create({
                    customer: result.data.customerId,
                    return_url: process.env.SAMUDAI_URL + '/billing',
                    configuration: configuration.id,
                });
            }

            new FetchSuccess(res, 'BILLING SESSION', session);
        } catch (err: any) {
            console.log(err);

            next(new ErrorException(err, 'Error while Creating Billing Session'));
        }
    };

    getFirstTimeCheckout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoID = req.body.daoId;
            const memberID = req.body.memberId;
            const billing = req.body.billing;
            const customer_email = req.body.customerEmail;
            const price_tier = req.body.priceTier;

            const monthly = process.env.STRIPE_MONTHLY_PRICE_ID;
            const yearly = process.env.STRIPE_YEARLY_PRICE_ID;

            let quantity = 0;
            if (price_tier === 'small') {
                quantity = 1;
            } else if (price_tier === 'medium') {
                quantity = 21;
            } else {
                quantity = 51;
            }

            const result = await axios.get(`${process.env.SERVICE_DAO}/stripe/get/subscriptioncount/${daoID}`);
            const subscriptionCount = result.data.count;

            let session;
            if (subscriptionCount === 0) {
                const sixMonthsLaterTimestamp = Math.floor(Date.now() / 1000) + 6 * 30 * 24 * 60 * 60;
                session = await stripe.checkout.sessions.create({
                    client_reference_id: `${daoID}_${memberID}`,
                    success_url: process.env.SAMUDAI_URL + '/billing',
                    cancel_url: process.env.SAMUDAI_URL + '/billing',
                    customer_email,
                    line_items: [
                        {
                            quantity,
                            adjustable_quantity: {
                                enabled: true,
                            },
                            price: billing === 'monthly' ? monthly : yearly,
                        },
                    ],
                    mode: 'subscription',
                    subscription_data: {
                        trial_end: sixMonthsLaterTimestamp,
                    },
                });
            } else {
                session = await stripe.checkout.sessions.create({
                    client_reference_id: `${daoID}_${memberID}`,
                    success_url: process.env.SAMUDAI_URL + '/billing',
                    cancel_url: process.env.SAMUDAI_URL + '/billing',
                    customer_email,
                    line_items: [
                        {
                            quantity,
                            adjustable_quantity: {
                                enabled: true,
                            },
                            price: billing === 'monthly' ? monthly : yearly,
                        },
                    ],
                    mode: 'subscription',
                });
            }

            new FetchSuccess(res, 'FIRST TIME CHECKOUT', session);
        } catch (err: any) {
            console.log(err);
            next(new ErrorException(err, 'Error while Creating First Time Checkout'));
        }
    };

    getUsedLimitsForDao = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;

            const userCount = await axios.get(`${process.env.SERVICE_DAO}/member/licensed/getcount/${daoId}`);

            const projectCount = await axios.get(`${process.env.SERVICE_PROJECT}/project/get/projectcount/${daoId}`);

            const formCount = await axios.get(`${process.env.SERVICE_FORMS}/deal/questions/count/${daoId}`);

            const discussionCount = await axios.get(`${process.env.SERVICE_DISCUSSION}/discussion/countbydao/${daoId}`);

            const result = {
                userCount: userCount.data.count,
                projectCount: projectCount.data.count,
                formCount: formCount.data.count,
                discussionCount: discussionCount.data.count,
            };

            new FetchSuccess(res, 'USED LIMITS COUNTS', result);
        } catch (err: any) {
            console.log(err);
            next(new ErrorException(err, 'Error while fetching Uesd Limits Count'));
        }
    };
}
