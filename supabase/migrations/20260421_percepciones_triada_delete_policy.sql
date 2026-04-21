-- Política RLS DELETE para percepciones_triada
-- Fecha: 21/04/2026 · Adenda post-cierre SESION-20260419
--
-- Completa el set de políticas de la tabla:
-- SELECT/INSERT/UPDATE ya existían para el usuario autenticado.
-- Sin esta política, DELETE devuelve 200 OK pero RLS lo bloquea
-- silenciosamente (0 filas afectadas, error: null).

CREATE POLICY "usuarios pueden borrar sus propias percepciones"
ON percepciones_triada
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
