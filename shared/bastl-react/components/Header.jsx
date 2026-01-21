// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import BoxDesign from './BoxDesign';
import Logo from './Logo';

function Header({ title, onClicks, customBanner, customLogo }) {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                {!customLogo &&
                    <Logo
                        title={title}
                    />
                }
                {customLogo &&
                    <img
                        src={customLogo}
                        alt="Logo"
                        width="300"
                        height="90"
                    />
                }
            </div>
            <div className={styles.right}>
                {!customBanner &&
                    <BoxDesign
                        onClicks={onClicks}
                        className={styles.boxDesign}
                    />
                }
                {customBanner &&
                    <img
                        src={customBanner}
                        alt="Header image"
                    />
                }
            </div>
        </header>
    );
}

Header.propTypes = {
    onClicks: PropTypes.shape({
        bird: PropTypes.func,
    }),
    title: PropTypes.node,
    customBanner: PropTypes.string,
    customLogo: PropTypes.string
};

export default Header;