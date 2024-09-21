import { Container } from "react-bootstrap";
import Menu from "./Menu";
import BannerHome from "./BannerHome";

export default function Pagina(props){
    return(
        <>  
            <Menu/>
            
            {props.showBanner && <BannerHome />}

            <Container style={{width: "100%"}}>
                {props.children}
            </Container>

        </>
        
    )
}