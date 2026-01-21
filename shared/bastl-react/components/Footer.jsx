// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import styles from './Footer.module.scss';
import PropTypes from 'prop-types';

function Footer({ children }) {
    return (
        <div className={styles.footer}>
            {children}
            <p>
                <a
                    href="https://bastl-instruments.com/support/helpline/submit"
                    target="_blank"
                    rel="noreferrer"
                >
                    Bug reports link
                </a>
            </p>
            <p>
                Have fun! &lt;3<br />
                &copy;{' '}
                <a
                    href="https://bastl-instruments.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    Bastl Instruments
                </a>
                {' '}2025
            </p>
        </div>
    );
}

Footer.propTypes = {
    children: PropTypes.any,
};

export default Footer;
