import React, { CSSProperties, FC } from 'react';

enum Spacing {
    xs = '4px',
    s = '8px',
    sm = '12px',
    m = '16px',
    ml = '24px',
    l = '32px',
    xl = '40px',
}

interface IContainerProps {
    children: React.ReactNode;
    spacing?: Spacing;
    style?: CSSProperties;
}

export const containerStyles = (spacing?: Spacing, style?: CSSProperties): CSSProperties => ({
    container: {
        ...(spacing && { padding: spacing }),
        ...style,
    }
});

export const Container: FC<IContainerProps> = ({ children, spacing, style }) => {
    const containerStyle: CSSProperties = {
        ...containerStyles(spacing, style).container,
    };

    return <div style={containerStyle}>{children}</div>;
};


