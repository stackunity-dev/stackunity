import { d as defineEventHandler, r as readBody, c as createError, n as setHeader } from '../../_/nitro.mjs';
import PDFDocument from 'pdfkit';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const seoAudit_pdf_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, report } = body;
  if (!url || !report) {
    throw createError({
      statusCode: 400,
      message: "URL and report required"
    });
  }
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true,
    info: {
      Title: `SEO Audit - ${url}`,
      Author: "SEO Audit Tool",
      Subject: "SEO Audit Report",
      Keywords: "SEO, audit, analysis"
    }
  });
  setHeader(event, "Content-Type", "application/pdf");
  setHeader(event, "Content-Disposition", `attachment; filename=seo-audit-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
  const chunks = [];
  doc.on("data", chunks.push.bind(chunks));
  const calculateOverallScore = (result) => {
    let score = 100;
    const warnings = result.warnings || [];
    warnings.forEach((warning) => {
      if (typeof warning === "string") return;
      switch (warning.severity) {
        case "critical":
          score -= 20;
          break;
        case "high":
          score -= 15;
          break;
        case "medium":
          score -= 10;
          break;
        case "low":
          score -= 5;
          break;
      }
    });
    if (result.coreWebVitals.LCP > 2500) score -= 10;
    if (result.coreWebVitals.FCP > 1e3) score -= 5;
    if (result.coreWebVitals.TTFB > 500) score -= 5;
    if (!result.mobileCompatibility.hasViewport) score -= 10;
    if (result.mobileCompatibility.smallTouchTargets > 0) score -= 5;
    if (!result.securityChecks.https) score -= 15;
    return Math.max(0, Math.min(100, score));
  };
  const ensureSpace = (requiredSpace, nextSectionTitle) => {
    const currentPosition = doc.y;
    if (currentPosition + requiredSpace > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      if (nextSectionTitle) {
        doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text(nextSectionTitle, { underline: true }).moveDown();
        return true;
      }
      return false;
    }
    return false;
  };
  const createTable = (data, options = {}) => {
    var _a;
    const cellPadding2 = 12;
    const columnWidths = options.columnWidths || [120, 300, 100];
    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
    const rowHeight2 = 50;
    if (doc.y + rowHeight2 * data.length > doc.page.height - 100) {
      doc.addPage();
    }
    const startY = doc.y;
    doc.fillColor(options.headerColor || "#E3F2FD").rect(50, startY, totalWidth, rowHeight2).fill();
    for (let i = 0; i < data[0].length; i++) {
      const x = 50 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.fillColor("#1976D2").font("Helvetica-Bold").text(data[0][i], x + cellPadding2, startY + (rowHeight2 - 20) / 2, {
        width: columnWidths[i] - cellPadding2 * 2,
        align: "left"
      });
    }
    doc.y = startY + rowHeight2;
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      if (doc.y + rowHeight2 > doc.page.height - 100) {
        doc.addPage();
      }
      const rowY = doc.y;
      doc.fillColor(((_a = options.rowColors) == null ? void 0 : _a[rowIndex - 1]) || "#FFFFFF").rect(50, rowY, totalWidth, rowHeight2).fill();
      for (let colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
        const x = 50 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
        doc.fillColor("#000000").font("Helvetica").text(data[rowIndex][colIndex], x + cellPadding2, rowY + (rowHeight2 - 20) / 2, {
          width: columnWidths[colIndex] - cellPadding2 * 2,
          align: "left"
        });
      }
      doc.strokeColor("#E0E0E0").moveTo(50, rowY + rowHeight2).lineTo(50 + totalWidth, rowY + rowHeight2).stroke();
      doc.y = rowY + rowHeight2;
    }
    doc.y += 20;
  };
  const createBarChart = (data, title) => {
    const startY = doc.y;
    const chartHeight = 150;
    const barWidth = 40;
    const spacing = 200;
    const startX = 150;
    doc.font("Helvetica-Bold").fontSize(14).text(title, { align: "center" }).moveDown();
    data.forEach((item, index) => {
      const x = startX + (barWidth + spacing) * index;
      const barHeight = item.value / item.max * chartHeight;
      const color = item.value > item.max * 0.8 ? "#F44336" : item.value > item.max * 0.6 ? "#FF9800" : "#4CAF50";
      doc.fillColor(color).rect(x, startY + chartHeight - barHeight + 30, barWidth, barHeight).fill();
      doc.font("Helvetica").fontSize(11).fillColor("#000000").text(item.label, x - 50, startY + chartHeight + 40, {
        width: barWidth + 100,
        align: "center"
      });
      doc.font("Helvetica").fontSize(11).fillColor("#000000").text(item.value.toString(), x - 50, startY + chartHeight + 60, {
        width: barWidth + 100,
        align: "center"
      });
    });
    doc.y = startY + chartHeight + 90;
  };
  doc.font("Helvetica-Bold").fontSize(24).fillColor("#2196F3").text("SEO Audit Report", { align: "center" }).moveDown();
  doc.font("Helvetica").fontSize(14).fillColor("#000000").text(`Analyzed URL: ${url}`, { align: "left" }).text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, { align: "left" }).moveDown();
  doc.moveDown();
  const titleWritten = ensureSpace(400, "Summary");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Summary", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000");
  const summaryData = [
    ["Metric", "Value"],
    ["Pages analyzed", report.summary.totalPages.toString()],
    ["Average loading time", `${(report.summary.averageLoadTime / 1e3).toFixed(2)}s`],
    ["Total warnings", report.summary.totalWarnings.toString()],
    ["Pages without title", report.summary.missingTitles.toString()],
    ["Pages without description", report.summary.missingDescriptions.toString()],
    ["Images without alt", report.summary.missingAltTags.toString()],
    ["Average First Contentful Paint", `${(report.summary.averageFCP / 1e3).toFixed(2)}s`],
    ["Average Largest Contentful Paint", `${(report.summary.averageLCP / 1e3).toFixed(2)}s`],
    ["Average Time to First Byte", `${(report.summary.averageTTFB / 1e3).toFixed(2)}s`],
    ["Pages with structured data", `${report.summary.pagesWithStructuredData} (${Math.round(report.summary.pagesWithStructuredData / report.summary.totalPages * 100)}%)`],
    ["Pages with social tags", `${report.summary.pagesWithSocialTags} (${Math.round(report.summary.pagesWithSocialTags / report.summary.totalPages * 100)}%)`],
    ["Mobile compatible pages", `${report.summary.mobileCompatiblePages} (${Math.round(report.summary.mobileCompatiblePages / report.summary.totalPages * 100)}%)`],
    ["Secure pages (HTTPS)", `${report.summary.securePages} (${Math.round(report.summary.securePages / report.summary.totalPages * 100)}%)`]
  ];
  let yPosition = doc.y;
  const cellPadding = 8;
  const columnWidth = 200;
  doc.fillColor("#E3F2FD").rect(50, yPosition, columnWidth * 2, 30).fill();
  doc.fillColor("#1976D2").text(summaryData[0][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[0][1], 50 + columnWidth, yPosition + cellPadding);
  yPosition += 30;
  const rowHeight = 30;
  const totalTableHeight = rowHeight * (summaryData.length - 1);
  if (yPosition + totalTableHeight > doc.page.height - 100) {
    doc.addPage();
    yPosition = 50;
    doc.fillColor("#E3F2FD").rect(50, yPosition, columnWidth * 2, 30).fill();
    doc.fillColor("#1976D2").text(summaryData[0][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[0][1], 50 + columnWidth, yPosition + cellPadding);
    yPosition += 30;
  }
  for (let i = 1; i < summaryData.length; i++) {
    doc.fillColor("#000000").text(summaryData[i][0], 50 + cellPadding, yPosition + cellPadding).text(summaryData[i][1], 50 + columnWidth, yPosition + cellPadding);
    doc.strokeColor("#E0E0E0").moveTo(50, yPosition + 30).lineTo(50 + columnWidth * 2, yPosition + 30).stroke();
    yPosition += 30;
    if (yPosition > doc.page.height - 100) {
      doc.addPage();
      yPosition = 50;
    }
  }
  if (yPosition + 150 > doc.page.height - 100) {
    doc.addPage();
    yPosition = 50;
  } else {
    doc.moveDown(2);
  }
  ensureSpace(200, "Performance Metrics");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Performance Metrics", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("The Core Web Vitals and performance metrics are crucial for SEO because they affect user experience and ranking in search engines.", { align: "left" }).moveDown();
  const createPerformanceMeter = (label, value, good, poor, unit = "ms") => {
    const y = doc.y;
    doc.text(`${label}: ${(value / 1e3).toFixed(2)}s`, 50, y);
    doc.strokeColor("#E0E0E0").lineWidth(10).moveTo(50, y + 15).lineTo(450, y + 15).stroke();
    let color = "#4CAF50";
    if (value > poor) color = "#F44336";
    else if (value > good) color = "#FF9800";
    const barLength = Math.min(400, value / poor * 400);
    doc.strokeColor(color).lineWidth(10).moveTo(50, y + 15).lineTo(50 + barLength, y + 15).stroke();
    doc.moveDown(1.5);
  };
  createPerformanceMeter("First Contentful Paint (FCP)", report.summary.averageFCP, 1e3, 3e3);
  createPerformanceMeter("Largest Contentful Paint (LCP)", report.summary.averageLCP, 2500, 4e3);
  createPerformanceMeter("Time to First Byte (TTFB)", report.summary.averageTTFB, 500, 1500);
  ensureSpace(500, "Page Analysis");
  if (!titleWritten) {
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Page Analysis", { underline: true }).moveDown();
  }
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("Here is the detailed analysis of your site pages, sorted by the number of issues detected. This analysis helps quickly identify pages that need special attention.", { align: "left" }).moveDown();
  const pagesData = Object.entries(report.seoResults).map(([url2, result]) => ({
    url: url2,
    warnings: result.warnings.length,
    score: calculateOverallScore(result)
  })).sort((a, b) => b.warnings - a.warnings).slice(0, 5);
  const pagesTableData = [
    ["URL", "Issues", "SEO Score"],
    ...pagesData.map((page) => [
      page.url.length > 40 ? page.url.substring(0, 37) + "..." : page.url,
      page.warnings.toString(),
      `${page.score}%`
    ])
  ];
  createTable(pagesTableData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5", "#FFFFFF", "#F5F5F5", "#FFFFFF"],
    columnWidths: [300, 100, 100]
  });
  ensureSpace(300, "Mobile Compatibility");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("Mobile compatibility is a crucial factor for SEO. A well-optimized site for mobile offers a better user experience and is favored by Google.", { align: "left" }).moveDown();
  const mobileData = [
    { label: "Optimized Pages", value: report.summary.mobileCompatiblePages, max: report.summary.totalPages },
    { label: "Pages to Optimize", value: report.summary.totalPages - report.summary.mobileCompatiblePages, max: report.summary.totalPages }
  ];
  createBarChart(mobileData, "Mobile Compatibility Status");
  ensureSpace(300, "Structured Data & Social Tags");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const socialText = "Structured data and social tags improve the visibility of your content in search results and on social networks.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(socialText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const socialPercentage = Math.round(report.summary.pagesWithSocialTags / report.summary.totalPages * 100);
  const structuredDataPercentage = Math.round(report.summary.pagesWithStructuredData / report.summary.totalPages * 100);
  const socialData = [
    ["Type", "Status", "Details"],
    ["Social Tags", socialPercentage === 100 ? "Optimized" : "To Improve", `${socialPercentage}% of pages have social tags`],
    ["Structured Data", structuredDataPercentage === 100 ? "Optimized" : "To Improve", `${structuredDataPercentage}% of pages have structured data`]
  ];
  createTable(socialData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5"],
    columnWidths: [150, 150, 220]
  });
  ensureSpace(300, "Security Evaluation");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const securityText = "Security is essential for SEO and user trust. A secure site is better ranked by Google.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(securityText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const securePercentage = Math.round(report.summary.securePages / report.summary.totalPages * 100);
  const securityData = [
    ["Metric", "Status", "Details"],
    ["HTTPS", securePercentage === 100 ? "Secure" : "To Secure", `${securePercentage}% of pages`],
    ["SSL Certificate", report.summary.securePages === report.summary.totalPages ? "Valid" : "To Verify", "Required Configuration"]
  ];
  createTable(securityData, {
    headerColor: "#E3F2FD",
    rowColors: ["#FFFFFF", "#F5F5F5"],
    columnWidths: [150, 150, 220]
  });
  ensureSpace(400, "SEO Recommendations");
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").moveDown();
  const recommendationsText = "Here are the top priority recommendations to improve your site ranking and user experience. Start with critical points for the best results.";
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text(recommendationsText, 50, doc.y, { align: "left", width: 500 }).moveDown();
  const recommendations = [];
  if (report.summary.missingTitles > 0) {
    recommendations.push(`Add title tags to the ${report.summary.missingTitles} pages that are missing them.`);
  }
  if (report.summary.missingDescriptions > 0) {
    recommendations.push(`Add meta descriptions to the ${report.summary.missingDescriptions} pages that are missing them.`);
  }
  if (report.summary.missingAltTags > 0) {
    recommendations.push(`Add alt attributes to the ${report.summary.missingAltTags} images that are missing them.`);
  }
  if (report.summary.averageLCP > 2500) {
    recommendations.push("Improve the Largest Contentful Paint (LCP) by optimizing image loading and server response time.");
  }
  if (report.summary.pagesWithStructuredData < report.summary.totalPages) {
    recommendations.push("Add structured data (Schema.org) for better rich snippets in search results.");
  }
  if (report.summary.mobileCompatiblePages < report.summary.totalPages) {
    recommendations.push("Ensure all pages have appropriate viewport meta tags for mobile compatibility.");
  }
  if (report.summary.securePages < report.summary.totalPages) {
    recommendations.push("Migrate all pages to HTTPS for improved security and SEO ranking.");
  }
  if (report.summary.pagesWithSocialTags < report.summary.totalPages) {
    recommendations.push("Add Open Graph and Twitter Card tags for better sharing on social networks.");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Continue monitoring your site performance and making gradual improvements.",
      "Regularly check broken links and fix them quickly.",
      "Consider adding more quality content to improve authority and relevance."
    );
  }
  const recommendationsData = [
    ["Priority", "Recommendation"],
    ...recommendations.map((rec, index) => [
      index < 3 ? "High" : index < 6 ? "Medium" : "Low",
      rec
    ])
  ];
  createTable(recommendationsData, {
    headerColor: "#E3F2FD",
    columnWidths: [100, 400],
    rowColors: recommendations.map(
      (_, index) => index < 3 ? "#FFF3E0" : index < 6 ? "#E3F2FD" : "#E8F5E9"
    )
  });
  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#1976D2").text("Conclusion", { underline: true }).moveDown();
  doc.font("Helvetica").fontSize(12).fillColor("#000000").text("This SEO audit report provides a complete overview of your website. The proposed recommendations aim to improve your visibility in search engines and user experience.", { align: "left" }).moveDown().text("For optimal results, it is recommended to:", { align: "left" }).moveDown(0.5).text("\u2022 Implement the top priority recommendations first", { align: "left" }).text("\u2022 Regularly monitor your site performance", { align: "left" }).text("\u2022 Perform periodic SEO audits to track progress", { align: "left" }).text("\u2022 Stay up-to-date with the latest SEO trends and best practices", { align: "left" }).moveDown(2);
  doc.font("Helvetica").fontSize(10).fillColor("#666666").text("This report was automatically generated by the SEO audit tool.", { align: "center" }).text(`\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} DevUnity - All rights reserved`, { align: "center" });
  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
});

export { seoAudit_pdf_post as default };
//# sourceMappingURL=seo-audit.pdf.post.mjs.map
