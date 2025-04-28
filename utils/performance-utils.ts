export interface OptimizationTip {
    title: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
    category?: 'loading' | 'resources' | 'network' | 'images' | 'caching';
}

export interface PerformanceMetrics {
    url: string;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    speedIndex: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
    score: number;
    overallScore: number;
    domSize: number;
    resourceSummary: {
        totalResources: number;
        totalSize: number;
        javascriptSize: number;
        cssSize: number;
        imageSize: number;
        fontSize: number;
        otherSize: number;
    };
    resourceOptimization: {
        compressedImages: boolean;
        responsiveImages: boolean;
        lazyLoading: boolean;
        minifiedCss: boolean;
        minifiedJs: boolean;
        browserCaching?: boolean;
    };
    networkRequests: {
        total: number;
        size: number;
        byType: Record<string, { count: number; size: number }>;
    };
    browserCaching: boolean;
}

export interface PerformanceData {
    url: string;
    urlsAnalyzed: string[];
    performanceResults: PerformanceMetrics[];
    averageScore: number;
    optimizationTips: OptimizationTip[];
}

export const analyzeWebsitePerformance = async (mainUrl: string, maxUrls: number = 5): Promise<PerformanceData> => {
    try {
        const response = await fetch('/api/analyze/performance-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: mainUrl,
                maxUrls: maxUrls
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to analyze website: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error analyzing website performance:', error);
        throw error;
    }
};

export const sendPerformanceScoreToWebsitePage = (websiteUrl: string, performanceScore: number, metrics?: Partial<PerformanceMetrics>): void => {
    try {
        if (typeof window !== 'undefined') {
            const performanceMetrics = metrics ? {
                firstContentfulPaint: metrics.firstContentfulPaint || 0,
                largestContentfulPaint: metrics.largestContentfulPaint || 0,
                cumulativeLayoutShift: metrics.cumulativeLayoutShift || 0,
                speedIndex: metrics.speedIndex || 0,
                totalBlockingTime: metrics.totalBlockingTime || 0,
                timeToInteractive: metrics.timeToInteractive || 0
            } : null;

            const event = new CustomEvent('performanceDataAvailable', {
                detail: {
                    websiteUrl,
                    performanceScore,
                    performanceMetrics
                }
            });
            window.dispatchEvent(event);
        }
    } catch (error) {
        console.error('Error sending performance score to website page:', error);
    }
}; 