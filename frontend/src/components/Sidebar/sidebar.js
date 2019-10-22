// code taken from https://alligator.io/react/react-burger-menu-sidebar/

import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
    return (
        // Pass on our props
        <Menu {...props}>
            <a className="home" href="/">
                Home
            </a>

            <a className="set-components" href="/set">
                Set Components
            </a>

            <a className="create-dc" href="/create">
                Create Decision Cards
            </a>

            <a className="arrange-components" href="/arrange">
                Arrange Components
            </a>
        </Menu>
    );
};
