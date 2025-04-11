import { createError, defineEventHandler, readBody, setHeader } from 'h3';
import PDFDocument from 'pdfkit';
import type { SEOReport } from './types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, report } = body as { url: string; report: SEOReport };
  console.log(report);

  if (!url || !report) {
    throw createError({
      statusCode: 400,
      message: 'URL and report required'
    });
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    bufferPages: true,
    info: {
      Title: `SEO Audit - ${url}`,
      Author: 'SEO Audit Tool',
      Subject: 'SEO Audit Report',
      Keywords: 'SEO, audit, analysis'
    }
  });

  setHeader(event, 'Content-Type', 'application/pdf');
  setHeader(event, 'Content-Disposition', `attachment; filename=seo-audit-${new Date().toISOString().split('T')[0]}.pdf`);

  const chunks: Buffer[] = [];
  doc.on('data', chunks.push.bind(chunks));

  const mainResult = report.seoResults[report.visitedURLs[0]];

  // En-tête
  doc.font('Helvetica-Bold')
    .fontSize(24)
    .fillColor('#2196F3')
    .text('Rapport SEO', { align: 'center' })
    .moveDown();

  doc.font('Helvetica')
    .fontSize(14)
    .fillColor('#000000')
    .text(`URL analysée : ${url}`, { align: 'left' })
    .text(`Date : ${new Date().toLocaleDateString()}`, { align: 'left' })
    .moveDown();

  if (mainResult) {
    // Score global
    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1976D2')
      .text('Score global', { underline: true })
      .moveDown();

    doc.font('Helvetica')
      .fontSize(14)
      .fillColor('#000000')
      .text(`${mainResult.score ?? 0}%`, { align: 'center' })
      .moveDown();

    // Métriques de performance
    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1976D2')
      .text('Performance', { underline: true })
      .moveDown();

    const metrics = [
      {
        label: 'LCP (Largest Contentful Paint)',
        value: report.summary?.averageLCP ?? 0,
        unit: 'ms',
        good: 2500,
        poor: 4000,
        description: 'Time to load the largest contentful paint'
      },
      {
        label: 'FCP (First Contentful Paint)',
        value: report.summary?.averageFCP ?? 0,
        unit: 'ms',
        good: 1000,
        poor: 3000,
        description: 'First Contentful Paint'
      },
      {
        label: 'CLS (Cumulative Layout Shift)',
        value: report.summary?.averageCLS ?? 0,
        unit: '',
        good: 0.1,
        poor: 0.25,
        description: 'Cumulative Layout Shift'
      },
      {
        label: 'Temps de chargement',
        value: report.summary?.averageLoadTime ?? 0,
        unit: 'ms',
        good: 2000,
        poor: 4000,
        description: 'Time to load the page'
      },
      {
        label: 'TTFB (Time to First Byte)',
        value: report.summary?.averageTTFB ?? 0,
        unit: 'ms',
        good: 500,
        poor: 1500,
        description: 'Time to first byte'
      }
    ];

    const startX = 50;
    const startY = doc.y;
    const cellWidth = 250;
    const cellHeight = 80;
    const margin = 10;

    metrics.forEach((metric, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + (col * cellWidth);
      const y = startY + (row * cellHeight);

      const color = metric.value <= metric.good ? '#4CAF50' :
        metric.value <= metric.poor ? '#FF9800' : '#F44336';

      doc.rect(x, y, cellWidth - margin, cellHeight - margin)
        .strokeColor('#E0E0E0')
        .stroke();

      doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#1976D2')
        .text(metric.label, x + 5, y + 5, {
          width: cellWidth - 10,
          align: 'left'
        });

      doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor(color)
        .text(`${metric.value.toFixed(2)}${metric.unit}`, x + 5, y + 20, {
          width: cellWidth - 10,
          align: 'left'
        });

      doc.font('Helvetica')
        .fontSize(8)
        .fillColor('#666666')
        .text(metric.description, x + 5, y + 40, {
          width: cellWidth - 10,
          align: 'left'
        });

      const barWidth = cellWidth - 20;
      const barHeight = 5;
      const progress = Math.min(1, metric.value / metric.poor);

      doc.fillColor('#E0E0E0')
        .rect(x + 5, y + 60, barWidth, barHeight)
        .fill();

      doc.fillColor(color)
        .rect(x + 5, y + 60, barWidth * progress, barHeight)
        .fill();
    });

    doc.y = startY + (Math.ceil(metrics.length / 2) * cellHeight) + 20;

    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1976D2')
      .text('Technical SEO', { underline: true })
      .moveDown();

    const technicalData = [
      ['Title', mainResult.title || 'Not defined'],
      ['Meta description', mainResult.description || 'Not defined'],
      ['H1', mainResult.headingStructure?.h1 || 'Not defined']
    ];

    technicalData.forEach(([label, value]) => {
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .text(`${label} : ${value}`, { align: 'left' })
        .moveDown();
    });

    if (mainResult.headingStructure) {
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#000000')
        .text('Structure des titres :', { align: 'left' })
        .moveDown(0.5);

      const formatHeadingStructure = (structure: any, level = 0) => {
        const indent = '  '.repeat(level);
        if (typeof structure === 'string') {
          doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#666666')
            .text(`${indent}• ${structure}`, { align: 'left' });
        } else if (Array.isArray(structure)) {
          structure.forEach(item => formatHeadingStructure(item, level));
        } else if (typeof structure === 'object') {
          Object.entries(structure).forEach(([tag, content]) => {
            doc.font('Helvetica-Bold')
              .fontSize(10)
              .fillColor('#1976D2')
              .text(`${indent}${tag}:`, { align: 'left' });
            formatHeadingStructure(content, level + 1);
          });
        }
      };

      formatHeadingStructure(mainResult.headingStructure);
      doc.moveDown();
    }

    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1976D2')
      .text('Images', { underline: true })
      .moveDown();

    const imageData = [
      ['Total images', mainResult.images?.total ?? 0],
      ['Images with alt', mainResult.images?.withAlt ?? 0],
      ['Images without alt', mainResult.images?.withoutAlt ?? 0]
    ];

    imageData.forEach(([label, value]) => {
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .text(`${label} : ${value}`, { align: 'left' })
        .moveDown();
    });

    if (mainResult.largeFiles && mainResult.largeFiles.length > 0) {
      doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#1976D2')
        .text('Large files', { underline: true })
        .moveDown();

      mainResult.largeFiles.forEach(file => {
        doc.font('Helvetica')
          .fontSize(12)
          .fillColor('#000000')
          .text(`${file.type} : ${file.url} (${file.size} bytes)`, { align: 'left' })
          .moveDown();
      });
    }

    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor('#1976D2')
      .text('Accessibilité', { underline: true })
      .moveDown();

    const accessibilityData = [
      ['Accessibility Score', `${mainResult.accessibility?.accessibilityScore ?? 0}%`],
      ['Missing ARIA elements', mainResult.accessibility?.missingAria ?? 0],
      ['Missing alt attributes', mainResult.accessibility?.missingAlt ?? 0],
      ['Missing labels', mainResult.accessibility?.missingLabels ?? 0],
      ['Contrast issues', mainResult.accessibility?.contrastIssues ?? 0]
    ];

    accessibilityData.forEach(([label, value]) => {
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#000000')
        .text(`${label} : ${value}`, { align: 'left' })
        .moveDown();
    });
  }

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
});