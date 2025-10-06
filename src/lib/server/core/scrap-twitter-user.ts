import axios from 'axios';
import { logger } from '../../utils/logger';
import { TWAPI_BASE_URL, TWAPI_KEY } from '$env/static/private';

if (!TWAPI_BASE_URL || !TWAPI_KEY) throw new Error('Missing TWAPI_BASE_URL or TWAPI_KEY');

const api = axios.create({
	baseURL: TWAPI_BASE_URL,
	headers: { 'x-api-key': TWAPI_KEY },
	timeout: 15000
});

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

function isRetweet(t: any): boolean {
	const text = (t?.text || t?.full_text || t?.legacy?.full_text || '') as string;
	return !!t?.retweeted_tweet || !!t?.retweetedTweet || /^RT\s*@/i.test(text);
}

function isReply(t: any): boolean {
	return t?.isReply === true || t?.inReplyToId != null || t?.inReplyToUserId != null;
}

export async function getUserTweets(
	userName: string,
	max: number,
	pageDelayMs = 2000,
	opts?: { excludeQuotes?: boolean }
) {
	if (!userName) throw new Error('userName required');
	if (!Number.isFinite(max) || max <= 0) throw new Error('max must be > 0');

	const excludeQuotes = opts?.excludeQuotes ?? false;

	logger.info(
		`Fetching ${max} original tweets for user ${userName}${
			excludeQuotes ? ' (excluding quotes)' : ''
		}`
	);

	const out: any[] = [];
	let cursor = '';

	while (out.length < max) {
		logger.debug(`Fetching page with cursor: ${cursor || 'initial'}`);

		const { data } = await api.get('/twitter/user/last_tweets', {
			params: { userName, cursor }
		});

		const body = data?.data ?? data;
		const tweets: any[] = Array.isArray(body?.tweets) ? body.tweets : [];

		logger.debug(`Received ${tweets.length} tweets from API`);

		let originalCount = 0;
		for (const t of tweets) {
			if (isRetweet(t) || isReply(t)) continue;
			if (excludeQuotes && (t?.quoted_tweet || t?.is_quote_status === true)) continue;

			out.push(t);
			originalCount++;
			if (out.length >= max) break;
		}

		logger.debug(`Added ${originalCount} original tweets (total: ${out.length}/${max})`);

		if (!data?.has_next_page || !data?.next_cursor) {
			logger.info('No more pages available');
			break;
		}
		cursor = data.next_cursor as string;

		if (out.length < max) {
			logger.debug(`Waiting ${pageDelayMs}ms before next request`);
			await sleep(pageDelayMs);
		}
	}

	const result = out.slice(0, max);
	logger.success(`Successfully fetched ${result.length} original tweets for user ${userName}`);

	return result;
}
