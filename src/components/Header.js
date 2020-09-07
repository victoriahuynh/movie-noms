import React from "react";

const Header = (props) => {
    return (
        <header className="App-header">
            <h1>{props.text}</h1>
            <p>Welcome to the Shoppies!</p>
        </header>
    );
};

export default Header;