// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import classNames from 'classnames';
import PropTypes from 'prop-types';
import hexAlpha from '@bastl-react/utils/hexAlpha';
import style from './ColorPicker.module.scss';

function ColorPicker({ color, onChange, advancedMode = false, colors }) {
    return (
        <>
            <ul className={style.colorPicker}>
                {colors.map((c) => (
                    <li key={c.real}>
                        <button
                            className={classNames(style.tile, (c.real === color?.real && c.display === color?.display) ? style.tileActive : '')}
                            style={{
                                backgroundColor: c.display,
                                '--tile-color': hexAlpha(c.display, 0.3), // Set the CSS variable
                            }}
                            onClick={() => onChange(c)}
                        >
                            {c.name}
                        </button>
                    </li>
                ))}
            </ul>
            {advancedMode && (
                <>
                    <div className={style.customColor}>
                        <label>Display:</label>
                        <input
                            type="text"
                            value={color?.display}
                            onChange={(e) => {
                                const newColor = {
                                    ...color,
                                    display: e.target.value,
                                    name: 'Custom',
                                };
                                onChange(newColor);
                            }}
                        />
                    </div>
                    <div className={style.customColor}>
                        <label>Real:</label>
                        <input
                            type="text"
                            value={color?.real}
                            onChange={(e) => {
                                const newColor = {
                                    ...color,
                                    real: e.target.value,
                                    name: 'Custom',
                                };
                                onChange(newColor);
                            }}
                        />
                    </div>
                </>
            )}
        </>
    );
};

ColorPicker.propTypes = {
    color: PropTypes.shape({
        real: PropTypes.string,
        display: PropTypes.string,
        name: PropTypes.string,
    }),
    colors: PropTypes.arrayOf(PropTypes.shape({
        real: PropTypes.string,
        display: PropTypes.string,
        name: PropTypes.string,
    })).isRequired,
    onChange: PropTypes.func,
    advancedMode: PropTypes.bool,

};

export default ColorPicker;