// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import Bowser from 'bowser';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import copyMacosPoster from '../assets/copy_macos.jpg';
import copyMacos from '../assets/copy_macos.mp4';
import copyWindowsPoster from '../assets/copy_windows.jpg';
import copyWindows from '../assets/copy_windows.mp4';
import Button from '@bastl-react/components/Button';
import CheckBox from '@bastl-react/components/CheckBox';
import Dialog from '@bastl-react/components/Dialog';

function FirmwareGeneratedDialog({ isOpen, onCloseClick }) {

    const [disableDialog, setDiableDialog] = useState(false);
    const closeClick = () => onCloseClick(disableDialog);
    const browserInfo = useMemo(() => {
        const browser = Bowser.getParser(window.navigator.userAgent);
        const info = browser.getResult();
        return info;
    }, []);
    const isApple = browserInfo?.os?.name === 'macOS' || browserInfo?.os?.name === 'iOS';

    return (
        <Dialog
            isOpen={isOpen}
            primary
            width="narrow"
            onCloseClick={closeClick}
            buttons={
                <>
                    <Button
                        onClick={closeClick}
                        full
                    >
                        OK, I understand
                    </Button>
                </>
            }
        >
            <p>
                <strong>
                    The UF2 firmware file is now being downloaded.
                </strong>
            </p>
            <p>
                Turn off your Kastle 2, hold the SHIFT key, and turn it back on while connected to your computer via USB.
                Copy the .UF2 file to the RPI-RP2 disk that appears on your computer.
            </p>
            <p>
                <strong>Wait up to 2&ndash;3 minutes. </strong> The dialog may indicate that it is preparing to copy for longer than expected, but this is normal.
            </p>
            <p>
                {isApple &&
                    <video
                        src={copyMacos}
                        autoPlay
                        loop
                        muted
                        style={{ width: 300 }}
                        playsInline
                        poster={copyMacosPoster}
                    />
                }
                {!isApple &&
                    <video
                        src={copyWindows}
                        autoPlay
                        loop
                        muted
                        style={{ width: 250 }}
                        playsInline
                        poster={copyWindowsPoster}
                    />
                }
            </p>
            <p>
                <label style={{ display: 'flex' }}>
                    <CheckBox
                        style={{ marginRight: '0.75em' }}
                        value={disableDialog}
                        wrapperType="span"
                        onChange={(v) => setDiableDialog(v)}
                    />
                    Don&apos;t show this next time
                </label>
            </p>
        </Dialog>
    );
};

FirmwareGeneratedDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default FirmwareGeneratedDialog;