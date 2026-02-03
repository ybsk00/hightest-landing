
export function buildFrameUrls(basePath: string, count: number): string[] {
    return Array.from({ length: count }, (_, i) => {
        const idx = String(i + 1);
        return `${basePath}/batch_${idx}.jpg`;
    });
}
