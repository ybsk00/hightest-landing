
export async function preloadImages(urls: string[]): Promise<void> {
    const results = await Promise.allSettled(
        urls.map(src => new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
            img.src = src;
        }))
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
        console.warn(`[Image Preload] Failed for ${failed.length} images`);
    } else {
        // console.log(`[Image Preload] Successfully preloaded ${urls.length} images`);
    }
}
