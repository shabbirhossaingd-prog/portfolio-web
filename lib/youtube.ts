export function getYouTubeId(input: string) {
  try {
    const url = new URL(input);

    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "").split("?")[0] || null;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      }

      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }

      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(input: string) {
  const id = getYouTubeId(input);
  if (!id) return null;

  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}
