import { NextResponse } from 'next/server';
import supabase, { isSupabaseConfigured } from '@/lib/supabase';

// Force this route to be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { fullName, nif, phone } = await request.json();

    // Validate required fields
    if (!fullName || !nif || !phone) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, returning mock response');
      return NextResponse.json({
        success: true,
        message: 'Datos de onboarding guardados correctamente (modo desarrollo)',
        data: {
          id: 'mock-' + Date.now(),
          fullName,
          nif,
          phone,
          createdAt: new Date().toISOString()
        }
      });
    }

    // Try to save to Supabase
    const { data, error } = await supabase
      .from('advisor_profiles')
      .insert({
        full_name: fullName,
        nif,
        phone,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error al guardar los datos del asesor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Datos de onboarding guardados correctamente',
      data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 