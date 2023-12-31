import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Login.module.css';
import loadImg from '../ajax-loader.gif';

/**
 * Handles user login, sending email and password to API and handling response
 * 
 * @param {*} props Props passed into Login whenever it is called
 */
const Login = (props) => {

    // loggedIn and isManager are booleans, and login is a callback for the loggedIn boolean
    const {login, loggedIn, isManager} = props;

    // states used for general component functionality
    const axios = require('axios').default;
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    // form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // errorMsg state
    const [errorMsg, setErrorMsg] = useState("");
    
    /**
     * Reloads the page if not logged in, this is so when you get a redirect if the token is not detected
     */
    useEffect(() => {
        if (loggedIn && !sessionStorage.getItem('token')) {
            window.location.reload();
        }
    }, [loggedIn]);

    /**
     * Handles what happens when input is changed
     * 
     * @param {event} event is when input changes its value
     */
    const handleChange = (event) => {
        event.preventDefault();
        switch (event.target.name) {
            case "email":
                setEmail(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
            default:
                break;
        }      
    }

    /**
     * Handles form submission, including validation and API request(s)
     * 
     * @param {event} event is the submission event
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMsg('');

        const validEmailRegex = 
          RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

        if (!validEmailRegex.test(email)) {
            setErrorMsg("Invalid email or password");
        }

        setLoading(true);

        axios.post('http://localhost:8080/login', {
            email : email,
            password: password
        })
        .then(response => {
            setLoading(false);

            let token = response.data.token;
            sessionStorage.setItem("token", token);
            let decodedToken = JSON.parse(atob(token.split('.')[1]));
            let role = decodedToken.roles;
            let userEmail = decodedToken.sub;

            if (role === "manager") {
                isManager(true);
                sessionStorage.setItem("role", role);
            }

            sessionStorage.setItem("email", userEmail);
            
            login(true);
            history.push("/reservations");
        })
        .catch(error => {
            setLoading(false);
            if (error.response) {
                setErrorMsg("Invalid email or password");
            } else if (error.request){
                setErrorMsg("Oops something went wrong");
            } 
        });
        
    }


    return (
        <div className={styles.container}>
            {loggedIn && <>
                <h3>Welcome to Hotel Bookings</h3>
            </>}

            {!loggedIn && <>
                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.notification}>{loading ? <img src={loadImg} alt="loading..." /> : errorMsg}</div>
                    <br/>
                    <div><input type="email" name="email" placeholder="email" onChange={handleChange} /></div>
                    <div><input type="password" name="password" placeholder="password" onChange={handleChange} /></div>
                    <button className={styles.button} type="submit">login</button>
                </form>
            </>}
        </div>

    );
}

export default Login;