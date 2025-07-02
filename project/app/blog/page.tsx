'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight,
  TrendingUp,
  FileText,
  Calculator,
  AlertCircle,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  views: number;
  metaDescription: string;
  keywords: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Complete blog posts data with SEO optimization
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Guía Completa para la Declaración de la Renta 2024',
      excerpt: 'Descubre todo sobre la campaña de la renta 2024: fechas clave, novedades fiscales, deducciones disponibles y estrategias para optimizar tu declaración y ahorrar dinero.',
      content: '',
      author: 'María García Rodríguez',
      publishedAt: '2024-01-15',
      readTime: '12 min',
      category: 'Declaraciones',
      tags: ['IRPF', 'Renta 2024', 'Deducciones', 'Optimización Fiscal'],
      featured: true,
      views: 15420,
      metaDescription: 'Guía completa para la declaración de la renta 2024. Descubre fechas, novedades, deducciones y estrategias para optimizar tu declaración fiscal.',
      keywords: ['declaración renta 2024', 'IRPF', 'deducciones fiscales', 'asesoría fiscal']
    },
    {
      id: '2',
      title: 'IVA Trimestral 2024: Guía Completa para Evitar Errores',
      excerpt: 'Todo lo que necesitas saber sobre el IVA trimestral: fechas de presentación, errores comunes, deducciones y estrategias para optimizar tu liquidación fiscal.',
      content: '',
      author: 'Carlos Ruiz Fernández',
      publishedAt: '2024-01-12',
      readTime: '10 min',
      category: 'IVA',
      tags: ['IVA Trimestral', 'Liquidación IVA', 'Autónomos', 'Empresas'],
      views: 8930,
      metaDescription: 'Guía completa del IVA trimestral 2024: fechas, errores comunes, deducciones y estrategias para optimizar tu liquidación fiscal.',
      keywords: ['IVA trimestral', 'liquidación IVA', 'deducciones IVA', 'autónomos']
    },
    {
      id: '3',
      title: 'Constitución de Sociedades 2024: SL vs SA - Guía Completa',
      excerpt: 'Análisis detallado de las diferencias entre Sociedad Limitada y Anónima: ventajas, desventajas, costes, trámites y cuál elegir según tu proyecto empresarial.',
      content: '',
      author: 'Ana López Martín',
      publishedAt: '2024-01-10',
      readTime: '15 min',
      category: 'Sociedades',
      tags: ['Constitución Sociedades', 'SL vs SA', 'Derecho Mercantil', 'Empresas'],
      views: 12750,
      metaDescription: 'Guía completa para elegir entre Sociedad Limitada y Anónima: diferencias, ventajas, costes y proceso de constitución paso a paso.',
      keywords: ['constitución sociedades', 'SL vs SA', 'sociedad limitada', 'sociedad anónima']
    },
    {
      id: '4',
      title: 'Novedades Fiscales 2024: Cambios Importantes para Autónomos y Empresas',
      excerpt: 'Resumen completo de los principales cambios fiscales para 2024: nuevas deducciones, modificaciones en el IRPF, IVA digital y medidas para autónomos.',
      content: '',
      author: 'David Martín López',
      publishedAt: '2024-01-08',
      readTime: '14 min',
      category: 'Novedades',
      tags: ['Novedades Fiscales 2024', 'IRPF', 'Autónomos', 'Empresas'],
      views: 18650,
      metaDescription: 'Descubre todas las novedades fiscales 2024: cambios en IRPF, nuevas deducciones, medidas para autónomos y digitalización del IVA.',
      keywords: ['novedades fiscales 2024', 'cambios fiscales', 'IRPF 2024', 'autónomos 2024']
    },
    {
      id: '5',
      title: 'Optimización Fiscal para Autónomos: 15 Estrategias Legales',
      excerpt: 'Descubre las mejores estrategias legales de optimización fiscal para autónomos: deducciones, gastos deducibles, planificación y consejos prácticos para ahorrar.',
      content: '',
      author: 'Laura Sánchez Gómez',
      publishedAt: '2024-01-05',
      readTime: '18 min',
      category: 'Autónomos',
      tags: ['Optimización Fiscal', 'Autónomos', 'Deducciones', 'Ahorro Fiscal'],
      views: 22180,
      metaDescription: 'Descubre 15 estrategias legales de optimización fiscal para autónomos: deducciones, gastos deducibles y consejos para reducir tu carga tributaria.',
      keywords: ['optimización fiscal autónomos', 'deducciones autónomos', 'ahorro fiscal', 'gastos deducibles']
    },
    {
      id: '6',
      title: 'Digitalización de Facturas 2024: Facturación Electrónica Obligatoria',
      excerpt: 'Todo sobre la nueva normativa de facturación electrónica: obligaciones, plazos, formatos, software recomendado y cómo preparar tu empresa para el cambio.',
      content: '',
      author: 'Roberto Fernández Silva',
      publishedAt: '2024-01-03',
      readTime: '16 min',
      category: 'Digitalización',
      tags: ['Facturación Electrónica', 'Digitalización', 'Normativa', 'Empresas'],
      views: 14320,
      metaDescription: 'Guía completa sobre facturación electrónica obligatoria 2024: normativa, plazos, formatos, software y cómo preparar tu empresa.',
      keywords: ['facturación electrónica', 'digitalización facturas', 'facturae', 'normativa facturación']
    }
  ];

  useEffect(() => {
    // Simulate loading
    const loadPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
      setIsLoading(false);
    };

    loadPosts();

    // Set page title and meta description for SEO
    if (typeof document !== 'undefined') {
      document.title = 'Blog de Asesoría Fiscal | Asesfy - Guías y Consejos Fiscales';
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Blog especializado en asesoría fiscal: guías completas sobre IRPF, IVA, autónomos, sociedades y todas las novedades fiscales actualizadas.');
      
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', 'blog fiscal, asesoría fiscal, IRPF, IVA, autónomos, sociedades, declaración renta, optimización fiscal');
    }
  }, []);

  const categories = [...new Set(posts.map(post => post.category))];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      {/* Hero Section */}
      <section className="bg-[#0A1B3D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de <span className="text-[#2FD7B5]">Asesoría Fiscal</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mantente al día con las últimas novedades fiscales, guías especializadas 
              y consejos prácticos de nuestros expertos para optimizar tu gestión fiscal.
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2FD7B5]">50+</div>
                <div className="text-gray-300">Artículos Especializados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2FD7B5]">100K+</div>
                <div className="text-gray-300">Lectores Mensuales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2FD7B5]">15+</div>
                <div className="text-gray-300">Expertos Fiscales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar artículos sobre fiscalidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-[#2FD7B5] hover:bg-[#2FD7B5]/90" : ""}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#2FD7B5] hover:bg-[#2FD7B5]/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && searchQuery === '' && selectedCategory === null && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#0A1B3D] mb-6">Artículo Destacado</h2>
            <Card className="border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-[#2FD7B5] to-[#0A1B3D] p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                    <Badge className="bg-white/20 text-white">Más Leído</Badge>
                    <div className="mt-4 flex items-center justify-center text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {featuredPost.views.toLocaleString()} vistas
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5]">
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A1B3D] mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{featuredPost.author}</span>
                    </div>
                    <Link href={`/blog/${featuredPost.id}`}>
                      <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                        Leer artículo completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0A1B3D] mb-6">
            {searchQuery || selectedCategory ? 'Resultados de Búsqueda' : 'Últimos Artículos Fiscales'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                No se encontraron artículos
              </h3>
              <p className="text-gray-600">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5]">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                    <CardTitle className="text-[#0A1B3D] line-clamp-2 hover:text-[#2FD7B5] transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs hover:bg-[#2FD7B5] hover:text-white transition-colors cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`} className="block mt-4">
                      <Button variant="outline" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white transition-all">
                        Leer artículo completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-[#0A1B3D] mb-6 text-center">
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">IRPF y Declaraciones</h3>
              <p className="text-gray-600 text-sm mb-4">
                Guías completas sobre declaración de la renta, deducciones y optimización fiscal.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory('Declaraciones')}
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Ver artículos
              </Button>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">IVA y Empresas</h3>
              <p className="text-gray-600 text-sm mb-4">
                Todo sobre IVA trimestral, facturación y obligaciones empresariales.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory('IVA')}
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                Ver artículos
              </Button>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <AlertCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">Autónomos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Consejos específicos para autónomos: cotizaciones, gastos y optimización.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory('Autónomos')}
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              >
                Ver artículos
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-[#0A1B3D] text-white p-8 rounded-2xl text-center">
          <div className="max-w-2xl mx-auto">
            <FileText className="h-12 w-12 text-[#2FD7B5] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Mantente Informado sobre Fiscalidad
            </h2>
            <p className="text-gray-300 mb-6">
              Suscríbete a nuestro newsletter fiscal y recibe las últimas novedades, 
              guías exclusivas y consejos de nuestros expertos directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="tu@email.com"
                className="flex-1 bg-white border-white text-[#0A1B3D]"
              />
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                Suscribirse Gratis
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Sin spam. Contenido exclusivo. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog de Asesoría Fiscal - Asesfy",
            "description": "Blog especializado en asesoría fiscal con guías completas sobre IRPF, IVA, autónomos, sociedades y novedades fiscales.",
            "url": "https://asesfy.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Asesfy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://asesfy.com/logo.png"
              }
            },
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.publishedAt,
              "url": `https://asesfy.com/blog/${post.id}`,
              "keywords": post.keywords.join(", ")
            }))
          })
        }}
      />
    </div>
  );
}
