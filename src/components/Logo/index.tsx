import React from 'react';
import { Image } from 'antd';
import { Images } from '../../assets/images/index';

type LogoProps = {
  size?: number | string; // Accept number (px) or string (e.g., '10rem')
  className?: string;     // Optional for custom styles
};

const Logo: React.FC<LogoProps> = ({ size = 100, className }) => {
  return (
    <Image
      src={Images.logo}
      preview={false}
      width={size}
      className={className}
    />
  );
};

export default Logo;
