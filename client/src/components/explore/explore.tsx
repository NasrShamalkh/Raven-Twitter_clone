import React from 'react';
import './explore.css';
import NavBar from '../navBar/navbar';
import axiosInstance from '../axiosApi/axiosApi';
import $ from 'jquery';
import Tweet, { ITweetData } from '../tweet/tweet';
import ProfileBrief, {
  IProfileBrief,
  S_ProfileBrief
} from '../profileBrief/profileBrief';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions';

const Explore: React.FC = () => {
  const [displayed, setDisplayed] = React.useState<Array<ITweetData>>([]);
  const [popular, setPopular] = React.useState<Array<IProfileBrief>>([]);
  const [state, setState] = React.useState<string>('loading');
  const [rerender, setRerender] = React.useState<boolean>(false);
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [searchResult, setSearchResult] = React.useState<Array<IProfileBrief>>(
    []
  );
  const [displayType, setDisplayType] = React.useState<string>('');
  const dispatch = useDispatch();

  React.useEffect(() => {
    setDisplayType('tweets');
    axiosInstance
      .get('api/tweets/get_top/')
      .then(res => {
        setDisplayed(res.data);
        setState('done');
      })
      .catch(err => console.error('Error in gettin top data', err));

    axiosInstance
      .get('api/profiles/most_popular/')
      .then(res => {
        setPopular(res.data);
        setState('done');
      })
      .catch(err => console.error('Error in getting most_popular', err));
  }, [rerender]);

  const get_media = () => {
    axiosInstance
      .get('api/tweets/get_explore_media/')
      .then(res => {
        setDisplayed(res.data);
        setState('done');
      })
      .catch(err => console.log('Errror in getting Media data', err));
  };

  const get_latest = () => {
    axiosInstance
      .get('api/tweets/get_latest/')
      .then(res => {
        setDisplayed(res.data);
        setState('done');
      })
      .catch(err => console.log('Errror in getting Latest data', err));
  };

  const forceRerender = () => {
    setRerender(!rerender);
  };

  const handleSearch = () => {
    setDisplayType('profiles');
    setSearchInput('');
    axiosInstance
      .post('api/profiles/search/', {
        search_input: searchInput
      })
      .then(res => {
        setSearchResult(res.data);
        setState('done');
      })
      .catch(err => console.error('Error in searching profiles', err));
  };

  return (
    <div>
      <NavBar />
      <div className='explore_main_dev'>
        <div
          className='left explor_sidebar sidebar'
          style={{
            marginTop: '0'
          }}
        >
          <div
            style={{
              height: '400px',
              marginTop: '49px'
            }}
          >
            <hr className='hr_elem' />
            <a
              onClick={() => {
                setDisplayType('tweets');
                setState('loading');
                $('#top').addClass('active');
                $('#latest').removeClass('active');
                $('#media').removeClass('active');

                setRerender(!rerender);
              }}
              id='top'
              className='side_nav_elem side_nav_elem_exp active'
            >
              Top{' '}
            </a>
            <hr className='hr_elem' />
            <a
              onClick={() => {
                setDisplayType('tweets');
                setState('loading');
                get_latest();
                $('#top').removeClass('active');
                $('#latest').addClass('active');
                $('#media').removeClass('active');
              }}
              id='latest'
              className='side_nav_elem side_nav_elem_exp '
            >
              Latest{' '}
            </a>
            <hr className='hr_elem' />
            <a
              onClick={() => {
                setDisplayType('tweets');
                setState('loading');
                get_media();
                $('#top').removeClass('active');
                $('#latest').removeClass('active');
                $('#media').addClass('active');
              }}
              id='media'
              className='side_nav_elem side_nav_elem_exp'
            >
              Media{' '}
            </a>
            <hr className='hr_elem' />
            <hr
              style={{
                height: '20px',
                border: '5px'
              }}
              className='hr_elem'
            />
            <hr className='hr_elem' />
          </div>
        </div>
        <div className='container explore_container'>
          <div className='explore_fixed_div'>
            <div className='searchForm '>
              <input
                aria-label='Search'
                className='form-control search'
                type='text'
                placeholder='Search... alias / @username'
                name='search'
                value={searchInput}
                autoComplete='off'
                onChange={e => {
                  setSearchInput(e.target.value);
                }}
              />
              <button id='search_button' onClick={handleSearch} type='button'>
                <i className='fa fa-search'></i>
              </button>
              <hr />
            </div>
          </div>
          <div className='explore_content'>
            {state == 'done' && displayType !== 'profiles' ? (
              displayed.map((tweet, index) => {
                let tweet_data: ITweetData = tweet;
                return (
                  <Tweet
                    key={index}
                    tweet_data={tweet_data}
                    forceRerender={forceRerender}
                  />
                );
              })
            ) : state == 'done' && displayType == 'profiles' ? (
              searchResult.length > 0 ? (
                searchResult.map((profile, index) => {
                  return (
                    <Link
                      onClick={() => {
                        dispatch(actions.setShowProfileId(profile.user_id));
                      }}
                      to='/profile'
                    >
                      <ProfileBrief key={index} {...profile} />
                    </Link>
                  );
                })
              ) : (
                <p>No search results</p>
              )
            ) : (
              <div id='display_state'>
                <div className='spinner-grow text-info'></div>{' '}
                <div className='spinner-grow text-info'></div>{' '}
                <div className='spinner-grow text-info'></div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: '0'
          }}
          className='right explor_sidebar sidebar'
        >
          <h3
            style={{
              textAlign: 'center'
            }}
          >
            <i>Most popular</i>
          </h3>
          <div
            id='side_content'
            style={{
              height: '80%',
              border: '1px solid black',
              borderRadius: '10px',
              overflow: 'auto'
            }}
          >
            {popular.map((profile, index) => {
              return <S_ProfileBrief key={index} {...profile} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
