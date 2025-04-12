import React from 'react';
import { Range } from 'react-range';

const SemiCircularSlider = ({ value, onChange, label, max = 100, step = 1, color = "#2ecc71" }) => {
    const radius = 80;
    const angle = (value / max) * 180;
    const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = radius * Math.sin((angle - 90) * (Math.PI / 180));

    return (
        <div style={{ textAlign: 'center', margin: '0 20px' }}>
            <h4>{label}</h4>
            <svg width="180" height="100" viewBox="0 0 200 100">
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="12"
                />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={`${angle * 2.513}, 1000`}
                />
                <circle
                    cx={100 + x}
                    cy={100 - y}
                    r="8"
                    fill={color}
                />
            </svg>
            <Range
                step={step}
                min={0}
                max={max}
                values={[value]}
                onChange={(values) => onChange(values[0])}
                renderTrack={() => <></>}
                renderThumb={() => <></>}
            />
            <p style={{ marginTop: 4 }}>{value}</p>
        </div>
    );
};

export default SemiCircularSlider;