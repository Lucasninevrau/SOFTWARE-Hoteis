import { Container } from "react-bootstrap";
import Menu from "./Menu";
import BannerHome from "./BannerHome";
import Rodape from "./Rodape";

export default function Pagina(props){
    return(
        <>  
            <Menu/>
            
            {props.showBanner && <BannerHome />}

            <Container className="mt-5" style={{ minHeight: '700px' }} >
                {props.children}
            </Container>

            <Rodape />

        </>
        
    )
}