'use client';

import Pagina from "@/app/components/Pagina";
import { Carousel, Card, Button, Row, Col } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [listaDesejos, setListaDesejos] = useState([]);

    useEffect(() => {
        // Carregar a lista de desejos do localStorage
        const desejosSalvos = JSON.parse(localStorage.getItem('listaDesejos')) || [];
        setListaDesejos(desejosSalvos);
    }, []);

    const router = useRouter();

 
    const removerItem = (id) => {
        const novaLista = listaDesejos.filter((produto) => produto.id !== id);
        setListaDesejos(novaLista);
        localStorage.setItem('listaDesejos', JSON.stringify(novaLista));
    };

    const irParaPaginaHotel = (id) => {
        router.push(`/hoteis/${id}`);
    };

    const renderStars = (estrelas) => {
        const fullStars = Math.floor(estrelas);
        const halfStars = estrelas % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;
    
        return (
          <>
            {Array(fullStars).fill(<FaStar color="gold" />)}
            {halfStars ? <FaStarHalfAlt color="gold" /> : null}
            {Array(emptyStars).fill(<FaStar color="lightgray" />)}
          </>
        );
    };

    return (
        <Pagina>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h1>Favoritos</h1>
                <p>Seus Hoteis favoritos estão aqui para quando você quiser.</p>
            </div>

            {listaDesejos.length > 0 ? (
                <Row className="d-flex justify-content-center">
                    {listaDesejos.map((hoteis, idx) => (
                        <Col key={idx} md={4} className="mb-4 d-flex align-items-stretch">
                            <Card 
                                style={{ width: '100%', minHeight: '200px', position: 'relative', cursor: 'pointer' }} 
                                className="d-flex flex-column card-hover-effect"
                                onClick={() => irParaPaginaHotel(hoteis.id)}
                            >
                                <BsTrash
                                    size={24}
                                    color="red"
                                    style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer', zIndex: 10 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removerItem(hoteis.id);
                                    }}
                                />

                                <Carousel indicators={false}>
                                    {[hoteis.urlPrincipal, ...hoteis.imagensAdicionais].map((image, imgIdx) => (
                                        <Carousel.Item key={imgIdx}>
                                            <Card.Img variant="top" src={image} style={{ height: '300px', objectFit: 'cover' }} />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: "230px" }}>
                                    <div>
                                        <Card.Title>{hoteis.nome}</Card.Title>
                                        <Card.Text>{renderStars(hoteis.estrelas)}</Card.Text>
                                        <Card.Text>Localização: <strong>{hoteis.localizacao}</strong></Card.Text>
                                        <Card.Text>Tipo: <strong>{hoteis.tipo}</strong></Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h4>Você ainda não tem Hoteis no seus favoritos.</h4>
                </div>
            )}
            <style >{`
                .card-hover-effect {
                    transition: transform 3s ease, border-color 0.5s ease;
                }
                .card-hover-effect:hover {
                    transform: scale(1.00);
                    border: 2px solid green;
                }
            `}</style>
        </Pagina>
    );
}
