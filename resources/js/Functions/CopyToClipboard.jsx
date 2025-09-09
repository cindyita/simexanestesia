
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Texto copiado:", text);
    return true;
  } catch (err) {
    console.error("Error al copiar:", err);
    return false;
  }
}

