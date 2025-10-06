export type TweetLike = {
	text: string;
	[key: string]: unknown;
};

export function stripTweetObject(tweets: TweetLike[]): string[] {
	if (!Array.isArray(tweets)) return [];

	return tweets
		.map((tweet) => (typeof tweet.text === 'string' ? tweet.text.trim() : ''))
		.filter((value) => value.length > 0);
}

export default stripTweetObject;
