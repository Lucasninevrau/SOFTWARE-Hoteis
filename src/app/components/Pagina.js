import { Container } from "react-bootstrap";
import Menu from "./Menu";

export default function Pagina(props){
    return(
        <>  
            <Menu>

            </Menu>
            <Container>
                {props.children}
            </Container>

        </>
        
    )
}