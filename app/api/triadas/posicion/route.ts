import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { triada_id, peso_a, peso_b, peso_c, narrativa, estado_vital } = body;

    if (
      typeof triada_id !== "number" ||
      typeof peso_a !== "number" ||
      typeof peso_b !== "number" ||
      typeof peso_c !== "number"
    ) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const suma = peso_a + peso_b + peso_c;
    if (Math.abs(suma - 1.0) > 0.01) {
      return NextResponse.json(
        { error: `Los pesos deben sumar 1.0 (suma actual: ${suma})` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("percepciones_triada")
      .upsert(
        {
          user_id: user.id,
          triada_id,
          peso_a,
          peso_b,
          peso_c,
          narrativa: narrativa || null,
          estado_vital: estado_vital || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,triada_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Error guardando percepción:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, percepcion: data });
  } catch (err) {
    console.error("Error en /api/triadas/posicion:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contexto = searchParams.get("contexto") || "convocatoria_quanam";

    const { data: triadas, error: triadasError } = await supabase
      .from("triadas_resueltas")
      .select("*")
      .eq("contexto", contexto)
      .eq("activa", true)
      .order("orden");

    if (triadasError) {
      return NextResponse.json({ error: triadasError.message }, { status: 500 });
    }

    const { data: percepciones, error: percError } = await supabase
      .from("percepciones_triada")
      .select("*")
      .eq("user_id", user.id);

    if (percError) {
      return NextResponse.json({ error: percError.message }, { status: 500 });
    }

    return NextResponse.json({ triadas, percepciones });
  } catch (err) {
    console.error("Error en GET /api/triadas/posicion:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
