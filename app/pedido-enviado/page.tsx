import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Pedido enviado | Good Cell",
  robots: { index: false },
};

export default function PedidoEnviadoPage() {
  return <OrderConfirmation />;
}