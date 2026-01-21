// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import React, { useContext } from 'react';
import { UiContext } from '../UiContext';
import styles from './AdvancedModeBadge.module.scss';

function AdvancedModeBadge() {
    const uiContext = useContext(UiContext);
    return (
        <>
            {uiContext.advancedMode &&
                <div className={styles.advancedModeBadge}>👹 Advanced mode 👹</div>
            }
        </>
    );
}

export default AdvancedModeBadge;