import type { Actions } from './$types';
import { getUserTweets } from '$lib/server/core/scrap-twitter-user';
import stripTweetObject from '$lib/server/core/process-tweets';
import { analyzePersonality } from '$lib/server/core/analyze-personality';

export const actions: Actions = {
	analyze: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username') as string;

		if (!username) {
			return {
				success: false,
				error: 'Username is required'
			};
		}

		try {
			const rawUsername = username.replace('@', '');
			const rawTweets = await getUserTweets(username, 100, 100, { excludeReplies: false });
			const tweets = stripTweetObject(rawTweets);

			const analysis = await analyzePersonality(rawUsername, tweets);

			return {
				success: true,
				analysis
			};
		} catch (error) {
			console.error('Analysis error:', error);
			return {
				success: false,
				error: 'Failed to analyze profile. Please try again.'
			};
		}
	}
};
