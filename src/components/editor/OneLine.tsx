import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import Comment from "../feed/Comment";
import { faBarChart } from "@fortawesome/free-regular-svg-icons";
import {faBars, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import Controller from "./Controller";

const OneLineDiv = styled.div`
  display: flex;
  margin: 2px;
`;
const ControllerButton = styled.div<{locate:string, isHovered?:boolean}>`
  padding:10px;
  cursor: pointer;
  opacity: ${(props) => (props.isHovered ? '0.5':'0')};
`;


const TextBox = styled.div`
  background-color: white;
  width:100%;
  padding:10px;
  border-radius: 3px;
  justify-content: center;
  outline: none;
`;


const OneLine = () => {
    const [isHovered, setIsHovered] = useState(false);



    return (
        <OneLineDiv onMouseOver={()=>setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <ControllerButton locate={'left'} isHovered={isHovered}>
                <FontAwesomeIcon icon={faBars} size="lg"/>
            </ControllerButton>

            <TextBox contentEditable={true} ></TextBox>

            <ControllerButton locate={'right'} isHovered={isHovered}>
                <FontAwesomeIcon icon={faCircleXmark} />
            </ControllerButton>
        </OneLineDiv>
    );
};
export default OneLine;
