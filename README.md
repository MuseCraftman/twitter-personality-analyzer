# Twitter Personality Analyzer

A web application that uses AI and `twitterapi.io` to scrape and analyze Twitter profiles, determining personality traits from tweet data.

## Installation

1. Clone this repository:

```sh
git clone <repository-url>
cd twitter-personality-analyzer
```

2. Install dependencies:

```sh
pnpm install
```

3. Set up your environment variables (create a `.env` file):

```
TWAPI_KEY=your_twitter_api_key
TWAPI_BASE_URL=https://api.twitterapi.io
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:

```sh
npm run dev
```

## Features

- Scrape Twitter data using twitterapi.io
- Analyze Twitter profiles using AI
- Extract personality insights from tweets
