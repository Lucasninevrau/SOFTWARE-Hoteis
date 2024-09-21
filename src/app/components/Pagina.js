import { Container } from "react-bootstrap";
import Menu from "./Menu";
import BannerHome from "./BannerHome";
import Rodape from "./Rodape";

export default function Pagina(props){
    return(
        <>  
            <Menu/>
            
            {props.showBanner && <BannerHome />}

            <Container style={{ minHeight: '900px' }} >
                {props.children}
            </Container>

            <Rodape />

        </>
        
    )
}