
export function buildFrameUrls(basePath: string, count: number): string[] {
    return Array.from({ length: count }, (_, i) => {
        const idx = String(i).padStart(2, '0');
        return `${basePath}/${idx}.jpg`;
    });
}
