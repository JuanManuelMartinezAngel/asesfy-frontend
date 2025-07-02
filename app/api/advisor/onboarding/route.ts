import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { fullName, nif, phone } = await request.json();

  const { data, error } = await supabase
    .from('advisor_profile')
    .insert({ full_name: fullName, nif, phone });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
} 