import React, { Component, createContext } from 'react';

export const AuthContext = createContext();

class AuthContextProvider extends Component {
    state = {
        isAuthenticated: false
    }

    logout = () => {
        this.setState({ isAuthenticated: false });
    }

    login = () => {
        this.setState({ isAuthenticated: true });
    }

    render() {
        return (
            <AuthContext.Provider value={{...this.state, logout: this.logout, login: this.login}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthContextProvider;