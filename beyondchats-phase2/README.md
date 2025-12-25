# Article Optimization & SEO Improvement Tool

A Node.js application that automatically optimizes articles by analyzing top-ranking content on Google and using AI to rewrite articles with better formatting, structure, and SEO.

## Features

- **Fetch Articles**: Retrieves articles from your Laravel API
- **Google Search**: Searches for top-ranking similar articles
- **Web Scraping**: Extracts content from competing articles
- **AI Optimization**: Uses Claude/GPT to rewrite articles with improved quality
- **Auto-Publishing**: Updates articles back to your Laravel database
- **Reference Citations**: Automatically adds citations to source articles

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running Laravel API (from Phase 1)
- API key for Claude (Anthropic) or OpenAI

## Installation

1. Navigate to the project directory:
```bash
cd article-optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Laravel API Configuration
LARAVEL_API_BASE_URL=http://127.0.0.1:8000/api

# Anthropic API Key for Claude
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: OpenAI (if you prefer GPT)
# OPENAI_API_KEY=your_openai_key_here
# LLM_PROVIDER=openai
```

## Getting API Keys

### Anthropic Claude API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### OpenAI API Key (Alternative)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## Usage

### Default Mode (Optimize Latest Article)
```bash
node index.js
```

### Optimize Specific Article
```bash
node index.js optimize 3
```

### Batch Optimize All Articles
```bash
node index.js batch
```

### Batch Optimize Specific Articles
```bash
node index.js batch 1 2 3 4 5
```

### Test All Services
```bash
node index.js test
```

### Show Help
```bash
node index.js help
```

## How It Works

### Workflow Steps

1. **Fetch Article**: Retrieves the target article from your Laravel API
2. **Google Search**: Searches for the article title on Google to find top-ranking similar content
3. **Scrape Content**: Extracts main content from the top 2 search results
4. **AI Analysis**: Sends original article and reference articles to LLM (Claude/GPT)
5. **Generate Optimized Version**: AI rewrites the article matching the style and structure of top-ranking content
6. **Add References**: Automatically appends citations to the source articles
7. **Publish**: Updates the article in your Laravel database via API

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         index.js                            │
│                    (Main Entry Point)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   articleOptimizer.js                       │
│                  (Orchestration Layer)                      │
└──┬──────────────┬──────────────┬──────────────┬────────────┘
   │              │              │              │
   ▼              ▼              ▼              ▼
┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐
│Laravel  │  │ Google  │  │ Scraper  │  │   LLM    │
│Service  │  │Service  │  │ Service  │  │ Service  │
└─────────┘  └─────────┘  └──────────┘  └──────────┘
```

## Project Structure

```
article-optimizer/
├── config.js                    # Configuration settings
├── index.js                     # Main entry point
├── articleOptimizer.js          # Main orchestration logic
├── services/
│   ├── laravelService.js        # Laravel API integration
│   ├── googleService.js         # Google search functionality
│   ├── scraperService.js        # Web scraping logic
│   └── llmService.js            # AI/LLM integration
├── package.json                 # Dependencies
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Dependencies

- **axios**: HTTP client for API requests
- **cheerio**: Fast HTML parser for web scraping
- **puppeteer**: Headless browser for dynamic content
- **dotenv**: Environment variable management

## Configuration Options

Edit `config.js` to customize:

- Laravel API endpoints
- LLM model selection
- Search result count
- Puppeteer options
- User agents

## Troubleshooting

### Laravel API Connection Issues
- Ensure your Laravel API is running
- Check the `LARAVEL_API_BASE_URL` in `.env`
- Verify API endpoints are accessible

### Google Search Failing
- Google may block automated searches
- Try adding delays between requests
- Use residential proxies if necessary

### Scraping Errors
- Some websites block scrapers
- Puppeteer will be used as fallback for JavaScript-heavy sites
- Check if the target site has anti-scraping measures

### LLM API Errors
- Verify your API key is correct
- Check if you have sufficient API credits
- Ensure you're using the correct model name

### Rate Limiting
- Add delays between batch operations
- Reduce the number of concurrent requests
- Check your API usage limits

## Best Practices

