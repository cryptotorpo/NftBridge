import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
const jdenticon = require('jdenticon');

type JdenticonProps = {
  size?: number;
  value: string;
  iconStyle?: React.CSSProperties;
  className?: string;
};

const JdenticonWeb: React.FC<JdenticonProps> = ({ value, size, className }) => {
  const icon = useRef(null);

  useEffect(() => {
    jdenticon.update(icon.current, value);
  }, [value]);

  return (
    <svg
      className={className}
      data-jdenticon-value={value}
      height={size}
      ref={icon}
      width={size}
      style={{
        ...{ width: size, height: size },
      }}
    />
  );
};

JdenticonWeb.propTypes = {
  size: PropTypes.number,
  value: PropTypes.string.isRequired,
};

export default JdenticonWeb;
