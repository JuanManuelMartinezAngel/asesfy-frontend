import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock cart data for fallback
let mockCart: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'User ID or Session ID required' }, { status: 400 });
    }

    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

      if (error) throw error;

      return NextResponse.json({ items: data || [] });
    } catch (supabaseError) {
      // Fallback to mock data
      console.warn('Supabase unavailable, using mock data:', supabaseError);
      return NextResponse.json({ items: mockCart });
    }
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, userId, sessionId } = body;

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'User ID or Session ID required' }, { status: 400 });
    }

    try {
      // Try to save to Supabase
      const { data, error } = await supabase
        .from('cart_items')
        .upsert(
          items.map((item: any) => ({
            ...item,
            user_id: userId,
            session_id: sessionId,
            updated_at: new Date().toISOString(),
          }))
        );

      if (error) throw error;

      return NextResponse.json({ success: true, data });
    } catch (supabaseError) {
      // Fallback to mock storage
      console.warn('Supabase unavailable, using mock storage:', supabaseError);
      mockCart = items;
      return NextResponse.json({ success: true, data: mockCart });
    }
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    try {
      // Try to delete from Supabase
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

      if (error) throw error;

      return NextResponse.json({ success: true });
    } catch (supabaseError) {
      // Fallback to mock deletion
      console.warn('Supabase unavailable, using mock deletion:', supabaseError);
      mockCart = mockCart.filter(item => item.id !== itemId);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}