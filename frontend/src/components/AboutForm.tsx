import React from 'react';
import styled from 'styled-components';

const AboutForm = () => {
  return (
    <StyledWrapper>
      <center>
      <form className="form">
        <p className="title">About </p>
        <p className="message"></p>
        <div className="flex">
        </div>
         <label>
            <input required placeholder='' type="text" className="input" />
            <span>Company Name</span>
          </label>  
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Location</span>
        </label> 
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Established Year</span>
        </label>
        <label>
          <input required placeholder='' type="email" className="input" />
          <span>Email</span>
        </label>
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Contact</span>
        </label>
        <button className="submit">Submit</button>
      </form>
      </center>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 1000px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    position: relative;
  }

  .title {
    font-size: 28px;
    color: black;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }

  .title::before,.title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: black;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: black;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message, .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: black;
  }

  .signin a:hover {
    text-decoration: underline black;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,.form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .form label .input:valid + span {
    color: green;
  }

  .submit {
    border: none;
    outline: none;
    background-color: black;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
  }

  .submit:hover {
    background-color: rgb(56, 90, 194);
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }`;

export default AboutForm;




/*import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <center>
      <form className="form">
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our website. </p>
        <div className="flex">
          <label>
            <input className="input" type="text" placeholder=' ' required />
            <span>Firstname</span>
          </label>
          <label>
            <input className="input" type="text" placeholder='' required />
            <span>Lastname</span>
          </label>
        </div>  
        <label>
          <input className="input" type="email" placeholder='' required />
          <span>Email</span>
        </label> 
        <label>
          <input className="input" type="password" placeholder='' required />
          <span>Password</span>
        </label>
        <label>
          <input className="input" type="password" placeholder='' required />
          <span>Confirm password</span>
        </label>
        <button className="submit">Submit</button>
        <p className="signin">Already have an acount ? <a href="#">Signin</a> </p>
      </form>
      </center>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 1000px;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #00bfff;
  }

  .message, 
  .signin {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signin {
    text-align: center;
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .signin a {
    color: #00bfff;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 250px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 05px 05px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .input {
    font-size: medium;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-color: #00bfff;
  }

  .submit:hover {
    background-color: #00bfff96;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }`;

export default Form;



/*import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <section className="container">
        <header>Registration Form</header>
        <form className="form" action="#">
          <div className="input-box">
            <label>Full Name</label>
            <input required placeholder="Enter full name" type="text" />
          </div>
          <div className="column">
            <div className="input-box">
              <label>Phone Number</label>
              <input required placeholder="Enter phone number" type="telephone" />
            </div>
            <div className="input-box">
              <label>Birth Date</label>
              <input required placeholder="Enter birth date" type="date" />
            </div>
          </div>
          <div className="gender-box">
            <label>Gender</label>
            <div className="gender-option">
              <div className="gender">
                <input defaultChecked name="gender" id="check-male" type="radio" />
                <label htmlFor="check-male">Male</label>
              </div>
              <div className="gender">
                <input name="gender" id="check-female" type="radio" />
                <label htmlFor="check-female">Female</label>
              </div>
              <div className="gender">
                <input name="gender" id="check-other" type="radio" />
                <label htmlFor="check-other">Prefer not to say</label>
              </div>
            </div>
          </div>
          <div className="input-box address">
            <label>Address</label>
            <input required placeholder="Enter street address" type="text" />
            <div className="column">
              <div className="select-box">
                <select>
                  <option hidden>Country</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Germany</option>
                  <option>Japan</option>
                </select>
              </div>
              <input required placeholder="Enter your city" type="text" />
            </div>
          </div>
          <button>Submit</button>
        </form>
      </section>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: relative;
    max-width: 500px;
    width: 100%;
    background: #FCEDDA;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .container header {
    font-size: 1.2rem;
    color: #000;
    font-weight: 600;
    text-align: center;
  }

  .container .form {
    margin-top: 15px;
  }

  .form .input-box {
    width: 100%;
    margin-top: 10px;
  }

  .input-box label {
    color: #000;
  }

  .form :where(.input-box input, .select-box) {
    position: relative;
    height: 35px;
    width: 100%;
    outline: none;
    font-size: 1rem;
    color: #808080;
    margin-top: 5px;
    border: 1px solid #EE4E34;
    border-radius: 6px;
    padding: 0 15px;
    background: #FCEDDA;
  }

  .input-box input:focus {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }

  .form .column {
    display: flex;
    column-gap: 15px;
  }

  .form .gender-box {
    margin-top: 10px;
  }

  .form :where(.gender-option, .gender) {
    display: flex;
    align-items: center;
    column-gap: 50px;
    flex-wrap: wrap;
  }

  .form .gender {
    column-gap: 5px;
  }

  .gender input {
    accent-color: #EE4E34;
  }

  .form :where(.gender input, .gender label) {
    cursor: pointer;
  }

  .gender label {
    color: #000;
  }

  .address :where(input, .select-box) {
    margin-top: 10px;
  }

  .select-box select {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    color: #808080;
    font-size: 1rem;
    background: #FCEDDA;
  }

  .form button {
    height: 40px;
    width: 100%;
    color: #000;
    font-size: 1rem;
    font-weight: 400;
    margin-top: 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #EE4E34;
  }

  .form button:hover {
    background: #EE3E34;
  }`;

export default Form;*/
