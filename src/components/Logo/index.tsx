import React from 'react';
import { Image } from 'antd';
import { Images } from '../../assets/images/index';

type LogoProps = {
  size?: number | string;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ size = 100, className }) => {
  return <Image src={Images.logo} preview={false} width={size} className={className} />;
};

export default Logo;
