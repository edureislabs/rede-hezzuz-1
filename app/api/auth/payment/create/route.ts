import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  const { cash, price } = await req.json();

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
              title: `${cash} Cash - Rede Hezzuz`,
              quantity: 1,
              unit_price: Number(price),
              id: "cash 1000"
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/loja/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/loja/erro`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/loja/pendente`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({
      url: result.init_point,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}