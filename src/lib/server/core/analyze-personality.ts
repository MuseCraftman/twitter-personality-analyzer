import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { logger } from '../../utils/logger';

const client = new OpenAI({ apiKey: OPENAI_API_KEY! });

const GENERATOR_SYSTEM = `
You are an expert personality analyst. You analyze a user's tweets and infer Big Five personality traits.

Style and tone:
- Be witty and playful. Include light-hearted, roasting.
- Punch up the humor with clever phrasing, but stay respectful.

Your task:
- Given a username and an array of their tweet texts, produce ONE JSON object with the following exact shape:
{
  "username": string,
  "personalityTraits": {
    "openness": number,          // 0.00 - 1.00
    "conscientiousness": number, // 0.00 - 1.00
    "extraversion": number,      // 0.00 - 1.00
    "agreeableness": number,     // 0.00 - 1.00
    "neuroticism": number        // 0.00 - 1.00
  },
  "summary": string,             // <= 120 words, concise, human-readable, roasted
  "keyInsights": string[]        // 3-6 short insights; allow playful roast one-liners
}

Rules:
- Output ONLY valid JSON (no markdown, no surrounding text).
- Keep all trait numbers between 0 and 1 inclusive, formatted to two decimals (e.g., 0.73).
- Base your analysis strictly on the provided tweets. If signal is weak, still return the structure and reflect uncertainty in the summary.
`;

export type TweetsPayload = string[];
export type AnalysisResult = {
	username: string;
	personalityTraits: {
		openness: number;
		conscientiousness: number;
		extraversion: number;
		agreeableness: number;
		neuroticism: number;
	};
	summary: string;
	keyInsights: string[];
};

export async function analyzePersonality(
	username: string,
	tweets: TweetsPayload
): Promise<AnalysisResult> {
	logger.info(`Analyzing personality for @${username} using ${tweets.length} tweets`);
	const start = Date.now();
	const res = await client.chat.completions.create({
		model: 'gpt-4o',
		response_format: { type: 'json_object' },
		messages: [
			{ role: 'system', content: GENERATOR_SYSTEM },
			{ role: 'user', content: JSON.stringify({ username: username, tweets: tweets }) }
		],
		temperature: 0.55
	});

	const content = res.choices?.[0]?.message?.content ?? '{}';
	logger.success(`Analysis complete for @${username} in ${Date.now() - start}ms`);
	return JSON.parse(content) as AnalysisResult;
}
