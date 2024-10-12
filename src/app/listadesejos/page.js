'use client';

import Pagina from "@/app/components/Pagina";
import { Carousel, Card, Button } from "react-bootstrap";
import { useState } from "react";

export default function Page() {
    const produto = {
        id: 1,
        tamanho: 'M',
        nome: 'Camisa Vasco Masculina',
        valor: '290.99',
        valorOriginal: '390.99',
        url: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x',
    };

    const images = [
        { id: 1, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 1' },
        { id: 2, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom2.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 2' },
        { id: 3, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom3.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 3' },
        { id: 4, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom9.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 4' },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setSelectedIndex(selectedIndex);
    };

    return (
        <Pagina>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h1>Sua Lista De Desejo...</h1>
                <p>Seu Produtos favoritos ficam aqui pra sempre que você quiser.</p>

                
            </div>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
               
                  
                        <Card style={{ width: '18rem' }}>
                            <Carousel activeIndex={selectedIndex} onSelect={handleSelect} indicators={false}>
                                {images.map((image) => (
                                    <Carousel.Item key={image.id}>
                                        <Card.Img variant="top" src={image.src} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>

                            <Card.Body>
                                <Card.Title>{produto.nome}</Card.Title>
                                <Card.Text>
                                    Tamanho: <strong>{produto.tamanho}</strong> <br />
                                    Valor:<strong> R$ {produto.valor}</strong> <br />
                                    Valor Original:<strong> R$ {produto.valorOriginal}</strong>
                                </Card.Text>
                                <Button variant="primary">Adicionar ao Carrinho</Button>
                            </Card.Body>
                        </Card>
            </div>
        </Pagina>
    );
}
