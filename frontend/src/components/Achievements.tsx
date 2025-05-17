import styled from 'styled-components';

const Achievements = () => {
  return (
    <StyledWrapper>
        <center>
      <form className="form">
        <p className="title">Achievements</p>
        <p className="message"> </p>
        <div className="flex">
         
        </div>
        <label>
            <input required placeholder='' type="text" className="input" />
            <span>Title</span>
          </label>  
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Image_Url</span>
        </label> 
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Video_Url</span>
        </label>
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Category</span>
        </label>
        <label>
          <input required placeholder='' type="text" className="input" />
          <span>Description</span>
        </label>
        <button className="submit">Submit</button>
        <p className="signin"> </p>
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

export default Achievements;
