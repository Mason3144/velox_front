import styled from "styled-components";

const SAvatar = styled.div`
  width: ${(props: IProps) => (props.lg ? "30px" : "25px")};
  height: ${(props: IProps) => (props.lg ? "30px" : "25px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;
const Img = styled.img`
  max-width: 100%;
`;

interface IProps {
  lg: boolean;
}

const Avatar = ({ url = "", lg = false }) => {
  return <SAvatar lg={lg}>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
};
export default Avatar;
