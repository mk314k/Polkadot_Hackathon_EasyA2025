import React from 'react';

interface SpaceProps {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  children?: React.ReactNode;
}

const Space: React.FC<SpaceProps> = ({
  top,
  bottom,
  left,
  right,
  children,
}) => {
  const style: React.CSSProperties = {
    marginTop: top ? top * 4 : undefined,
    marginBottom: bottom ? bottom * 4 : undefined,
    marginLeft: left ? left * 4 : undefined,
    marginRight: right ? right * 4 : undefined,
  };

  return <div style={style}>{children}</div>;
};

export default Space;
