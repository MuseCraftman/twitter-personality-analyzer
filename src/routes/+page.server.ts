import type { Actions } from './$types';
import { getUserTweets } from '$lib/server/core/scrap-twitter-user';
import stripTweetObject from '$lib/server/core/process-tweets';

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
			const rawTweets = await getUserTweets(username, 100, 200);
			const tweets = stripTweetObject(rawTweets);

			console.log(JSON.stringify(tweets, null, 2));

			const mockAnalysis = {
				username: rawUsername,
				personalityTraits: {
					openness: 0.75,
					conscientiousness: 0.68,
					extraversion: 0.82,
					agreeableness: 0.71,
					neuroticism: 0.45
				},
				summary: `Based on the analysis of @${rawUsername}'s tweets, this user shows high levels of extraversion and openness to experience. They tend to be outgoing and creative, with moderate conscientiousness and agreeableness. Their neuroticism levels are relatively low, suggesting emotional stability.`,
				keyInsights: [
					'Highly social and engaging online presence',
					'Creative and open to new ideas',
					'Generally positive emotional tone',
					'Active in community discussions'
				]
			};

			return {
				success: true,
				analysis: mockAnalysis
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
