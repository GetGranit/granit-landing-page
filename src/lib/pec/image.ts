/**
 * Réduit la photo dans le navigateur avant l'envoi : une carte se lit très bien
 * en 1600 px, et l'envoi reste léger sur la 4G du magasin. Rien n'est gardé :
 * on renvoie seulement la chaîne base64 à transmettre une fois.
 */
export async function compressImage(
  file: File,
  maxSide = 1600,
): Promise<{ image: string; mediaType: "image/jpeg"; previewUrl: string }> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  const src = bitmap ?? (await loadImg(file));
  const w = "naturalWidth" in src ? src.naturalWidth : src.width;
  const h = "naturalHeight" in src ? src.naturalHeight : src.height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  bitmap?.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { image: dataUrl.split(",")[1] ?? "", mediaType: "image/jpeg", previewUrl: dataUrl };
}

function loadImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}
