'use client'

import Pagina from "@/app/components/Pagina"
import { useState } from "react";
import { Button, Carousel, Col, Form, Image, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { BsHeart } from "react-icons/bs";

export default function Page() {

    const produto = { id: 1, tamanho: 'M', nome: 'Camisa Vasco Masculina', valor: '290.99', valorOriginal: '390.99', url: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x' };

    const images = [
        { id: 1, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 1' },
        { id: 2, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom2.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 2' },
        { id: 3, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom3.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 3' },
        { id: 4, src: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom9.jpg?ts=1713200261?ims=1088x', alt: 'Imagem 4' },
    ];

    const tamanhos = ['P', 'M', 'G', 'GG'];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState('M');
    const [quantidade, setQuantidade] = useState(1);

    const router = useRouter();

    const handleSelect = (selectedIndex) => {
        setSelectedIndex(selectedIndex);
    };

    const adicionarAoCarrinho = () => {
        // Simular ação de adicionar ao carrinho
        console.log(`Produto: ${produto.nome}, Tamanho: ${tamanhoSelecionado}, Quantidade: ${quantidade}`);
        // Redirecionar para o carrinho ou mostrar notificação
        router.push('/carrinho');
    };

    return (
        <Pagina>
            <Row>
                <Col md={8}>
                    <Row className="justify-content-end align-items-center" >
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
                        <Col md={8} >
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
                    <h1>{produto.nome}</h1>
                    <p style={{ margin: 0, color: '#888' }}>A partir de</p>
                    <p style={{ marginTop: '1px', fontWeight: 'bold', fontSize: '2rem' }}>R$: {produto.valor}</p>
                    <p>ou 3x de R$: {(produto.valor / 3).toFixed(2)}</p>

                    {/* Escolher Tamanho */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Tamanho</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                as="select"
                                value={tamanhoSelecionado}
                                onChange={(e) => setTamanhoSelecionado(e.target.value)}
                            >
                                {tamanhos.map(tamanho => (
                                    <option key={tamanho} value={tamanho}>{tamanho}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    {/* Escolher Quantidade */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Quantidade</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="number"
                                min={1}
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                            />
                        </Col>
                    </Form.Group>

                    <Button variant="success" className="w-100 mb-3" onClick={adicionarAoCarrinho}>Adicionar ao Carrinho</Button>
                    <Button variant="secondary" className="w-100" onClick={() => router.push('/')}>Continuar Comprando</Button>
                    <BsHeart
                        className="heart-icon w-100 mb-3 mt-4"
                        size={25}
                        onClick={() => alert(':)')}
                        style={{
                            color: '#000',
                            transition: 'color 0.5s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'red'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#000'}
                    />
                </Col>
            </Row>
        </Pagina>
    );
}


