import { AccordionFaqs } from "./components/AccordionFaqs";

export default function Page() {
  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-background">
      <h2 className="mb-8 text-3xl">Preguntas frecuentes (FAQs)</h2>

      <div className="mb-5">
        <p>
          MoneyMate es una plataforma diseñada para simplificar la gestión de tu
          negocio. Con nuestras herramientas, puedes administrar empresas,
          contactos, cotizaciones, pedidos y eventos de manera eficiente y
          centralizada.
        </p>
      </div>

      <div className="mb-5">
        <p>
          Nuestro objetivo es brindarte una experiencia fluida y optimizada,
          permitiéndote enfocarte en el crecimiento de tu empresa sin
          preocuparte por la gestión operativa.
        </p>
      </div>

      <div className="mb-5">
        <p>
          Si tienes dudas sobre cómo utilizar alguna funcionalidad de MoneyMate,
          aquí encontrarás respuestas a las preguntas más comunes. Si no
          encuentras lo que buscas, no dudes en contactar a nuestro equipo de
          soporte.
        </p>
      </div>

      <AccordionFaqs />

      <div className="mb-5">
        <p>
          ¿Necesitas ayuda adicional? Si no encuentras la respuesta a tu
          pregunta, contáctanos a través de nuestro correo de soporte a{" "}
          <a href="mailto:soporte@moneymate.com" className="text-blue-500">
            soporte@moneymate.com
          </a>{" "}
          o accede a nuestro chat en vivo dentro de la plataforma. Estamos aquí
          para ayudarte.
        </p>
      </div>
    </div>
  );
}
