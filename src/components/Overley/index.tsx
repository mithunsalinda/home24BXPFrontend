import { Spin } from 'antd';

import { ReactNode } from 'react';

interface OverleyProps {
  isLoading: boolean;
  children?: ReactNode;
}

export const Overley = ({ isLoading, children }: OverleyProps) => {
  const loading = isLoading;
  return (
    <div className="overly">
      {loading && (
        <div className="overlyWrapper">
          <Spin size="large" />
        </div>
      )}
      <div style={{ opacity: loading ? 0.5 : 1 }}>{children}</div>
    </div>
  );
};
