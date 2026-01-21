// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import styles from './Logo.module.scss';
import PropTypes from 'prop-types';

function Logo({ title, variant = 'default', style }) {

    let fill;
    let text;
    switch (variant) {
        case 'on-yellow':
            fill = '#272727';
            text = '#272727';
            break;
        case 'default':
        default:
            fill = '#feec30';
            text = '#ffffff';
            break;
    }

    return (
        <div
            style={style}
            className={styles.container}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 14.8325195 18.1600342"
                className={styles.logo}
            >
                <g fill={fill} >
                    <polygon points="14.8325195 8.5113525 11.0782471 8.5113525 8.1011963 11.3375244 8.1011963 18.1600342 12.2846069 18.1600342 9.984375 10.246521 14.8325195 10.246521 14.8325195 8.5113525" />
                    <polygon points="6.7554932 18.1600342 6.7554932 11.3375244 3.7784424 8.5113525 0 8.5113525 0 10.246521 4.7697754 10.246521 4.8378906 10.246521 2.5377197 18.1600342 6.7554932 18.1600342" />
                    <path d="M10.3770752,5.90802L7.4162598,0l-2.9608154,5.90802L0,3.5373535v3.6331787h4.3135986l3.1147461,2.9567261,3.1147461-2.9567261h4.2894287v-3.6331787l-4.4554443,2.3706665ZM7.4111328,8.24823l-2.1311646-1.5209351,2.152771-4.5045776,2.1095581,4.5045776-2.1311646,1.5209351Z" />
                </g>
            </svg>
            <h1
                className={styles.title}
                style={{ color: text }}
            >
                {title}
            </h1>
        </div>
    );
}

Logo.propTypes = {
    title: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'on-yellow']),
    style: PropTypes.object
};


export default Logo;