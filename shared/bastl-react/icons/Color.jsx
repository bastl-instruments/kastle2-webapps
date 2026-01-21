// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';

function Color({ fill = 'currentColor' }) {
    return (
        <svg
            version="1.1"
            viewBox="0 0 64 64"
        >
            <path
                d="M20.8566556,58.7613103h0c-9.0951044,0-16.536885-7.4425097-16.536885-16.5376665h0c0-9.0957808,7.4417806-16.5375612,16.536885-16.5375612h0c9.0958337,0,16.5376143,7.4417804,16.5376143,16.5375612h0c0,9.0951568-7.4417806,16.5376665-16.5376143,16.5376665Z"
                fill={fill}
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="4"
            />
            <path
                d="M43.1426151,58.7613103h0c-9.0951044,0-16.536885-7.4425097-16.536885-16.5376665h0c0-9.0957808,7.4417806-16.5375612,16.536885-16.5375612h0c9.0958337,0,16.5376143,7.4417804,16.5376143,16.5375612h0c0,9.0951568-7.4417806,16.5376665-16.5376143,16.5376665Z"
                fill="#c8c8c8"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="4"
            />
            <path
                d="M31.9996353,38.3139174h0c-9.0951044,0-16.536885-7.4417804-16.536885-16.5376139h0c0-9.0958335,7.4417806-16.5376139,16.536885-16.5376139h0c9.0958337,0,16.5376143,7.4417804,16.5376143,16.5376139h0c0,9.0958335-7.4417806,16.5376139-16.5376143,16.5376139Z"
                fill="#fff"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="4"
            />
        </svg>
    );
};

Color.propTypes = {
    fill: PropTypes.string,
};

export default Color;