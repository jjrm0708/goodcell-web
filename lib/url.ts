// Devuelve la dirección de la página de inicio con los parámetros cambiados.
// Un valor null o vacío quita ese parámetro.
export function urlConParametros(
  actual: URLSearchParams,
  cambios: Record<string, string | null>
): string {
  const params = new URLSearchParams(actual.toString());
  for (const [clave, valor] of Object.entries(cambios)) {
    if (valor === null || valor === "") params.delete(clave);
    else params.set(clave, valor);
  }
  const texto = params.toString();
  return texto ? `/?${texto}` : "/";
}