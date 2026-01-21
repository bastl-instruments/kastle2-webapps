// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import PropTypes from 'prop-types';

function BankDecoration({ color = 'currentColor', className, style }) {
    return (
        <div className={className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 1680 62"
                preserveAspectRatio="none"
                style={style}
            >
                <g
                    fill={color}
                    style={{ transition: 'fill 0.3s' }}
                >
                    <polygon
                        points="401.021 62 840 62 800.654 41.004 682.997 41.004 639.377 19.28 639.377 48.398 548.237 3.007 442.947 3.007 514.4 38.594 401.021 62"
                    />
                    <polygon
                        points="341.76 62 425.85 40.402 315.18 0 266.586 49.445 220.95 40.47 175.32 49.444 202.665 6.618 92.988 39.846 0 39.846 25.326 62 341.76 62"
                    />
                    <polygon
                        points="1241.021 62 1680 62 1640.654 41.004 1522.997 41.004 1479.377 19.28 1479.377 48.398 1388.237 3.007 1282.947 3.007 1354.4 38.594 1241.021 62"
                    />
                    <polygon
                        points="1181.76 62 1265.85 40.402 1155.18 0 1106.586 49.445 1060.95 40.47 1015.32 49.444 1042.665 6.618 932.988 39.846 840 39.846 865.326 62 1181.76 62"
                    />
                </g>
            </svg>
        </div>
    );
};

BankDecoration.propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default BankDecoration;