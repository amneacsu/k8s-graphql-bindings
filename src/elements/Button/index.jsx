import React from 'react';

import styled from "styled-components";

const Btn = styled.button`
  border: 0;
  padding: 10px 15px;
  background: green;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 2px;
`;

const Button = ({ children, ...other }) => {
  return (
    <Btn {...other}>{children}</Btn>
  );
}

Button.defaultProps = {
  type: 'button',
};

export default Button;
