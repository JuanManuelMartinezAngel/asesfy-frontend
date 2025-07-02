import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

const SYSTEM_PROMPT = `Eres un asistente especializado en asesoría fiscal española. Tu objetivo es ayudar a autónomos y empresas con sus consultas fiscales de manera precisa y profesional.

INSTRUCCIONES IMPORTANTES:
1. Responde únicamente sobre temas fiscales, tributarios y contables de España
2. Si la consulta no está relacionada con fiscalidad, redirige amablemente al tema fiscal
3. Proporciona información actualizada según la normativa española vigente
4. Cuando sea relevante, sugiere servicios específicos usando la etiqueta [SERVICIOS_SUGERIDOS]

SERVICIOS DISPONIBLES PARA SUGERIR:
- Declaración de la Renta (ID: 1)
- IVA Trimestral (ID: 2)
- Constitución de Sociedad (ID: 3)
- Asesoría Fiscal Mensual (ID: 4)
- Nóminas y Seguros Sociales (ID: 5)
- Recurso Hacienda (ID: 6)

FORMATO DE RESPUESTA:
- Respuesta clara y profesional
- Si sugieres servicios, usa: [SERVICIOS_SUGERIDOS: ID1,ID2,ID3]
- Mantén un tono profesional pero cercano
- Incluye advertencias legales cuando sea necesario

Ejemplo de sugerencia:
"Para gestionar tu declaración de la renta de forma óptima, te recomiendo nuestro servicio especializado. [SERVICIOS_SUGERIDOS: 1]"
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
      // Fallback response when OpenAI is not configured
      const lastMessage = messages[messages.length - 1];
      const mockResponse = generateMockResponse(lastMessage?.content || '');
      
      return NextResponse.json({
        message: mockResponse,
        suggestedServices: extractSuggestedServices(mockResponse)
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const responseMessage = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';
      const suggestedServices = extractSuggestedServices(responseMessage);

      return NextResponse.json({
        message: responseMessage.replace(/\[SERVICIOS_SUGERIDOS:.*?\]/g, '').trim(),
        suggestedServices
      });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to mock response
      const lastMessage = messages[messages.length - 1];
      const mockResponse = generateMockResponse(lastMessage?.content || '');
      
      return NextResponse.json({
        message: mockResponse,
        suggestedServices: extractSuggestedServices(mockResponse)
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractSuggestedServices(message: string): string[] {
  const match = message.match(/\[SERVICIOS_SUGERIDOS: ([\d,]+)\]/);
  if (match) {
    return match[1].split(',').map(id => id.trim());
  }
  return [];
}

function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('renta') || lowerMessage.includes('irpf')) {
    return `Para tu consulta sobre la declaración de la renta, te puedo ayudar con los aspectos clave:

1. **Plazos**: La campaña de la renta generalmente va de abril a junio
2. **Deducciones**: Puedes deducir gastos relacionados con tu actividad económica
3. **Documentación**: Necesitarás todos los certificados de ingresos y gastos

Te recomiendo nuestro servicio especializado para optimizar tu declaración. [SERVICIOS_SUGERIDOS: 1]

¿Tienes alguna duda específica sobre tu situación fiscal?`;
  }
  
  if (lowerMessage.includes('iva') || lowerMessage.includes('trimestral')) {
    return `Sobre el IVA trimestral, aquí tienes la información esencial:

1. **Plazos de presentación**: Hasta el 20 de cada trimestre
2. **Tipos de IVA**: General (21%), reducido (10%), superreducido (4%)
3. **Deducciones**: Puedes deducir el IVA soportado en tus compras

Para gestionar correctamente tus liquidaciones trimestrales, ofrecemos un servicio especializado. [SERVICIOS_SUGERIDOS: 2]

¿Necesitas ayuda con algún trimestre en particular?`;
  }
  
  if (lowerMessage.includes('sociedad') || lowerMessage.includes('empresa')) {
    return `Si estás pensando en constituir una sociedad, estos son los puntos clave:

1. **Tipos de sociedades**: SL (más común), SA, cooperativas
2. **Capital mínimo**: 3.006€ para SL
3. **Trámites**: Notaría, Registro Mercantil, Hacienda

Nuestro servicio integral te ayuda con todos los trámites. [SERVICIOS_SUGERIDOS: 3]

¿Qué tipo de actividad vas a desarrollar?`;
  }
  
  return `Gracias por tu consulta fiscal. Como especialista en fiscalidad española, estoy aquí para ayudarte con:

- Declaraciones de impuestos (IRPF, Sociedades, etc.)
- Gestión del IVA y otros tributos
- Asesoramiento sobre deducciones
- Planificación fiscal
- Constitución de empresas

Para brindarte una respuesta más específica, ¿podrías proporcionar más detalles sobre tu situación fiscal?

Si necesitas asesoramiento continuo, considera nuestro servicio mensual. [SERVICIOS_SUGERIDOS: 4]`;
}