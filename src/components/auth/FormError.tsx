import styled from "styled-components";

interface IProps {
  message: any;
}

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0 10px 0;
`;

const FormError = ({ message }: IProps) => {
  return !message ? null : <SFormError>{message}</SFormError>;
};
export default FormError;
