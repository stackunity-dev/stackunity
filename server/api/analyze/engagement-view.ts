import axios from 'axios';
import { defineEventHandler, readBody } from 'h3';
import { analyzeUserEngagement } from './engagement-analyzer';
import { crawlWebsite } from './utils/crawler';

interface EngagementAnalysisResult {
  url: string;
  score: number;
  ctaCount: number;
  interactiveElements: number;
  visualElements: number;
  socialElements: number;
  navigationScore: number;
  readabilityScore: number;
  engagementTechniques: {
    hasSocialLinks: boolean;
    hasCtaButtons: boolean;
    hasFormsOrInputs: boolean;
    hasVideos: boolean;
    hasImages: boolean;
    hasInteractiveElements: boolean;
    hasFeedbackMechanisms: boolean;
  };
  ctaDetails: any[];
  interactiveElementsDetails: any[];
  socialElementsDetails: any[];
  issues: any[];
  error?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL is required');
  }

  try {
    const urlList = await crawlWebsite(body.url, 20);
    const engagementAnalysis: EngagementAnalysisResult[] = [];

    for (const url of urlList) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1'
          },
          timeout: 30000, // 30 secondes de timeout
          maxRedirects: 5
        });

        const engagement = await analyzeUserEngagement(response.data);

        // Calculer le score global sur 100
        const engagementScore = Math.min(100, Math.round(
          Math.min(engagement.ctaCount * 5, 50) +
          Math.min(engagement.interactiveElements * 2, 20) +
          Math.min(engagement.visualElements * 2, 20) +
          Math.min(engagement.navigationScore * 0.1, 10)
        ));

        engagementAnalysis.push({
          url,
          score: engagementScore,
          ctaCount: engagement.ctaCount,
          interactiveElements: engagement.interactiveElements,
          visualElements: engagement.visualElements,
          socialElements: engagement.socialElements,
          navigationScore: engagement.navigationScore,
          readabilityScore: engagement.readabilityScore,
          engagementTechniques: engagement.engagementTechniques,
          ctaDetails: engagement.ctaDetails,
          interactiveElementsDetails: engagement.interactiveElementsDetails,
          socialElementsDetails: engagement.socialElementsDetails,
          issues: engagement.issues
        });
      } catch (error) {
        console.error(`Error analyzing ${url}:`, error.message);
        // On continue avec l'analyse suivante au lieu de s'arrêter
        engagementAnalysis.push({
          url,
          error: error.message,
          score: 0,
          ctaCount: 0,
          interactiveElements: 0,
          visualElements: 0,
          socialElements: 0,
          navigationScore: 0,
          readabilityScore: 0,
          engagementTechniques: {
            hasSocialLinks: false,
            hasCtaButtons: false,
            hasFormsOrInputs: false,
            hasVideos: false,
            hasImages: false,
            hasInteractiveElements: false,
            hasFeedbackMechanisms: false
          },
          ctaDetails: [],
          interactiveElementsDetails: [],
          socialElementsDetails: [],
          issues: []
        });
      }
    }

    return engagementAnalysis;
  } catch (error) {
    console.error('Error in engagement analysis:', error);
    throw error;
  }
});

