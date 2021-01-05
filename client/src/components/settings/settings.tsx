import React from 'react';
import './settings.css';
import NavBar from '../navBar/navbar';
import {connect, useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import {IUserData} from '../tweet/tweet'
import { Redirect } from 'react-router-dom'
import axiosInstance from '../axiosApi/axiosApi'
import axios from 'axios'
interface _IUserData extends IUserData {
  email: string
  bio: string | null
}
interface Props {
  user_data: _IUserData
}
const Settings: React.FC<Props> = (props: Props) => {
  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [alias, setAlias] = React.useState<string>('');
  const [bio, setBio] = React.useState<string>('');
  const [currentPassword, setCurrentPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [finished, setFinished] = React.useState<boolean>(false);
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [backgroundImageUrl, setbackgroundImageUrl] = React.useState<string>('')
  const [ redirect, setRedirect ] = React.useState<string>('')
  const [ rerender, setRerender ] = React.useState<boolean>(false)
  const [ upload1_finish, set_upload1_finish ] = React.useState(false)
  const [ upload2_finish, set_upload2_finish ] = React.useState(false)
  const [ profile_image_input_state, set_profile_image_input_state] =  React.useState<boolean | File>(false)
  const [ background_image_input_state, set_background_image_input_state] = React.useState<boolean | File>(false)

  const dispatch = useDispatch();
  let imageInput = React.createRef<HTMLInputElement>();
  let backGroundImageInput = React.createRef<HTMLInputElement>();


  

  const updateProfile = () => {
    const profile_image_input = imageInput.current.files[0] || false;  
    set_profile_image_input_state(profile_image_input)
    const background_image_input = backGroundImageInput.current.files[0] || false;
    set_background_image_input_state(background_image_input)
    if(!alias && !bio && !profile_image_input && !background_image_input) {
      alert('Nothing to update !')
      return;
    }
    /// --------------- upload1  --------------- ///
    if(profile_image_input) {
      const profile_image_form_data = new FormData();
      profile_image_form_data.append('file', profile_image_input);
      profile_image_form_data.append('upload_preset', 'ravenapp');
      axios
        .post(
          'https://api.Cloudinary.com/v1_1/nasr-cloudinary/image/upload',
          profile_image_form_data
        )
        .then(res => {
          setImageUrl(res.data.url);
          set_upload1_finish(true)
          console.log('upload 1 finished ')
        }).catch(err => {
          console.log('Error in upload 1', err)
        })
      }else {
        set_upload1_finish(true)
        console.log('NO upload 1')
      }
   

      //--------------upload 2 -------- ---- ///
      if(background_image_input) {
        const background_image_form_data = new FormData();
        background_image_form_data.append('file', background_image_input);
        background_image_form_data.append('upload_preset', 'ravenapp');
        axios
          .post(
            'https://api.Cloudinary.com/v1_1/nasr-cloudinary/image/upload',
            background_image_form_data
          )
          .then(res => {
            setbackgroundImageUrl(res.data.url);
            set_upload2_finish(true)
            console.log('Upload 2 fininshed ')
          })
          .catch(err => {
            console.error('Error in upload 2')
          })
      }else {
        set_upload2_finish(true)
        console.log('No upload 2')
      }
  }
  if(upload1_finish && upload2_finish) {
    set_upload1_finish(false)
    set_upload2_finish(false)
    const porfile_data = {
      alias: alias,
      bio: bio,
      image_url: imageUrl,
      background_image_url: backgroundImageUrl,
    }
    var profile_put_data = {}

    for(var key in porfile_data) {
      if(porfile_data[key]) {
        profile_put_data[key] = porfile_data[key]
      }
    }
    console.log(profile_put_data)
    axiosInstance.put('api/profiles/edit/', profile_put_data)
    .then(res => {
      dispatch(actions.setCurrentUser(res.data))
      setRerender(!rerender)
      alert('Profile Data Updated !')
    })
    .catch(err => {
      console.error('Error in updating profile', err)
     console.log(err.response)
    })
  }


  const updateUser = () => {
    let data = {
      username: username,
      email: email,
      current_password: currentPassword,
      new_password: newPassword
    }

    if(!username && !email && !newPassword && !currentPassword) {
      alert('Cant update Empty')
      return;
    }
    var put_data = {}
    for (var key in data) {
      if(data[key]) {
        put_data[key] = data[key]
      }
    }
    if(newPassword !== '') {
      put_data['update_password'] = true
    }
    if((newPassword && !currentPassword) || (currentPassword && !newPassword)) {
      alert('Please add the missing fields')
      return;
    }

    axiosInstance.put('api/auth/user/edit/', put_data)
    .then(res => {
      if (res.status === 202) {
        dispatch(actions.setCurrentUser(res.data))
      }else if (res.status === 401) {
        alert('Wrong password')
        return;
      }
      setRerender(!rerender)
      alert('User Data Updated !')
    })
    .catch(err => {
      if (err.status === 401) {
        alert('Wrong password')
        return;
      }
      alert('Please check your data')
      console.error('Error in updating user data', err)
    })
    console.log(put_data)
  }
  if(redirect) {
    return <Redirect to={redirect} />
  }

  return (
    <div>
      <NavBar />
      <div className="container-lg">
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar">
                      <img src={props.user_data.image_url ? props.user_data.image_url: props.user_data.defaultProfileImage} alt="..." />
                    </div>
                    <h5 className="user-name"><i className='fas fa-at'></i> {' '}{props.user_data.username}</h5>
                    <h6 className="user-alias">{props.user_data.alias ? props.user_data.alias: <small>(no alias)</small>}</h6>
                    <h6 className="user-email">{props.user_data.email}</h6>
                  </div>
                  <div className="bio">
                    <h5 className="mb-2 text-primary">Bio</h5>
                    <p>{props.user_data.bio? props.user_data.bio: <small>(no bio)</small>}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h5 className="mb-3 text-primary">Profile</h5>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="alias">Alias</label>
                      <input value={alias} onChange={(e) => {
                        setAlias(e.target.value)
                      }} type="text" className="form-control" id="alias" placeholder="Enter full Alias" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="bio">Bio</label>
                      <input value={bio} onChange={(e) => {
                        setBio(e.target.value)
                      }} type="text" className="form-control" id="bio" placeholder="Enter new Bio" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="profile_image">Profile image</label>
                      <label id='uploadImageLable' className='btn btn-default'>
                <img
                  id='image_icon'
                  src='http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608923986/Raven%20App/Sed-16-512_nrkb3v.png'
                />{' '}
                      <input ref={imageInput} hidden type="file" className="form-control" id="profile_image" />
                      </label>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="background_image">Background image</label>
                      <label id='uploadImageLable' className='btn btn-default'>
                <img
                  id='image_icon'
                  src='http://res.cloudinary.com/nasr-cloudinary/image/upload/v1608923986/Raven%20App/Sed-16-512_nrkb3v.png'
                />{' '}
                      <input ref={backGroundImageInput} type="file" className="form-control" id="background_image" hidden />
                      </label>
                    </div>
                  </div>
                </div>
                <button onClick={updateProfile} type="button" id="submit" name="submit" className="btn btn-primary">Update Profile</button>
                <hr  style={{
                  height: '7px',
                  zIndex: 2,
                  backgroundColor: 'grey',
                  borderRadius: '5px',
                }}/>
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 className="mb-3 text-primary">User Generals</h6>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input value={username} onChange={(e) => {
                        setUsername(e.target.value)
                      }} type="name" className="form-control" id="username" placeholder="Enter Username" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input value={email} onChange={(e) => {
                        setEmail(e.target.value)
                      }} type="email" className="form-control" id="email" placeholder="Email" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="current_password">Current Password</label>
                      <input value={currentPassword} onChange={(e) => {
                        setCurrentPassword(e.target.value)
                      }} type="password" className="form-control" id="current_password" placeholder="Enter Current password" />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input value={newPassword} onChange={(e) => {
                        setNewPassword(e.target.value)
                      }} type="password" className="form-control" id="newPassword" placeholder="Enter new Password"  pattern='(?=.*\d)(?=.*[a-z]).{8,30}$'
                        title='Must contain at least one number and one lowercase letter, and (8-30) characters' />
                    </div>
                  </div>
                </div>
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right">
                      <button onClick={() => {
                        setRedirect('/home')
                      }} type="button" id="submit" name="submit" className="btn btn-secondary">Cancel</button>
                      <button onClick={updateUser} type="button" id="submit" name="submit" className="btn btn-primary">Update User</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const user_data = {
    user_id: state.current_user_reducer.user_id,
    profile_id: state.current_user_reducer.profile_id,
    username: state.current_user_reducer.username,
    email: state.current_user_reducer.email,
    bio: state.current_user_reducer.bio,
    image_url: state.current_user_reducer.image_url,
    alias: state.current_user_reducer.alias,
    mode: state.current_user_reducer.mode,
    defaultProfileImage: state.current_user_reducer.defaultProfileImage
  };
  return { user_data };
}
export default connect(mapStateToProps, null)(Settings);
