import React from 'react';
import './bookmarks.css';
import NavBar from '../navBar/navbar';
import axiosInstance from '../axiosApi/axiosApi';
import Tweet, { ITweetData } from '../tweet/tweet';

const BookMarks: React.FC = () => {
  const [allTweets, setAllTweets] = React.useState([]);
  const [mediaTweets, setMediaTweets] = React.useState([]);
  const [rerender, setRerender] = React.useState<boolean>(false);
  const [state, setState] = React.useState<string>('loading');
  const [displayedTweets, setdisplayedTweets] = React.useState<string>(
    'AllTweets'
  );
  const getState = () => {
    const blinker =
      '<div class="spinner-grow text-info"></div> <div class="spinner-grow text-info"></div> <div class="spinner-grow text-info"></div>';
    const no_data = '<i>You dont have saved tweets Here</i>';
    if (state == 'loading') {
      $('#display_state').html(blinker);
    } else {
      $('#display_state').html(no_data);
      $('.spinner-grow').remove();
    }
  };
  getState();

  const forceRerender = () => {
    setRerender(!rerender);
  };

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
        setTimeout(() => {
          setState('no_data');
        }, 3000);
      })
      .catch(err => {
        console.error('Error in fetching data', err);
        setTimeout(() => {
          setState('no_data');
        }, 3000);
      });
  }, [rerender]);
  return (
    <div>
      <NavBar />
      <nav id='bookmarks_nav' className='navbar navbar-dark bg-primary'>
        <div
          onClick={() => {
            setState('loading');
            setdisplayedTweets('AllTweets');
            setTimeout(() => {
              setState('no_data');
            }, 3000);
          }}
          className='navbar-brand bookmarks_toggle'
        >
          All Tweets
        </div>
        <div
          onClick={() => {
            setState('loading');
            setdisplayedTweets('MediaTweets');
            setTimeout(() => {
              setState('no_data');
            }, 3000);
          }}
          className='navbar-brand bookmarks_toggle'
        >
          Media
        </div>
      </nav>
      {displayedTweets == 'AllTweets' ? (
        <div
          id='tweets_container'
          className='container bookmarks_tweet_container'
        >
          {allTweets.length == 0 ? (
            <p id='display_state' className='no_content'></p>
          ) : (
            allTweets.map((tweet, index) => {
              let tweet_data: ITweetData = tweet;
              return (
                <Tweet
                  key={index}
                  forceRerender={forceRerender}
                  tweet_data={tweet_data}
                />
              );
            })
          )}
        </div>
      ) : (
        <div
          id='tweets_container'
          className='container bookmarks_tweet_container'
        >
          {mediaTweets.length == 0 ? (
            <p id='display_state' className='no_content'></p>
          ) : (
            mediaTweets.map((tweet, index) => {
              let tweet_data: ITweetData = tweet;
              return (
                <Tweet
                  forceRerender={forceRerender}
                  key={index}
                  tweet_data={tweet_data}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BookMarks;
