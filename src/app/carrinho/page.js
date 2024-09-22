'use client'

import Pagina from "@/app/components/Pagina"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap"
import { BsPlusCircleFill, BsDashCircle, BsTrash } from "react-icons/bs"

export default function Page() {

    const [quantidade, setQuantidade] = useState({});

    const produtos = [
        { id: 1, tamanho: 'M', nome: 'Camisa Vasco Masculina', valor: '290.99', valorOriginal: '390.99', url: 'https://static.netshoes.com.br/produtos/camisa-vasco-i-2425-jogador-kappa-masculina/26/D24-6176-026/D24-6176-026_zoom1.jpg?ts=1713200261?ims=1088x' },
        { id: 2, tamanho: 'P', nome: 'Camisa Flamengo Feminina - Vermelho+Preto', valor: '339.49', valorOriginal: '439.49', url: 'https://static.netshoes.com.br/produtos/camisa-flamengo-i-2425-sn-torcedor-adidas-feminina/68/FB9-4228-068/FB9-4228-068_zoom1.jpg?ts=1706693107?ims=1088x' },
        { id: 3, tamanho: 'G', nome: 'Camisa São Paulo Masculina - Laranja', valor: '199.99', valorOriginal: '299.99', url: 'https://static.netshoes.com.br/produtos/camisa-sao-paulo-2425-sn-treino-new-balance-masculina/42/39U-9331-042/39U-9331-042_zoom1.jpg?ts=1705670015?ims=1088x' }
    ];

    const alterarQuantidade = (id, action) => {
        setQuantidade(prevState => ({
            ...prevState,
            [id]: action === 'increment' ? (prevState[id] || 0) + 1 : Math.max((prevState[id] || 0) - 1, 0)
        }));
    };

    const removerProduto = (id) => {
        setQuantidade(prevState => {
            const newState = { ...prevState };
            delete newState[id];
            return newState;
        });
    };

    const router = useRouter();

    return (
        <Pagina>
            <Row>
                <h1>Meu Carrinho</h1>
                <Col md={8}>

                    {produtos.map(item => (
                        <Card className="mt-2" key={item.id}>
                            <Row>
                                <Col md={3}>
                                    <Card.Img variant="top" src={item.url} />
                                </Col>
                                <Col className="m-2">
                                    <Row >
                                        <Col >
                                            <Card.Body>
                                                <Card.Title>{item.nome}</Card.Title>
                                                <Card.Text style={{ color: '#888' }}>Tamanho: {item.tamanho}</Card.Text>
                                                <Card.Text style={{ fontWeight: 'bold', fontSize: '1rem' }}>R$: {item.valor}</Card.Text>
                                            </Card.Body>
                                        </Col>
                                        <Col md={2} >
                                            <BsTrash
                                                className="mt-3 mx-5"
                                                onClick={() => removerProduto(item.id)}
                                                size={20}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="d-flex justify-content-end align-items-center px-4">
                                            <h5 className="mx-4 mt-2">Quantidade: </h5>
                                            <BsDashCircle
                                                onClick={() => alterarQuantidade(item.id, 'decrement')}
                                                size={20}
                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                            />
                                            <p className="mb-0">{quantidade[item.id] || 0}</p>
                                            <BsPlusCircleFill
                                                onClick={() => alterarQuantidade(item.id, 'increment')}
                                                size={20}
                                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            />
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>

                        </Card>
                    ))}

                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumo do Carrinho</Card.Title>
                            <hr />
                            <Row className="mb-2">
                                <Col><strong>Total de Itens:</strong></Col>
                                <Col className="text-end">{Object.keys(quantidade).reduce((acc, key) => acc + quantidade[key], 0)}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col><strong>Valor Final:</strong></Col>
                                <Col className="text-end">R$: {produtos.reduce((acc, item) => acc + (quantidade[item.id] || 0) * item.valor, 0).toFixed(2)}</Col>
                            </Row>
                            <Row className="mb-3 mt-5">
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o cupom de desconto"
                                        />
                                        <Button variant="outline-dark">Aplicar Cupom</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="success" className="w-100 mb-2">Finalizar Compra</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button onClick={() => router.push('/')} variant="secondary" className="w-100">Continuar Comprando</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Pagina>
    )
}
