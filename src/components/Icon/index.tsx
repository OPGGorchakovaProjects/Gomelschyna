import * as Icons from '@assets';
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = (
    Icons as unknown as {
      [key: string]: React.FC<React.SVGProps<SVGSVGElement>>;
    }
  )[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};
