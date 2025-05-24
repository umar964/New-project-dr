import React, { useState,useContext } from 'react';
import styled from 'styled-components';
import { Link,useNavigate} from 'react-router-dom';
import axios from 'axios'
import { UserContext } from '../context/UserContext';


const Userlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setuserData] = useState({})
   const navigate = useNavigate()
   const{ user,setUser} = useContext(UserContext); 
  const submitHandler = async(e)=>{
    e.preventDefault();
    const userData = {
      email:email,
      password:password
    }
    const responce = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData);

    if(responce.status === 200){
      const data = responce.data;
     
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem('userToken',data.userToken);
      localStorage.setItem("userId", data.user._id);
      
      navigate('/');
    }


     setEmail('')
     setPassword('')

     

  }
  return (
    <StyledWrapper>
        <div className="main">
        <div className="content">
        <div className="text">
          Login
        </div>
        <form onSubmit={submitHandler}  >
          <div className="field">
            <input value={email} 
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            required
             type="email"
              className="input" />
            <span className="span"><svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20"><path fill="#595959" d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" /></svg></span>
            <label className="label">Email </label>
          </div>
          <div className="field">
            <input 
            required
            value={password} 
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
             type="password" className="input" />
            <span className="span"><svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20"><path fill="#595959" d="M336 192h-16v-64C320 57.406 262.594 0 192 0S64 57.406 64 128v64H48c-26.453 0-48 21.523-48 48v224c0 26.477 21.547 48 48 48h288c26.453 0 48-21.523 48-48V240c0-26.477-21.547-48-48-48zm-229.332-64c0-47.063 38.27-85.332 85.332-85.332s85.332 38.27 85.332 85.332v64H106.668zm0 0" /></svg></span>
            <label className="label">Password</label>
          </div>
          <div className="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
          <button className="button">Sign in</button>
          <div className="sign-up">
            Not a member?
            <Link to="/usersignup">Sign up now</Link>
                
          </div>
        </form>
        <div>
        <button id='drbutton' className="button"><Link to = '/drlogin' id='drlink'>Sign in as Doctor</Link></button>
        </div>
      </div>
        </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
 
  .main {
   
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 100vh;
   
   padding-bottom: 30px;
   box-sizing: border-box;  /* Ensures padding is included inside the element’s size */
}

  .content {
    width: 98%;
    max-width: 340px;
    padding: 40px 50px;
   
    border-radius: 15px;
    box-shadow: -8px -3px 7px #ffffff73,8px -3px 7px #ffffff73,
    -8px 8px 7px #ffffff73, 2px 2px 5px rgba(94,104,121,0.288);
   
   
  }

  .content .text {
    font-size: 33px;
    font-weight: 600;
    margin-bottom: 35px;
    color: #595959;
    text-align: center;
  }

  .field {
    height: 50px;
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 30px;
  }

  .field .input {
    height: 100%;
    width: 100%;
    padding-left: 45px;
    outline: none;
    border: none;
    font-size: 18px;
    background: #dde1e7;
    color: #595959;
    border-radius: 25px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #ffffff73;
  }

  .field .input:focus {
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #ffffff73;
  }

  .field .span {
    position: absolute;
    color: #595959;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  .field .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 45px;
    pointer-events: none;
    color: #666666;
    transition: all 0.3s ease;
  }

  .field .input:focus ~ .label,
  .field .input:valid ~ .label {
    opacity: 0;
    transform: translateY(-30px);
  }

  .forgot-pass {
    text-align: left;
    margin: 10px 0;
  }

  .forgot-pass a {
    font-size: 16px;
    color: #666666;
    text-decoration: none;
  }

  .forgot-pass:hover a {
    text-decoration: underline;
  }

 .button {
  margin: 15px 0;
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  background: #dde1e7;
  border-radius: 25px;
  border: none;
  outline: none;
  cursor: pointer;
  color: #595959;
  box-shadow: 2px 2px 5px #BABECC, -5px -5px 10px #ffffff73;

   
  display: flex;
  justify-content: center;
  align-items: center;

  
  text-align: center;
}

#drbutton {
  
  background:rgb(53, 236, 69);
 
  color: black;
  margin-top: 100px;
  margin-bottom:-15px;
  

 
}

#drlink{
color:black;
 font-size: 17px;
  font-weight: 600;
}
  #drbutton:hover{
  opacity:0.8;
  }

  .button:focus {
    color: rgb(53, 236, 69) ;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #ffffff73;
  }

  .sign-up {
    margin: 10px 0;
    color: #595959;
    font-size: 16px;
    text-align: center;
  }

  .sign-up a {
    color: rgb(53, 236, 69);
    text-decoration: none;
  }

  .sign-up a:hover {
    text-decoration: underline;
  }

  /* Media Queries for Responsiveness */
  @media (max-width: 768px) {
    .content {
      max-width: 98%;
      padding: 30px;
    }

    .content .text {
      font-size: 28px;
    }

    .field .input {
      font-size: 16px;
    }

    .button {
      font-size: 16px;
      height: 45px;
    }
  }

  @media (max-width: 480px) {
    .content {
    
      max-width: 98%;
      padding: 20px;
    }

    .content .text {
      font-size: 24px;
    }

    .field .input {
      font-size: 14px;
    }

    .button {
      font-size: 14px;
      height: 40px;
    }
  }
`;

export default Userlogin;





 

 
