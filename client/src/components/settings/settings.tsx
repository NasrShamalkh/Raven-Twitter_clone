import React from 'react';
import './settings.css';
import NavBar from '../navBar/navbar';
import {connect, useDispatch } from 'react-redux'
import {IUserData} from '../tweet/tweet'

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

  const dispatch = useDispatch();
  let imageInput = React.createRef<HTMLInputElement>();
  let backGroundImageInput = React.createRef<HTMLInputElement>();

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
                <button type="button" id="submit" name="submit" className="btn btn-primary">Update</button>
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
                      <button type="button" id="submit" name="submit" className="btn btn-secondary">Cancel</button>
                      <button type="button" id="submit" name="submit" className="btn btn-primary">Update</button>
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
