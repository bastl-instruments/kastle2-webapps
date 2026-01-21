// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styles from './Dialog.module.scss';
import BankDecoration from './BankDecoration';

Modal.setAppElement('#root');
const CLOSE_TIMEOUT = 300;

function Dialog({ isOpen, onCloseClick, width = 'normal', children, primary, buttons, note, fullscreen }) {

    const bar = (buttons || note) && (
        <div
            className={classNames(styles.bar, {
                [styles.hasNote]: !!note,
                [styles.hasButtons]: !!buttons,
            })}
        >
            {buttons &&
                <div className={styles.buttons}>
                    {buttons}
                </div>
            }
            {note &&
                <div className={styles.note}>
                    {note}
                </div>
            }
        </div>
    );
    return (
        <Modal
            isOpen={isOpen}
            closeTimeoutMS={CLOSE_TIMEOUT}
            contentLabel=""
            bodyOpenClassName="app-dialog-open"
            overlayClassName={{
                base: classNames(styles.dialog, {
                    [styles.primary]: primary,
                    [styles.fullscreen]: fullscreen,
                    [styles.narrow]: width === 'narrow',
                    [styles.wide]: width === 'wide',
                }),
                beforeClose: styles.closing,
                afterOpen: ''
            }}
            className={{
                base: styles.window,
                afterOpen: '',
                beforeClose: ''
            }}
            onRequestClose={onCloseClick}
        >
            {primary &&
                <BankDecoration className={styles.decorationTop} />
            }
            <div className={styles.container}>
                <div className={styles.content}>
                    {children}
                    {!fullscreen && bar}
                </div>
            </div>
            {primary &&
                <BankDecoration className={styles.decorationBottom} />
            }
            {fullscreen && bar}
        </Modal>
    );
};

Dialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func,
    width: PropTypes.oneOf(['narrow', 'normal', 'wide']),
    children: PropTypes.any,
    primary: PropTypes.bool,
    fullscreen: PropTypes.bool,
    buttons: PropTypes.any,
    note: PropTypes.any,
};

export default Dialog;