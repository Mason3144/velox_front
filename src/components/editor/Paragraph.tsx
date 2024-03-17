import styled from "styled-components";
import {useEffect} from "react";
import OneLine from "./OneLine";

const ParagraphDiv = styled.div`
  padding : 50px;
  background-color: rgb(240,240,240);
  border-color: lightgray;
  border-radius: 5px;
  border-style:solid;
  border-width: 2px;
`;

const Paragraph = () => {
    const db = localStorage.getItem('item');
    let items: string[] = [];

    items.push('1');
    items.push('2');
    items.push('3');

    useEffect(() => {
        if(db) items = JSON.parse(db)
        else localStorage.setItem('item', JSON.stringify(items));
    }, []);



    useEffect(()=>{


    }, [])


    return (
        <ParagraphDiv>
            {items?.map((item) => (
                <OneLine
                    key={item}
                    // content={item}
                />
            ))}
        </ParagraphDiv>
    );
};
export default Paragraph;
