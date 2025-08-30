import React from 'react';

const Header = () => {
    return (
        <header>
            <div className="logo">
                <h1>Educational Course</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="./pages/Part1.html">Part 1</a></li>
                    <li><a href="./pages/Part2.html">Part 2</a></li>
                    <li><a href="./pages/Part3.html">Part 3</a></li>
                    <li><a href="./pages/Part4.html">Part 4</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;