import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.9.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    console.log(`Stripe webhook received: ${event.type}`)

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function handleCustomerCreated(customer: Stripe.Customer) {
  // Actualizar o crear registro de cliente de facturación
  const { error } = await supabase
    .from('billing_customers')
    .upsert({
      stripe_customer_id: customer.id,
      billing_email: customer.email,
    })

  if (error) {
    console.error('Error updating customer:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  await updateSubscription(subscription)
  await sendNotification(subscription.customer as string, 'subscription_created')
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await updateSubscription(subscription)
  await sendNotification(subscription.customer as string, 'subscription_updated')
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('billing_customers')
    .update({
      subscription_status: 'cancelled',
      subscription_id: null,
      price_id: null,
      cancelled_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', subscription.customer)

  if (error) {
    console.error('Error deleting subscription:', error)
  }

  await sendNotification(subscription.customer as string, 'subscription_cancelled')
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('billing_customers')
    .update({
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0]?.price?.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Actualizar factura
  await supabase
    .from('billing_invoices')
    .upsert({
      stripe_invoice_id: invoice.id,
      customer_id: await getCustomerIdFromStripe(invoice.customer as string),
      amount_due: (invoice.total || 0) / 100,
      amount_paid: (invoice.amount_paid || 0) / 100,
      currency: (invoice.currency || 'eur').toUpperCase(),
      status: 'paid',
      invoice_date: new Date((invoice.created || 0) * 1000).toISOString(),
      paid_date: new Date().toISOString(),
      invoice_pdf_url: invoice.invoice_pdf,
      subtotal: (invoice.subtotal || 0) / 100,
      tax_amount: (invoice.tax || 0) / 100,
    })

  await sendNotification(invoice.customer as string, 'payment_succeeded')
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await supabase
    .from('billing_invoices')
    .update({ 
      status: 'uncollectible',
      amount_paid: 0
    })
    .eq('stripe_invoice_id', invoice.id)

  await sendNotification(invoice.customer as string, 'payment_failed')
}

async function getCustomerIdFromStripe(stripeCustomerId: string) {
  const { data } = await supabase
    .from('billing_customers')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  return data?.id
}

async function sendNotification(stripeCustomerId: string, type: string) {
  // Obtener usuario desde billing_customers
  const { data: customer } = await supabase
    .from('billing_customers')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!customer) return

  const messages = {
    subscription_created: {
      title: '¡Suscripción activada!',
      message: 'Tu suscripción a AsesFy está ahora activa. ¡Bienvenido!'
    },
    subscription_updated: {
      title: 'Suscripción actualizada',
      message: 'Tu suscripción ha sido actualizada correctamente.'
    },
    subscription_cancelled: {
      title: 'Suscripción cancelada',
      message: 'Tu suscripción ha sido cancelada. Puedes reactivarla cuando quieras.'
    },
    payment_succeeded: {
      title: 'Pago procesado',
      message: 'Tu pago ha sido procesado correctamente. ¡Gracias!'
    },
    payment_failed: {
      title: 'Error en el pago',
      message: 'No pudimos procesar tu pago. Por favor, verifica tu método de pago.'
    }
  }

  const notification = messages[type as keyof typeof messages]
  
  if (notification) {
    await supabase
      .from('notifications')
      .insert({
        user_id: customer.user_id,
        title: notification.title,
        message: notification.message,
        type: 'billing',
        priority: type.includes('failed') ? 'high' : 'normal'
      })
  }
}