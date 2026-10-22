export type CardFilePayload = {
  image: string;
  mediaType: "image/jpeg" | "application/pdf";
  /** Absent pour un PDF : l'écran de lecture s'affiche alors sans vignette. */
  previewUrl?: string;
};

/**
 * Prépare le fichier de la carte avant l'envoi : une photo est réduite (voir
 * compressImage), un PDF (certaines mutuelles envoient la carte en PDF) part
 * tel quel. Rien n'est gardé : on renvoie seulement la base64 à transmettre une fois.
 */
export async function prepareCardFile(file: File): Promise<CardFilePayload> {
  if (file.type === "application/pdf") {
    return { image: await fileToBase64(file), mediaType: "application/pdf" };
  }
  return compressImage(file);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? "").split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("pdf"));
    reader.readAsDataURL(file);
  });
}

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
