import React from "react";
import {faBars, faCircleXmark, faUpDownLeftRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styled from "styled-components";


type IProps = {
    children: React.ReactNode;
    isHovered: boolean;
};

const ButtonBox = styled.div<{locate:string, isHovered?:boolean}>`
  margin: 3px;
  position: absolute;
  bottom : 5px;
  ${(props) => (props.locate === 'left' ? 'left : -23px' :'')};
  ${(props) => (props.locate === 'right' ? 'right : -23px' :'')};
  opacity: ${(props) => (props.isHovered ? '0.5':'0')};
`

const Controller = ({children, isHovered}:IProps)=>{

    console.log(isHovered);
    return(
        <>
            <ButtonBox locate={'left'}>
                <FontAwesomeIcon icon={faBars} size="lg"/>
            </ButtonBox>
            {children}
            <div>
                {isHovered ? 'Mouse is over!' : 'Mouse is not over.'}
            </div>
            <ButtonBox locate={'right'} isHovered={isHovered}>
                <FontAwesomeIcon icon={faCircleXmark} />
            </ButtonBox>
        </>
    )
}

export default Controller;