import { formatSecsStringSec } from '@/utils';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props extends SimpleComponent {
  time: number;
}

function CountdownText(props: Props) {
  const [duration, setDuration] = useState<string | undefined>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = +new Date(props.time) - +new Date();
      if (difference > 0) {
        setDuration(formatSecsStringSec(difference / 1000));
      } else {
        setDuration(undefined);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!duration) {
    return null;
  }

  return `(Wait for ${duration})`;
}

export default CountdownText;
