'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Calculator, 
  Shield, 
  TrendingUp,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const team = [
    {
      name: 'María García Rodríguez',
      role: 'CEO & Fundadora',
      description: 'Economista con más de 15 años de experiencia en asesoría fiscal.',
      image: '/team/maria.jpg',
      linkedin: 'https://linkedin.com/in/maria-garcia'
    },
    {
      name: 'Carlos Ruiz Fernández',
      role: 'CTO',
      description: 'Ingeniero de software especializado en fintech y soluciones fiscales.',
      image: '/team/carlos.jpg',
      linkedin: 'https://linkedin.com/in/carlos-ruiz'
    },
    {
      name: 'Ana López Martín',
      role: 'Directora de Operaciones',
      description: 'Experta en gestión contable y optimización de procesos empresariales.',
      image: '/team/ana.jpg',
      linkedin: 'https://linkedin.com/in/ana-lopez'
    },
    {
      name: 'David Martín López',
      role: 'Director Fiscal',
      description: 'Asesor fiscal certificado con especialización en nuevas tecnologías.',
      image: '/team/david.jpg',
      linkedin: 'https://linkedin.com/in/david-martin'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Clientes Satisfechos' },
    { number: '€2.5M', label: 'Ahorro Fiscal Generado' },
    { number: '99.9%', label: 'Tiempo de Actividad' },
    { number: '4.9/5', label: 'Puntuación Media' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Confianza',
      description: 'Protegemos tus datos con los más altos estándares de seguridad y confidencialidad.'
    },
    {
      icon: TrendingUp,
      title: 'Innovación',
      description: 'Utilizamos la última tecnología para simplificar y automatizar procesos fiscales.'
    },
    {
      icon: Heart,
      title: 'Cercanía',
      description: 'Ofrecemos un trato personalizado y humano en cada interacción con nuestros clientes.'
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Nos comprometemos a ofrecer servicios de la más alta calidad y precisión.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0A1B3D] to-[#21242F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-6">
              Sobre Asesfy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simplificamos tu
              <span className="text-[#2FD7B5]"> gestión fiscal</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Somos un equipo de profesionales apasionados por hacer que la fiscalidad 
              sea accesible, comprensible y eficiente para todos.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-[#0A1B3D] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nuestra Historia */}
        <section className="mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#0A1B3D] text-center mb-4">
                Nuestra Historia
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Asesfy nació en 2020</strong> con una misión clara: democratizar el acceso 
                    a servicios fiscales de calidad mediante la tecnología. Fundada por un equipo 
                    de economistas y tecnólogos, nuestra empresa surge de la necesidad de simplificar 
                    los complejos procesos fiscales que enfrentan autónomos y empresas.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Durante la pandemia, observamos cómo miles de profesionales y empresas 
                    luchaban con la gestión fiscal digitalizada. <strong>Decidimos crear una 
                    solución</strong> que combinara el expertise humano con la eficiencia 
                    de la inteligencia artificial.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Hoy, después de 4 años de crecimiento constante, hemos ayudado a más de 
                    10,000 clientes a optimizar su gestión fiscal, generando ahorros superiores 
                    a los 2.5 millones de euros.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#2FD7B5]/10 to-[#0A1B3D]/10 p-8 rounded-2xl">
                    <Calculator className="h-24 w-24 text-[#2FD7B5] mx-auto mb-6" />
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#0A1B3D] mb-4">
                        Desde 2020
                      </h3>
                      <p className="text-gray-600">
                        Innovando en servicios fiscales digitales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Misión y Visión */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Target className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Nuestra Misión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Democratizar el acceso a servicios fiscales de calidad</strong> mediante 
                la combinación de tecnología avanzada y asesoramiento profesional personalizado.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Creemos que toda persona y empresa, independientemente de su tamaño o recursos, 
                merece tener acceso a herramientas y conocimientos que le permitan optimizar 
                su situación fiscal de manera legal y eficiente.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Globe className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Nuestra Visión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Ser la plataforma de referencia en España</strong> para la gestión 
                fiscal inteligente, donde la tecnología y el expertise humano se combinan 
                para crear experiencias excepcionales.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Aspiramos a un futuro donde la gestión fiscal sea tan simple como enviar 
                un mensaje, pero tan precisa como el trabajo de un experto.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Nuestros Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#0A1B3D] text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#2FD7B5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-[#2FD7B5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0A1B3D] mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nuestro Equipo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#0A1B3D] text-center mb-4">
            Nuestro Equipo
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Un equipo multidisciplinar de expertos comprometidos con tu éxito fiscal
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#2FD7B5] to-[#0A1B3D] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#2FD7B5] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.description}
                  </p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#2FD7B5] hover:text-[#2FD7B5]/80 transition-colors"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tecnología */}
        <section className="mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#0A1B3D] text-center mb-4">
                Tecnología de Vanguardia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">
                    Seguridad Avanzada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Cifrado end-to-end, cumplimiento RGPD y auditorías de seguridad regulares 
                    para proteger tus datos sensibles.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">
                    IA Especializada
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Algoritmos de inteligencia artificial entrenados específicamente en 
                    legislación fiscal española para respuestas precisas.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">
                    Análisis Predictivo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Herramientas de análisis que identifican oportunidades de optimización 
                    fiscal y predicen escenarios futuros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contacto */}
        <section>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#0A1B3D] text-center mb-4">
                ¡Hablemos!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Estamos aquí para ayudarte con cualquier pregunta sobre nuestros servicios 
                    o sobre cómo podemos optimizar tu gestión fiscal.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-[#2FD7B5]" />
                      <span className="text-gray-700">hola@asesfy.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-[#2FD7B5]" />
                      <span className="text-gray-700">+34 900 123 456</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-[#2FD7B5]" />
                      <span className="text-gray-700">Calle Gran Vía, 123, 28013 Madrid, España</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-4">
                    ¿Listo para empezar?
                  </h3>
                  <div className="space-y-3">
                    <Link href="/onboarding">
                      <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                        Crear Cuenta Gratuita
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                        Ver Planes y Precios
                      </Button>
                    </Link>
                    <Link href="/blog">
                      <Button variant="outline" className="w-full">
                        Leer Nuestro Blog
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 