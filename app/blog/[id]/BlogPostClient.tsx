'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, MessageSquare, ThumbsUp, Eye, Download } from 'lucide-react';

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
  metaDescription: string;
  keywords: string[];
  views: number;
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  useEffect(() => {
    document.title = `${post.title} | Asesfy Blog`;
  }, [post]);

  return (
    <div className="min-h-screen bg-[#F5F6F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to blog */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-[#2FD7B5] hover:text-[#2FD7B5]/80 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al blog
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5]">
              {post.category}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.publishedAt).toLocaleDateString('es-ES')}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              {post.views.toLocaleString()} vistas
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1B3D] mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#2FD7B5] rounded-full flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-[#0A1B3D]">{post.author}</div>
                <div className="text-sm text-gray-500">Asesor Fiscal Senior</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Me gusta
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-[#0A1B3D] prose-a:text-[#2FD7B5] prose-strong:text-[#0A1B3D] prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 prose-li:text-gray-700 prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="border-t pt-6 mt-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="hover:bg-[#2FD7B5] hover:text-white cursor-pointer transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-8 text-center bg-gradient-to-r from-[#2FD7B5]/10 to-[#0A1B3D]/10">
            <BookOpen className="h-12 w-12 text-[#2FD7B5] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0A1B3D] mb-4">
              ¿Te ha resultado útil este artículo?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestros asesores fiscales pueden ayudarte a aplicar estos conocimientos 
              en tu situación específica y optimizar tu gestión fiscal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  Contratar Servicio
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Consultar con IA
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#0A1B3D] mb-6">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] mb-3">
                      {relatedPost.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{relatedPost.author}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                    <Link href={`/blog/${relatedPost.id}`}>
                      <Button variant="outline" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                        Leer artículo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SEO Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.metaDescription,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Asesfy",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://asesfy.com/logo.png"
                }
              },
              "datePublished": post.publishedAt,
              "dateModified": post.publishedAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://asesfy.com/blog/${post.id}`
              },
              "keywords": post.keywords.join(", "),
              "articleSection": post.category,
              "wordCount": post.content.replace(/<[^>]*>/g, '').split(' ').length
            })
          }}
        />
      </div>
    </div>
  );
} 