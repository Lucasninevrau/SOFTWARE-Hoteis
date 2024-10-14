'use client';

import Pagina from "@/app/components/Pagina";
import { Carousel, Card, Button, Row, Col } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
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

    const adicionarAoCarrinho = (produto) => {
        const carrinhoExistente = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinhoExistente.push(produto);
        localStorage.setItem('carrinho', JSON.stringify(carrinhoExistente));
        router.push('/carrinho');
    };

    const removerItem = (id) => {
        const novaLista = listaDesejos.filter((produto) => produto.id !== id);
        setListaDesejos(novaLista);
        localStorage.setItem('listaDesejos', JSON.stringify(novaLista));
    };

    return (
        <Pagina>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h1>Sua Lista de Desejos</h1>
                <p>Seus produtos favoritos estão aqui para quando você quiser.</p>
            </div>

            {listaDesejos.length > 0 ? (
                <Row className="d-flex justify-content-center">
                    {listaDesejos.map((produto, idx) => (
                        <Col key={idx} md={4} className="mb-4 d-flex align-items-stretch">
                            <Card style={{ width: '100%', minHeight: '200px', position: 'relative' }} className="d-flex flex-column">
                                <BsTrash
                                    size={24}
                                    color="red"
                                    style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer', zIndex: 10 }}
                                    onClick={() => removerItem(produto.id)}
                                />

                                <Carousel indicators={false}>
                                    {[produto.urlPrincipal, ...produto.imagensAdicionais].map((image, imgIdx) => (
                                        <Carousel.Item key={imgIdx}>
                                            <Card.Img variant="top" src={image} style={{ height: '300px', objectFit: 'cover' }} />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{produto.nome}</Card.Title>
                                    <Card.Text>
                                        Tamanho: <strong>{produto.tamanho}</strong> <br />
                                        Valor: <strong>R$ {produto.valor}</strong> <br />
                                        Valor Original: <strong>R$ {produto.valorOriginal}</strong>
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <Button variant="primary" onClick={() => adicionarAoCarrinho(produto)}>
                                            Adicionar ao Carrinho
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h4>Você ainda não tem itens na sua lista de desejos.</h4>
                </div>
            )}
        </Pagina>
    );
}
