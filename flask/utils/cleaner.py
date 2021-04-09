from nltk.corpus import stopwords
import emoji


def clean_tweet(tweet_df):
    # Emoji
    tweet_df['text'] = tweet_df['text'].str.replace(emoji.get_emoji_regexp(),
                                                    '', regex=True)
    # Hashtags
    tweet_df['text'] = tweet_df['text'].str.replace(r'#(\w+)',
                                                    '', regex=True)
    # Mentions
    tweet_df['text'] = tweet_df['text'].str.replace(r'@(\w+)',
                                                    '', regex=True)
    # URLS
    tweet_df['text'] = tweet_df['text'].str.replace(r'http\S+',
                                                    '', regex=True)

    # Remove Retweets
    tweet_df['text'] = tweet_df['text'].str.replace(r'^rt :', '', regex=True)

    return tweet_df


def remove_stopwords(tweet_df):
    dutch_stopwords = stopwords.words('dutch')

    # Remove Dutch stopwords and convert to lowercase
    tweet_df['text'] = tweet_df['text'].apply(
        lambda x: ' '.join(
            word.lower() for word in x.split()
            if word.lower() not in dutch_stopwords
        )
    )

    return tweet_df
