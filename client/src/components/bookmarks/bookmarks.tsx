import React from 'react';
import './bookmarks.css';
import NavBar from '../navBar/navbar';
import axiosInstance from '../axiosApi/axiosApi';
import Tweet, { ITweetData } from '../tweet/tweet';

const BookMarks: React.FC = () => {
  const [allTweets, setAllTweets] = React.useState([]);
  const [mediaTweets, setMediaTweets] = React.useState([]);
  const [displayedTweets, setdisplayedTweets] = React.useState<string>(
    'AllTweets'
  );

  React.useEffect(() => {
    axiosInstance
      .get('api/tweets/get_saved_tweets/')
      .then(res => {
        let data = res.data;
        setAllTweets(data);
        const media_tweets = data.filter((tweet, index) => {
          return tweet.media;
        });
        setMediaTweets(media_tweets);
      })
      .catch(err => {
        console.log('Error in fetching data');
      });
  }, []);
  return (
    <div>
      <NavBar />
      <nav id='bookmarks_nav' className='navbar navbar-dark bg-primary'>
        <div
          onClick={() => {
            setdisplayedTweets('AllTweets');
          }}
          className='navbar-brand bookmarks_toggle'
        >
          All Tweets
        </div>
        <div
          onClick={() => {
            setdisplayedTweets('MediaTweets');
          }}
          className='navbar-brand bookmarks_toggle'
        >
          Media
        </div>
      </nav>
      {displayedTweets == 'AllTweets' ? (
        <div id='tweets_container' className='container bookmarks_tweet_container'>
          {allTweets.length == 0 ? (
            <p className='no_content'>
              <i>Looks Like you haven't saved any Tweets</i>
            </p>
          ) : (
            allTweets.map((tweet, index) => {
              let tweet_data: ITweetData = tweet;
              return <Tweet key={index} tweet_data={tweet_data} />;
            })
          )}
        </div>
      ) : (
        <div id='tweets_container' className='container bookmarks_tweet_container'>
          {mediaTweets.length == 0 ? (
            <p className='no_content'>
              <i>You don't have saved tweets with media</i>
            </p>
          ) : (
            mediaTweets.map((tweet, index) => {
              let tweet_data: ITweetData = tweet;
              return <Tweet key={index} tweet_data={tweet_data} />;
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BookMarks;
