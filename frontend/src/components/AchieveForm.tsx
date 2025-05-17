import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <center>
      <form className="form">
        <p className="title">Coaches </p>
        <p className="message"></p>
        <div className="flex">
          
        </div>
        <label>
            <input required placeholder='' type="text" className="input" />
            <span>Name</span>
          </label>  
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Role</span>
        </label> 
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Phone</span>
        </label>
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Description</span>
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

export default Form;


/*import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <center>
      <div className="form-container">
        <form className="form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input type="text" id="role" name="role" required />
          </div>
          <div className="form-group">
            <label htmlFor="textarea">Your Feedback?</label>
            <textarea name="textarea" id="textarea" rows={10} cols={50} required defaultValue={"          "} />
          </div>
          
<div className="radio">
  <input value="1" name="rating" type="radio" id="rating-1" />
  <label title="1 stars" htmlFor="rating-1">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      ></path>
    </svg>
  </label>

  <input value="2" name="rating" type="radio" id="rating-2" />
  <label title="2 stars" htmlFor="rating-2">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      ></path>
    </svg>
  </label>

  <input value="3" name="rating" type="radio" id="rating-3" />
  <label title="3 stars" htmlFor="rating-3">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      ></path>
    </svg>
  </label>

  <input value="4" name="rating" type="radio" id="rating-4" />
  <label title="4 stars" htmlFor="rating-4">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      ></path>
    </svg>
  </label>

  <input value="5" name="rating" type="radio" id="rating-5" />
  <label title="5 star" htmlFor="rating-5">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      ></path>
    </svg>
  </label>
</div>

          <button className="form-submit-btn" type="submit">Submit</button>
        </form>
      </div>
      </center>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form-container {
    width: 600px;
    background: linear-gradient(#212121, #212121) padding-box,
                linear-gradient(145deg, transparent 35%,#e81cff, #00bfff) border-box;
    border: 2px solid transparent;
    padding: 32px 24px;
    font-size: 14px;
    font-family: inherit;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    border-radius: 16px;
  }

  .form-container button:active {
    scale: 0.95;
  }

  .form-container .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-container .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-container .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #00bfff;
    font-weight: 600;
    font-size: 12px;
  }

  .form-container .form-group input {
    width: 90%;
    padding: 12px 15px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #00bfff;
  }

  .form-container .form-group textarea {
    width: 90%;
    padding: 12px 16px;
    border-radius: 8px;
    resize: none;
    color: #fff;
    height: 96px;
    border: 1px solid #00bfff;
    background-color: transparent;
    font-family: inherit;
  }

  .form-container .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-container .form-group input:focus {
    outline: none;
    border-color: #00bfff;
  }

  .form-container .form-group textarea:focus {
    outline: none;
    border-color: #00bfff;
  }

  .form-container .form-submit-btn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    align-self: flex-start;
    font-family: inherit;
    color: #00bfff;
    font-weight: 600;
    width: 40%;
    background: #313131;
    border: 1px solid #00bfff;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
  }
  /* From Uiverse.io by elijahgummer */ 
/*.radio {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.radio > input {
  position: absolute;
  appearance: none;
}

.radio > label {
  cursor: pointer;
  font-size: 30px;
  position: relative;
  display: inline-block;
  transition: transform 0.3s ease;
}

.radio > label > svg {
  fill: #666;
  transition: fill 0.3s ease;
}

.radio > label::before,
.radio > label::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #ff9e0b;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
  animation: particle-explosion 1s ease-out;
}

.radio > label::before {
  top: -15px;
  left: 50%;
  transform: translateX(-50%) scale(0);
}

.radio > label::after {
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%) scale(0);
}

.radio > label:hover::before,
.radio > label:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1.5);
}

.radio > label:hover {
  transform: scale(1.2);
  animation: pulse 0.6s infinite alternate;
}

/* Star glow and animation on hover */
/*.radio > label:hover > svg {
  fill: #ff9e0b;
  filter: drop-shadow(0 0 15px rgba(255, 158, 11, 0.9));
  animation: shimmer 1s ease infinite alternate;
}

.radio > input:checked + label > svg {
  fill: #ff9e0b;
  filter: drop-shadow(0 0 15px rgba(255, 158, 11, 0.9));
  animation: pulse 0.8s infinite alternate;
}

.radio > input:checked + label ~ label > svg,
.radio > input:checked + label > svg {
  fill: #ff9e0b; /* Highlight the stars */
/*}

/*@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes particle-explosion {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

@keyframes shimmer {
  0% {
    filter: drop-shadow(0 0 10px rgba(255, 158, 11, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(255, 158, 11, 1));
  }
}

.radio > input:checked + label:hover,
.radio > input:checked + label:hover ~ label {
  fill: #e58e09;
}

.radio > label:hover,
.radio > label:hover ~ label {
  fill: #ff9e0b;
}

.radio input:checked ~ label svg {
  fill: #ffa723;
}

  .form-container .form-submit-btn:hover {
    background-color: #fff;
    border-color: #fff;
  }`;

export default Form;*/
