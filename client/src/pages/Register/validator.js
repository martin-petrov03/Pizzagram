const validateForm = (email, username, password) => {
    if(password && password.length < 5) {
      return 'Password should be minimum 5 characters!';
    }
    if(username && username.length < 5) {
      return 'Invalid username!';
    }
    if(email && email.length <= 4) {
        return 'Invalid email!';
    }

    return '';
}

export default validateForm;