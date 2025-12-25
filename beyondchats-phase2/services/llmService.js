const axios = require('axios');
const config = require('../config');

class LLMService {
  constructor() {
    this.provider = config.llm.provider;
  }

  /**
   * Call Google Gemini API (FREE)
   * @param {string} prompt - The prompt to send
   * @returns {Promise<string>} Generated text
   */
  async callGemini(prompt) {
    try {
      console.log('🤖 Calling Google Gemini API (FREE)...');
      
      if (!config.llm.gemini.apiKey || config.llm.gemini.apiKey.includes('your_') || config.llm.gemini.apiKey.includes('_here')) {
        throw new Error('Gemini API key not configured properly');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.llm.gemini.model}:generateContent?key=${config.llm.gemini.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: config.llm.gemini.temperature,
            maxOutputTokens: config.llm.gemini.maxTokens,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 90000
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const candidate = response.data.candidates[0];
        
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Content blocked by safety filters');
        }
        
        const generatedText = candidate.content.parts[0].text;
        console.log(`Gemini generated ${generatedText.length} characters`);
        return generatedText;
      }

      throw new Error('Invalid response from Gemini API');
      
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      throw error;
    }
  }

  /**
   * Generate optimized article based on reference articles
   * @param {Object} originalArticle - Original article object
   * @param {Array} referenceArticles - Array of reference articles
   * @returns {Promise<Object>} Optimized article data
   */
  async generateOptimizedArticle(originalArticle, referenceArticles) {
    try {
      console.log('Generating optimized article...');
      console.log(`Original: "${originalArticle.title}"`);
      console.log(`References: ${referenceArticles.length} articles`);

      let generatedContent = null;
      let usingAI = false;

      // Try to use AI
      try {
        const prompt = this.buildPrompt(originalArticle, referenceArticles);
        generatedContent = await this.callGemini(prompt);
        generatedContent = this.cleanGeneratedContent(generatedContent);
        usingAI = true;
        console.log('AI optimization successful');
      } catch (aiError) {
        console.warn('AI optimization failed:', aiError.message);
        console.log('Falling back to manual content enhancement...');
        
        // Fallback: Create enhanced content manually
        generatedContent = this.createFallbackContent(originalArticle, referenceArticles);
        usingAI = false;
        console.log('Manual content enhancement complete');
      }

      // Add references section
      const referencesSection = this.buildReferencesSection(referenceArticles, usingAI);
      const fullContent = `${generatedContent}\n\n${referencesSection}`;

      console.log('Article optimization complete');
      console.log(`Method: ${usingAI ? 'AI-Generated' : 'Manual Enhancement'}`);
      console.log(`Final content length: ${fullContent.length} characters`);

      return {
        title: originalArticle.title,
        content: fullContent,
        author: usingAI ? 'AI Optimizer' : 'Manual Optimizer',
        url: originalArticle.url,
        reference_article: [
          {
            reference_title: originalArticle.title,
            content: originalArticle.content,
            author: originalArticle.author,
            url: originalArticle.url
          }
        ]
      };

      
    } catch (error) {
      console.error('Error in article optimization:', error.message);
      
      // Last resort fallback - return original with references
      console.log('Using original content with references...');
      const referencesSection = this.buildReferencesSection(referenceArticles, false);
      const fallbackContent = this.createBasicFallbackContent(originalArticle);
      
      return {
        title: originalArticle.title,
        content: `${fallbackContent}\n\n${referencesSection}`,
        author: 'Original Content',
        url: originalArticle.url
      };
    }
  }

  /**
   * Create fallback content when AI fails
   * @param {Object} originalArticle - Original article
   * @param {Array} referenceArticles - Reference articles
   * @returns {string} Enhanced content
   */
  createFallbackContent(originalArticle, referenceArticles) {
    console.log('Creating enhanced content from references...');
    
    let content = `<h2>Introduction</h2>\n`;
    content += `<p>This article explores <strong>${originalArticle.title}</strong> `;
    content += `based on insights from industry-leading sources and best practices.</p>\n\n`;
    
    // Extract key points from reference articles
    content += `<h2>Key Insights</h2>\n`;
    content += `<p>Based on analysis of top-performing articles in this domain, we've identified `;
    content += `several important aspects:</p>\n\n`;
    
    content += `<ul>\n`;
    referenceArticles.forEach((article, index) => {
      const snippet = article.snippet || article.content.substring(0, 200);
      content += `  <li><strong>Insight ${index + 1}:</strong> ${snippet.replace(/<[^>]*>/g, '').substring(0, 150)}...</li>\n`;
    });
    content += `</ul>\n\n`;
    
    // Add comprehensive sections
    content += `<h2>Understanding the Fundamentals</h2>\n`;
    content += `<p>To fully grasp the concepts discussed in this article, it's essential to understand `;
    content += `the foundational elements. Industry experts emphasize the importance of a structured `;
    content += `approach when implementing these strategies.</p>\n\n`;
    
    content += `<h3>Core Principles</h3>\n`;
    content += `<p>The following principles form the backbone of effective implementation:</p>\n`;
    content += `<ol>\n`;
    content += `  <li><strong>Strategic Planning:</strong> Develop a clear roadmap for implementation</li>\n`;
    content += `  <li><strong>User-Centric Approach:</strong> Focus on delivering value to end users</li>\n`;
    content += `  <li><strong>Continuous Improvement:</strong> Regular optimization and refinement</li>\n`;
    content += `  <li><strong>Data-Driven Decisions:</strong> Use analytics to guide your strategy</li>\n`;
    content += `</ol>\n\n`;
    
    content += `<h2>Best Practices</h2>\n`;
    content += `<p>Leading organizations in this field follow proven methodologies that have demonstrated `;
    content += `consistent results. Here are the most effective practices:</p>\n\n`;
    
    content += `<h3>Implementation Strategy</h3>\n`;
    content += `<p>Success requires careful planning and execution. Consider these key factors:</p>\n`;
    content += `<ul>\n`;
    content += `  <li>Define clear objectives and success metrics</li>\n`;
    content += `  <li>Allocate appropriate resources and budget</li>\n`;
    content += `  <li>Establish a timeline with realistic milestones</li>\n`;
    content += `  <li>Build a capable team with relevant expertise</li>\n`;
    content += `  <li>Monitor progress and adjust as needed</li>\n`;
    content += `</ul>\n\n`;
    
    content += `<h2>Common Challenges and Solutions</h2>\n`;
    content += `<p>Organizations often encounter obstacles during implementation. Understanding these `;
    content += `challenges and their solutions can help ensure success:</p>\n\n`;
    
    content += `<h3>Overcoming Obstacles</h3>\n`;
    content += `<p><strong>Challenge 1: Resource Constraints</strong><br>\n`;
    content += `Solution: Start with a pilot program and scale gradually based on results.</p>\n\n`;
    
    content += `<p><strong>Challenge 2: User Adoption</strong><br>\n`;
    content += `Solution: Provide comprehensive training and ongoing support to all users.</p>\n\n`;
    
    content += `<p><strong>Challenge 3: Integration Issues</strong><br>\n`;
    content += `Solution: Choose solutions with robust APIs and strong vendor support.</p>\n\n`;
    
    content += `<h2>Measuring Success</h2>\n`;
    content += `<p>To ensure your implementation delivers value, track these key performance indicators:</p>\n`;
    content += `<ul>\n`;
    content += `  <li><em>Efficiency Metrics:</em> Time saved, cost reduction, productivity gains</li>\n`;
    content += `  <li><em>Quality Metrics:</em> Error rates, customer satisfaction, output quality</li>\n`;
    content += `  <li><em>Adoption Metrics:</em> User engagement, feature utilization, retention rates</li>\n`;
    content += `  <li><em>Business Impact:</em> ROI, revenue growth, competitive advantage</li>\n`;
    content += `</ul>\n\n`;
    
    content += `<h2>Future Outlook</h2>\n`;
    content += `<p>The landscape continues to evolve with emerging technologies and changing market `;
    content += `dynamics. Staying informed about trends and innovations will help you maintain a `;
    content += `competitive edge.</p>\n\n`;
    
    content += `<h2>Conclusion</h2>\n`;
    content += `<p>Successfully implementing <strong>${originalArticle.title}</strong> requires `;
    content += `careful planning, execution, and continuous optimization. By following the strategies `;
    content += `and best practices outlined in this article, you can achieve significant improvements `;
    content += `in your operations and deliver better outcomes for your organization.</p>\n`;
    
    return content;
  }

  /**
   * Create basic fallback content (last resort)
   * @param {Object} originalArticle - Original article
   * @returns {string} Basic content
   */
  createBasicFallbackContent(originalArticle) {
    let content = `<h2>${originalArticle.title}</h2>\n\n`;
    
    content += `<p>This article covers important information about <strong>${originalArticle.title}</strong>. `;
    content += `For the most comprehensive and up-to-date information on this topic, please visit the `;
    content += `original source at:</p>\n\n`;
    
    content += `<p><a href="${originalArticle.url}" target="_blank" rel="noopener noreferrer">${originalArticle.url}</a></p>\n\n`;
    
    content += `<p>This content has been preserved for reference purposes and includes citations to `;
    content += `related industry resources below.</p>\n`;
    
    return content;
  }

  /**
   * Build prompt for LLM
   * @param {Object} originalArticle - Original article
   * @param {Array} referenceArticles - Reference articles
   * @returns {string} Formatted prompt
   */
  buildPrompt(originalArticle, referenceArticles) {
    let referencesText = '';
    referenceArticles.forEach((article, index) => {
      const contentPreview = article.content.substring(0, 1500);
      referencesText += `\n--- REFERENCE ARTICLE ${index + 1} ---\n`;
      referencesText += `Title: ${article.title}\n`;
      referencesText += `URL: ${article.url}\n`;
      referencesText += `Content Preview: ${contentPreview}...\n`;
    });

    const prompt = `You are an expert content writer and SEO specialist. Your task is to rewrite and optimize an article to match the style, formatting, and quality of top-ranking articles.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
URL: ${originalArticle.url}

TOP-RANKING REFERENCE ARTICLES:
${referencesText}

YOUR TASK:
1. Analyze the formatting, structure, and writing style of the reference articles
2. Rewrite the article about "${originalArticle.title}" to match the style and quality of the top-ranking articles
3. Maintain the core topic and message
4. Use similar headings structure, paragraph length, and content organization as the references
5. Make the content engaging, informative, and SEO-friendly
6. Ensure the content is unique and not a direct copy
7. Use HTML formatting for better readability (h2, h3, p, ul, ol, strong, em tags)
8. Aim for a comprehensive article (at least 1200-1500 words)

FORMATTING REQUIREMENTS:
- Use proper HTML tags for structure (<h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em>)
- Include clear headings and subheadings
- Break content into readable paragraphs
- Use bullet points or numbered lists where appropriate
- Add emphasis with bold and italic text where needed
- Ensure the content flows naturally and is easy to read

OUTPUT REQUIREMENTS:
- Return ONLY the article content in HTML format
- Do NOT include the title in the output (it will be added separately)
- Do NOT include references section (it will be added automatically)
- Start directly with the article content
- Make sure all HTML tags are properly closed
- Write in a professional, engaging tone

Write the optimized article now:`;

    return prompt;
  }

  /**
   * Clean generated content
   * @param {string} content - Generated content
   * @returns {string} Cleaned content
   */
  cleanGeneratedContent(content) {
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    content = content.replace(/<title>.*?<\/title>/gi, '');
    content = content.replace(/<h1>.*?<\/h1>/gi, '');
    content = content.trim();
    return content;
  }

  /**
   * Build references section
   * @param {Array} referenceArticles - Reference articles
   * @param {boolean} usingAI - Whether AI was used
   * @returns {string} Formatted references section
   */
  buildReferencesSection(referenceArticles, usingAI = true) {
    let referencesHtml = '\n\n<hr>\n\n<h2>References & Sources</h2>\n';
    
    if (usingAI) {
      referencesHtml += '<p>This article was optimized using AI based on insights from the following top-ranking articles:</p>\n';
    } else {
      referencesHtml += '<p>This article incorporates insights from the following industry-leading sources:</p>\n';
    }
    
    referencesHtml += '<ol>\n';
    
    referenceArticles.forEach((article) => {
      referencesHtml += `  <li>\n`;
      referencesHtml += `    <strong>${article.title}</strong><br>\n`;
      referencesHtml += `    <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.url}</a>\n`;
      if (article.snippet) {
        referencesHtml += `    <br><em>${article.snippet.substring(0, 150)}...</em>\n`;
      }
      referencesHtml += `  </li>\n`;
    });
    
    referencesHtml += '</ol>\n\n';
    referencesHtml += '<p><small><em>Note: This content has been created to provide value while properly ';
    referencesHtml += 'attributing source materials. All referenced sources are credited above.</em></small></p>';
    
    return referencesHtml;
  }

  /**
   * Test LLM connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      console.log('Testing LLM connection...');
      const testPrompt = 'Say "Hello, I am working!" if you receive this message. Keep your response short.';
      const response = await this.callGemini(testPrompt);
      console.log(`Response: ${response.substring(0, 100)}...`);
      console.log('LLM connection successful');
      return true;
    } catch (error) {
      console.warn('LLM connection failed:', error.message);
      console.log('The tool will work with fallback content generation');
      return false;
    }
  }
}

module.exports = new LLMService();