import ENV from '@/utils/ENV';
import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import styled from 'styled-components';

const ButtonStyledWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  color: white;

  ${({ color, disabled }) => {
    return !disabled
      ? `background: linear-gradient(40deg, ${ENV.SECONDARY_COLOR} 0%, ${ENV.PRIMARY_COLOR} 90%);`
      : 'background-color: #829aa6;';
  }}

  overflow: hidden;
  transition: all 0.3s ease-in-out;
  :hover {
    * {
      transition: all 0.3s ease-in-out;
      ${({ disabled }) => {
        return !disabled ? 'color: #000000;' : '';
      }}
    }
    .overlay {
      ${({ color }) => {
        return color === 'secondary'
          ? 'transform: translateY(0);'
          : 'transform: translateX(0);';
      }}
    }
  }
  button {
    padding: 1rem 0;
    position: relative;
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: all 0.3s ease-in-out;
    transform: translateY(100%);
    ${({ color, disabled }) => {
      return !disabled
        ? `background: linear-gradient(90deg, ${ENV.PRIMARY_COLOR} 0%, ${ENV.SECONDARY_COLOR} 100%);`
        : 'background-color: transparent;';
    }}
    ${({ color }) => {
      return color === 'secondary'
        ? 'transform: translateY(101%);'
        : 'transform: translateX(-101%);';
    }}
  }
`;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  style?: React.CSSProperties;
  onClick?: (e: any) => any;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: string;
  className?: string;
  classContainer?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: any;
  color?: 'primary' | 'secondary' | string;
}

function ButtonStyled({
  className,
  disabled,
  onClick,
  style,
  color,
  children,
  type,
  loading,
  classContainer,
  ...others
}: Props) {
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log('enter press here! ');
    }
  };
  return (
    <ButtonStyledWrapper
      className={`text-2xl relative rounded-md overflow-hidden text-center cursor-pointer font-bold ${classContainer}`}
      style={style}
      disabled={disabled || loading}
    >
      <div className="overlay"></div>
      <button
        onClick={onClick}
        className={className || ''}
        disabled={disabled || loading}
        type={type}
        {...others}
      >
        {loading ? <Icon icon={'line-md:loading-twotone-loop'} /> : children}
      </button>
    </ButtonStyledWrapper>
  );
}

export default ButtonStyled;
