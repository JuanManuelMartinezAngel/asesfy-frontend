import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'User ID or Session ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

    if (error) {
      console.error('Cart GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
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

    if (error) {
      console.error('Cart POST error:', error);
      return NextResponse.json({ error: 'Failed to save cart items' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
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

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

    if (error) {
      console.error('Cart DELETE error:', error);
      return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}