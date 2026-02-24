import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  return {
    title: dict.meta?.orderConfirmed || "Order Confirmed",
    description: dict.meta?.orderConfirmedDesc || "Your purchase was successful",
  }
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
