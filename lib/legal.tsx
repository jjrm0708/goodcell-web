import type { ElementType, ReactNode } from "react";
import {
  Award,
  CheckCircle2,
  Cookie,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { SITE } from "@/lib/site";

export type TipoDocumento = "terminos" | "privacidad" | "cookies" | "garantias";

export type Seccion = { id: string; titulo: string; contenido: ReactNode };

export type DocumentoLegal = {
  tipo: TipoDocumento;
  slug: string;
  titulo: string;
  tituloCorto: string;
  descripcion: string;
  Icono: ElementType;
  actualizado: string;
  secciones: Seccion[];
};

const ACTUALIZADO = "28 de septiembre de 2026";
const caja =
  "rounded-xl border border-app-subtle bg-app-surface-2 p-4 text-xs sm:text-sm";
const cajaPendiente =
  "space-y-1 rounded-xl border border-dashed border-app-subtle bg-app-surface-2 p-4 text-xs text-app-secondary";
const lista = "list-disc space-y-2 pl-5 text-app-secondary";

export const DOCUMENTOS_LEGALES: Record<TipoDocumento, DocumentoLegal> = {
  terminos: {
    tipo: "terminos",
    slug: "terminos-y-condiciones",
    titulo: "Términos y Condiciones de Uso y Compra",
    tituloCorto: "Términos y condiciones",
    descripcion:
      "Condiciones generales que regulan el acceso, navegación, compraventa y entrega de productos de tecnología en Good Cell.",
    Icono: FileText,
    actualizado: ACTUALIZADO,
    secciones: [
      {
        id: "identificacion",
        titulo: "1. Identificación del Establecimiento",
        contenido: (
          <div className="space-y-3">
            <p>
              El presente sitio web y catálogo digital pertenecen y son
              operados por <strong>Good Cell</strong>, establecimiento comercial
              legalmente registrado en la Cámara de Comercio de Armenia y del
              Quindío, con sede física principal en:
            </p>
            <div className={`${caja} space-y-1.5`}>
              <div className="font-semibold text-app-primary">
                Good Cell Armenia
              </div>
              <div>
                {SITE.direccion.centroComercial} · {SITE.direccion.calle}
              </div>
              <div>{SITE.direccion.ciudad}</div>
              <div>
                Línea directa WhatsApp: +57 {SITE.telefonoVisible}
                {SITE.correoSoporte && <> · Correo: {SITE.correoSoporte}</>}
              </div>
            </div>
            <p>
              Toda transacción, consulta o coordinación de entrega realizada a
              través de nuestra web o WhatsApp se rige bajo la legislación de la
              República de Colombia, especialmente la Ley 1480 de 2011 (Estatuto
              del Consumidor) y normas complementarias de comercio electrónico.
            </p>
          </div>
        ),
      },
      {
        id: "catalogo-precios",
        titulo: "2. Precios, Disponibilidad y Catálogo",
        contenido: (
          <div className="space-y-3">
            <p>
              Todos los precios exhibidos en la plataforma están expresados en{" "}
              <strong>Pesos Colombianos (COP)</strong> e incluyen los impuestos
              aplicables de ley. Nos esforzamos permanentemente por garantizar
              la exactitud de los precios, fotografías de referencia,
              especificaciones técnicas y disponibilidad en tiempo real.
            </p>
            <p>
              En caso de que un producto presente una variación de inventario de
              último minuto o error involuntario manifiesto en la publicación,
              Good Cell se comunicará de inmediato con el cliente a través de
              WhatsApp antes de procesar el pago para ofrecer opciones
              equivalentes o cancelar la solicitud sin penalidad.
            </p>
          </div>
        ),
      },
      {
        id: "pedidos-pagos",
        titulo: "3. Procedimiento de Compra y Medios de Pago",
        contenido: (
          <div className="space-y-3">
            <p>
              Para brindar la máxima agilidad y confianza a nuestros usuarios,
              el proceso de compra inicia seleccionando los productos en el
              carrito web y se finaliza directamente por nuestro canal
              verificado de WhatsApp al <strong>{SITE.telefonoVisible}</strong>.
            </p>
            <ul className={lista}>
              <li>
                <strong className="text-app-primary">
                  Transferencia bancaria directa:
                </strong>{" "}
                Bancolombia, Davivienda y cuentas empresariales autorizadas.
              </li>
              <li>
                <strong className="text-app-primary">
                  Billeteras digitales:
                </strong>{" "}
                Nequi y Daviplata a números oficiales verificados de la tienda.
              </li>
              <li>
                <strong className="text-app-primary">
                  Pago contraentrega en Armenia:
                </strong>{" "}
                Disponible para entregas urbanas coordinadas en el perímetro de
                Armenia.
              </li>
              <li>
                <strong className="text-app-primary">Pago en caja física:</strong>{" "}
                En nuestro local 252 de Unicentro Armenia mediante efectivo,
                tarjetas débito y crédito.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "entregas-despachos",
        titulo: "4. Envíos Nacionales y Retiro en Tienda",
        contenido: (
          <div className="space-y-3">
            <p>Ofrecemos dos modalidades de entrega para tu comodidad:</p>
            <ul className={lista}>
              <li>
                <strong className="text-app-primary">
                  Retiro presencial sin costo:
                </strong>{" "}
                En Centro Comercial Unicentro Armenia Local 252 durante nuestro
                horario de atención habitual.
              </li>
              <li>
                <strong className="text-app-primary">
                  Envíos asegurados a todo Colombia:
                </strong>{" "}
                Gestionados a través de transportadoras líderes (Coordinadora,
                Servientrega, Inter Rapidísimo o Envía) con número de guía y
                seguro al 100% sobre el valor declarado del artículo.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "originalidad",
        titulo: "5. Garantía de Originalidad y Autenticidad",
        contenido: (
          <div className="space-y-3">
            <p>
              Good Cell comercializa exclusivamente tecnología{" "}
              <strong>100% original</strong>, nueva y con seriales verificables
              en las plataformas oficiales de los fabricantes (Apple, Bose, JBL,
              DJI, Logitech, Shokz, etc.). No vendemos réplicas, clones ni
              productos intervenidos.
            </p>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-app-primary">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>
                Cada dispositivo entregado cuenta con su correspondiente factura
                de compra, serial de fábrica registrado y acceso directo a la
                garantía del fabricante.
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "disposiciones-finales",
        titulo: "6. Disposiciones Finales y Modificaciones",
        contenido: (
          <div className="space-y-3">
            <p>
              Good Cell se reserva el derecho de actualizar los presentes
              Términos y Condiciones en cualquier momento con el fin de
              adaptarlos a novedades normativas, mejoras tecnológicas o cambios
              operativos. Las compras ya efectuadas mantendrán las condiciones
              vigentes al momento de la orden.
            </p>
            <div className={cajaPendiente}>
              <p className="font-semibold text-app-primary">
                Espacio de adición normativa personalizada:
              </p>
              <p>
                Este apartado está reservado para la incorporación de cláusulas
                adicionales que Good Cell disponga en futuras temporadas
                comerciales, convenios corporativos o normativas especiales de
                importación de tecnología.
              </p>
            </div>
          </div>
        ),
      },
    ],
  },

  privacidad: {
    tipo: "privacidad",
    slug: "politica-de-privacidad",
    titulo: "Política de Tratamiento y Privacidad de Datos",
    tituloCorto: "Política de privacidad",
    descripcion:
      "Lineamientos para la recolección, almacenamiento, uso y protección de tus datos personales conforme a la Ley Estatutaria 1581 de 2012.",
    Icono: ShieldCheck,
    actualizado: ACTUALIZADO,
    secciones: [
      {
        id: "responsable",
        titulo: "1. Responsable del Tratamiento de Datos",
        contenido: (
          <p>
            El responsable del tratamiento de los datos personales suministrados
            por los clientes es <strong>Good Cell Armenia</strong>, con domicilio
            en {SITE.direccion.calle} ({SITE.direccion.centroComercial}),{" "}
            {SITE.direccion.ciudad}.{" "}
            {SITE.correoPrivacidad ? (
              <>
                Correo de contacto del oficial de datos:{" "}
                <strong>{SITE.correoPrivacidad}</strong>.
              </>
            ) : (
              <>
                Puedes contactarnos por WhatsApp al{" "}
                <strong>{SITE.telefonoVisible}</strong>.
              </>
            )}
          </p>
        ),
      },
      {
        id: "finalidad",
        titulo: "2. Finalidad del Tratamiento",
        contenido: (
          <div className="space-y-3">
            <p>
              Los datos personales recolectados (tales como nombre, teléfono,
              dirección física de entrega y correo electrónico) son utilizados
              estrictamente para:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-app-secondary">
              <li>Gestionar y despachar pedidos solicitados por el cliente.</li>
              <li>
                Coordinar entregas personalizadas y emitir comprobantes de
                compra.
              </li>
              <li>
                Brindar soporte técnico y tramitar garantías directas de los
                productos adquiridos.
              </li>
              <li>
                Remitir actualizaciones sobre el estado de las órdenes vía
                WhatsApp o llamada telefónica.
              </li>
            </ul>
            <p>
              Good Cell <strong>nunca vende, alquila ni comparte</strong>{" "}
              información privada de sus clientes con terceros para fines ajenos
              a la operación de la tienda.
            </p>
          </div>
        ),
      },
      {
        id: "derechos-habeas-data",
        titulo: "3. Derechos del Titular (Habeas Data)",
        contenido: (
          <div className="space-y-3">
            <p>
              De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013,
              como titular de tus datos tienes derecho a conocer, actualizar,
              rectificar y suprimir tus datos de nuestras bases de clientes en
              cualquier momento.
            </p>
            <p>
              Para ejercer cualquiera de estos derechos, basta con enviar un
              mensaje a nuestra línea de WhatsApp{" "}
              <strong>{SITE.telefonoVisible}</strong>
              {SITE.correoPrivacidad && (
                <>
                  {" "}
                  o al correo <strong>{SITE.correoPrivacidad}</strong>
                </>
              )}{" "}
              indicando tu solicitud.
            </p>
          </div>
        ),
      },
      {
        id: "seguridad-informacion",
        titulo: "4. Medidas de Seguridad de la Información",
        contenido: (
          <p>
            Implementamos protocolos de seguridad técnica y humana para proteger
            la información frente a accesos no autorizados, pérdidas o
            adulteraciones. La navegación en nuestra plataforma se encuentra
            cifrada bajo certificados SSL/TLS modernos.
          </p>
        ),
      },
      {
        id: "actualizaciones-datos",
        titulo: "5. Espacio para Actualizaciones de Protección de Datos",
        contenido: (
          <div className={cajaPendiente}>
            <p className="font-semibold text-app-primary">
              Registro Nacional de Bases de Datos (RNBD):
            </p>
            <p>
              Espacio reservado para incorporar resoluciones específicas de la
              Superintendencia de Industria y Comercio (SIC) y declaraciones de
              privacidad adicionales según la expansión de servicios digitales
              de Good Cell.
            </p>
          </div>
        ),
      },
    ],
  },

  cookies: {
    tipo: "cookies",
    slug: "politica-de-cookies",
    titulo: "Política de Cookies y Tecnologías Similares",
    tituloCorto: "Política de cookies",
    descripcion:
      "Conoce qué son las cookies, cómo las utilizamos en Good Cell para mejorar tu experiencia y cómo puedes administrarlas.",
    Icono: Cookie,
    actualizado: ACTUALIZADO,
    secciones: [
      {
        id: "que-son-cookies",
        titulo: "1. ¿Qué son las Cookies?",
        contenido: (
          <p>
            Una cookie es un pequeño archivo de texto que un sitio web almacena
            en tu navegador o dispositivo cuando lo visitas. Permite que el
            sitio recuerde información sobre tu visita, como tu preferencia de
            tema (claro u oscuro), los artículos guardados en tu carrito de
            compras y las categorías consultadas.
          </p>
        ),
      },
      {
        id: "cookies-usadas",
        titulo: "2. Cookies que Utilizamos en Good Cell",
        contenido: (
          <div className="space-y-4">
            <div className="rounded-xl border border-app-subtle bg-app-surface-2 p-3.5">
              <div className="text-sm font-bold text-app-primary">
                Cookies Técnicas y Estrictamente Necesarias
              </div>
              <p className="mt-1 text-xs text-app-secondary">
                Son esenciales para que la tienda funcione correctamente.
                Permiten mantener los productos dentro del carrito, recordar si
                prefieres el tema claro u oscuro (<code>theme</code>) y
                registrar si ya respondiste el aviso de cookies (
                <code>goodcell_cookie_consent</code>). No pueden desactivarse.
              </p>
            </div>
            <div className="rounded-xl border border-app-subtle bg-app-surface-2 p-3.5">
              <div className="text-sm font-bold text-app-primary">
                Cookies de Rendimiento y Análisis
              </div>
              <p className="mt-1 text-xs text-app-secondary">
                Nos ayudan a comprender cómo interactúan los usuarios con el
                catálogo (páginas más visitadas, productos más explorados) de
                manera agregada y totalmente anónima, permitiéndonos optimizar
                la velocidad y facilidad de uso.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "control-cookies",
        titulo: "3. ¿Cómo Administrar o Desactivar las Cookies?",
        contenido: (
          <p>
            Puedes aceptar todas las cookies o seleccionar únicamente las
            necesarias desde el banner de consentimiento que aparece al ingresar
            a nuestra web. Asimismo, puedes configurar tu navegador web (Google
            Chrome, Safari, Mozilla Firefox o Microsoft Edge) para bloquear o
            eliminar las cookies en cualquier momento desde la sección de
            privacidad de los ajustes del navegador.
          </p>
        ),
      },
      {
        id: "vigencia-cookies",
        titulo: "4. Vigencia y Modificaciones de Cookies",
        contenido: (
          <div className={cajaPendiente}>
            <p className="font-semibold text-app-primary">
              Espacio para configuración de herramientas de terceros:
            </p>
            <p>
              Espacio destinado para detallar identificadores analíticos
              adicionales (por ejemplo, Meta Pixel o Google Analytics) cuando se
              habiliten campañas de mercadeo autorizadas por Good Cell.
            </p>
          </div>
        ),
      },
    ],
  },

  garantias: {
    tipo: "garantias",
    slug: "garantias",
    titulo: "Políticas de Garantía y Devolución",
    tituloCorto: "Garantías",
    descripcion:
      "Respaldo total en tecnología original: tiempos de cobertura, proceso de reclamación y servicio técnico en Unicentro Armenia.",
    Icono: Award,
    actualizado: ACTUALIZADO,
    secciones: [
      {
        id: "cobertura",
        titulo: "1. Cobertura y Tiempos de Garantía",
        contenido: (
          <div className="space-y-3">
            <p>
              En Good Cell comercializamos únicamente artículos genuinos y
              nuevos. Cada producto cuenta con garantía respaldada tanto por el
              fabricante como por nuestra tienda física.
            </p>
            <div className={caja}>
              <p className="font-semibold text-app-primary">
                El tiempo de garantía depende de cada producto
              </p>
              <p className="mt-1 text-app-secondary">
                Lo encuentras indicado en la tarjeta y en la ficha de cada
                artículo. La mayoría de nuestros productos tiene 1 año de
                garantía; algunos pueden tener 3, 6 o 24 meses según la marca y
                la referencia.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "requisitos",
        titulo: "2. Requisitos para Hacer Efectiva la Garantía",
        contenido: (
          <div className="space-y-3">
            <p>Para tramitar una solicitud de garantía es indispensable:</p>
            <ul className="list-disc space-y-1.5 pl-5 text-app-secondary">
              <li>
                Presentar el producto con sus accesorios completos y
                preferiblemente su empaque original.
              </li>
              <li>
                Aportar la factura de compra o el código de pedido emitido por
                Good Cell.
              </li>
              <li>
                Que el número de serie (serial number) sea legible y coincida
                con nuestros registros de venta.
              </li>
              <li>
                Que el daño no haya sido provocado por golpes, humedad no
                certificada, apertura por terceros o sobretensión eléctrica.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "procedimiento-reclamacion",
        titulo: "3. Procedimiento Paso a Paso de Reclamación",
        contenido: (
          <ol className="list-decimal space-y-2 pl-5 text-app-secondary">
            <li>
              <strong className="text-app-primary">Contacto inicial:</strong>{" "}
              Escríbenos por WhatsApp al{" "}
              <strong>{SITE.telefonoVisible}</strong> con fotos o video
              descriptivo de la falla y tu número de factura.
            </li>
            <li>
              <strong className="text-app-primary">
                Diagnóstico técnico preliminar:
              </strong>{" "}
              En nuestro local 252 de Unicentro Armenia revisaremos el equipo en
              un lapso estimado de 24 a 72 horas hábiles.
            </li>
            <li>
              <strong className="text-app-primary">Resolución:</strong> Según
              determine el diagnóstico y el Estatuto del Consumidor, se
              procederá con la reparación técnica autorizada, cambio por una
              unidad nueva idéntica o devolución de lo pagado.
            </li>
          </ol>
        ),
      },
      {
        id: "derecho-retracto",
        titulo: "4. Derecho de Retracto (Ventas a Distancia)",
        contenido: (
          <p>
            Para compras formalizadas a distancia o con envío nacional, el
            cliente tiene derecho a ejercer el retracto dentro de los{" "}
            <strong>cinco (5) días hábiles</strong> siguientes a la recepción del
            producto (Art. 47 de la Ley 1480 de 2011), siempre que el artículo
            se encuentre en perfecto estado, con sus sellos de fábrica intactos y
            sin indicios de uso.
          </p>
        ),
      },
      {
        id: "garantia-extendida",
        titulo: "5. Espacio para Términos de Garantía Extendida",
        contenido: (
          <div className={cajaPendiente}>
            <p className="font-semibold text-app-primary">
              Planes de protección adicional Good Cell Care:
            </p>
            <p>
              Espacio reservado para incorporar condiciones específicas de
              pólizas de daño accidental o cobertura extendida que Good Cell
              ofrezca en futuras colecciones.
            </p>
          </div>
        ),
      },
    ],
  },
};