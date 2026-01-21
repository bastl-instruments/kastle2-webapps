// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import Bowser from 'bowser';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Logo from '@bastl-react/components/Logo';
import Button from '@bastl-react/components/Button';
import Dialog from '@bastl-react/components/Dialog';

const HTTPS_WARNING = false;

function IntroDialog({ isOpen, onCloseClick }) {

    const browserInfo = useMemo(() => {
        // Browser info
        const browser = Bowser.getParser(window.navigator.userAgent);
        const info = browser.getResult();
        log.debug('🌍 Browser info:', info);
        return info;
    }, []);

    const isDesktop = browserInfo?.platform?.type === 'desktop';

    return (
        <Dialog
            isOpen={isOpen}
            primary
            note={
                <p>
                    We use cookies and similar technologies to automatically track and analyze non-personal information,
                    such as page views and firmware download clicks.
                    This data is used solely to improve app performance and user experience.
                    We do not collect any data about the specific values you enter.
                </p>
            }
            buttons={
                <Button
                    onClick={onCloseClick}
                    full
                >
                    Let&apos;s begin
                </Button>
            }
        >
            <Logo
                variant="on-yellow"
                style={{
                    fontSize: '1.4em',
                    margin: '0 0 1.4em 0'
                }}
                title={
                    <>
                        Bastl<br />
                        Instruments<br />
                        Alchemist<br />
                        Laboratory
                    </>
                }
            />
            {isDesktop &&
                <>
                    {HTTPS_WARNING &&
                        <p>
                            TEMPORARY ISSUE<br />
                            Generating firmware prompts you with &quot;unsecured download&quot;.
                            Press &quot;KEEP&quot; or &quot;ALLOW&quot; to be able to download the firmware.
                        </p>
                    }
                    <p>
                        Create custom Kastle 2 Alchemist firmware with your scales and rhythms to enhance your music.
                        Save your progress as a &quot;draft file&quot; to continue later or share with friends.
                    </p>
                    <p>
                        Click on &quot;Generate Firmware&quot; to download the .UF2 file. To upload it, connect your Kastle 2 to your computer, turn it on while holding SHIFT, then drag and drop the file to the RPI-RP2 drive.
                    </p>
                </>
            }
            {!isDesktop &&
                <>
                    <p>You appear to be on a mobile or non-desktop device.</p>
                    <p>You can continue to use the app and generate firmware; however, transferring the .UF2 file from your mobile device to the Kastle 2 most likely won&apos;t be possible.</p>
                </>
            }
        </Dialog>
    );
};

IntroDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default IntroDialog;