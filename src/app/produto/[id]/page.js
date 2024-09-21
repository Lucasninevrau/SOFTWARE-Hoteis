'use client'

import Pagina from "@/app/components/Pagina"
import Link from "next/link";
import { useState } from "react";
import { Button, Carousel, Col, Form, Image, Row } from "react-bootstrap";

export default function Page() {

    const images = [
        { id: 1, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 1' },
        { id: 2, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom2.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 2' },
        { id: 3, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom3.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 3' },
        { id: 4, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom9.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 4' },
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selecionado, setSelecionado] = useState([]);

    const handleSelect = (selectedIndex) => {
        setSelectedIndex(selectedIndex);
    };


    const handleChange = (item) => {
        if (selecionado.includes(item)) {
            setSelecionado(selecionado.filter(tam => tam !== item));
        } else {
            setSelecionado([...selecionado, item]);
        }
    };

    return (
        <Pagina>
            <Row>
                <Col md={8}>
                    <Row>
                        <Col md={2}>
                            <Row className="flex-column">
                                {images.map((image, idx) => (
                                    <Col key={image.id} onClick={() => handleSelect(idx)} className="mb-2">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            thumbnail
                                            style={{
                                                cursor: 'pointer',
                                                border: idx === selectedIndex ? '2px solid #007bff' : 'none',
                                            }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col md={8}>
                            <Row className="mb-3">
                                <Col md={12}>
                                    <Carousel className="w-100" activeIndex={selectedIndex} onSelect={handleSelect} indicators={false}>
                                        {images.map((image) => (
                                            <Carousel.Item key={image.id}>
                                                <Image src={image.src} alt={image.alt} className="d-block w-100" />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <h1>Teste</h1>
                    <p style={{ margin: 0, color: '#888' }}>Apartir de</p>
                    <p style={{ marginTop: '1px', fontWeight: 'bold', fontSize: '2rem' }}>R$: 290.90 </p>
                    <p >ou 3x de R$: {(290.90 / 3).toFixed(2)}</p>

                </Col>
            </Row>
        </Pagina >
    )
}