1. **Test First**: Always run `node index.js test` before optimization
2. **Start Small**: Test with one article before batch processing
3. **Monitor Costs**: Track your LLM API usage
4. **Backup Database**: Keep backups of original articles
5. **Review Output**: Manually review optimized content before publishing
6. **Rate Limits**: Add delays between batch operations

## Example Output

```
╔════════════════════════════════════════════════════════════════════╗
║           ARTICLE OPTIMIZATION & SEO IMPROVEMENT TOOL              ║
║                     Powered by AI & Web Scraping                   ║
╚════════════════════════════════════════════════════════════════════╝

======================================================================
🚀 STARTING ARTICLE OPTIMIZATION WORKFLOW
======================================================================

📍 STEP 1: Fetching Article from Laravel API
----------------------------------------------------------------------
✅ Retrieved article: "Chatbots Magic: Beginner's Guidebook"
   ID: 5
   URL: https://beyondchats.com/blogs/introduction-to-chatbots/

📍 STEP 2: Searching Google for Similar Articles
----------------------------------------------------------------------
🔍 Searching Google for: "Chatbots Magic: Beginner's Guidebook blog article"
✅ Found 2 relevant articles on Google
   1. The Ultimate Guide to Chatbots for Beginners
      URL: https://example.com/chatbot-guide
   2. Getting Started with Chatbots: A Complete Introduction
      URL: https://example.com/chatbot-intro

📍 STEP 3: Scraping Reference Articles
----------------------------------------------------------------------
[1/2] Scraping article...
📄 Scraping with Cheerio: https://example.com/chatbot-guide
   ✅ Scraped 3542 characters

[2/2] Scraping article...
📄 Scraping with Cheerio: https://example.com/chatbot-intro
   ✅ Scraped 2891 characters

✅ Successfully scraped 2 articles

📍 STEP 4: Generating Optimized Article with LLM
----------------------------------------------------------------------
🤖 Calling Claude API...
✅ Claude generated 4521 characters
✅ Generated optimized article
   Title: Chatbots Magic: Beginner's Guidebook
   Content length: 5234 characters

📍 STEP 5: Publishing Optimized Article
----------------------------------------------------------------------
📝 Updating article 5...
✅ Successfully updated article 5

======================================================================
🎉 OPTIMIZATION COMPLETE!
======================================================================

📊 SUMMARY:
   Original Article: "Chatbots Magic: Beginner's Guidebook"
   Article ID: 5
   Reference Articles Used: 2
   Generated Content Length: 5234 characters
   Status: Successfully Published

✨ The optimized article has been saved to your Laravel database!
======================================================================
```

## API Integration

### Laravel API Endpoints Used

- `GET /api/articles` - Fetch all articles
- `GET /api/articles/{id}` - Fetch specific article
- `PUT /api/articles/{id}` - Update article
- `POST /api/articles` - Create article (optional)
- `DELETE /api/articles/{id}` - Delete article (optional)

### Expected API Response Format

```json
{
  "status": true,
  "data": {
    "id": 5,
    "title": "Article Title",
    "content": "Article content...",
    "author": "Author Name",
    "url": "https://example.com/article",
    "created_at": "2025-12-21T19:41:37.000000Z",
    "updated_at": "2025-12-21T19:41:37.000000Z"
  }
}
```

## Advanced Usage

### Custom Configuration

Create a custom config by modifying `config.js`:

```javascript
module.exports = {
  laravelApi: {
    baseUrl: 'http://your-api-url.com/api',
    // ... other settings
  },
  llm: {
    provider: 'anthropic', // or 'openai'
    anthropic: {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 4000
    }
  }
};
```

### Programmatic Usage

```javascript
const articleOptimizer = require('./articleOptimizer');

// Optimize latest article
await articleOptimizer.optimize();

// Optimize specific article
await articleOptimizer.optimize(3);

// Batch optimize
await articleOptimizer.optimizeMultiple([1, 2, 3]);

// Test services
await articleOptimizer.testServices();
```

## Contributing

Feel free to submit issues or pull requests for improvements.

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages carefully
3. Ensure all prerequisites are met
4. Test individual services with `node index.js test`

## Notes

- This tool is designed for educational and legitimate SEO purposes
- Respect robots.txt and website terms of service
- Be mindful of API rate limits and costs
- Always review AI-generated content before publishing
- Keep your API keys secure and never commit them to version control