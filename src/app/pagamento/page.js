// pages/pagamento.js

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, Button, Col, Row, Alert } from 'react-bootstrap';

export default function Pagamento() {
    const [mensagem, setMensagem] = useState('');
    const [produtosCarrinho, setProdutosCarrinho] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        setProdutosCarrinho(carrinho);
        const total = carrinho.reduce((acc, item) => acc + (item.quantidade || 1) * item.valor, 0);
        setValorTotal(total);
    }, []);

    const finalizarCompra = () => {
        setMensagem('Compra finalizada com sucesso!');
        localStorage.removeItem('carrinho');
        setProdutosCarrinho([]);
        // setTimeout(() => {
        //     router.push('/confirmacao');
        // }, 2000);
    };

    return (
        <div>
            <h1>Finalizar Pagamento</h1>
            <Row>
                <Col md={8}>
                    {produtosCarrinho.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.5rem', color: '#888' }}>
                            Carrinho Vazio
                        </div>
                    ) : (
                        produtosCarrinho.map((item, index) => (
                            <Card className="mt-2" key={index}>
                                <Row>
                                    <Col md={3}>
                                        <Card.Img variant="top" src={item.urlPrincipal} />
                                    </Col>
                                    <Col className="m-2">
                                        <Card.Body>
                                            <Card.Title>{item.nome}</Card.Title>
                                            <Card.Text>Tamanho: {item.tamanho}</Card.Text>
                                            <Card.Text>R$: {item.valor}</Card.Text>
                                            <Card.Text>Quantidade: {item.quantidade || 1}</Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumo do Pagamento</Card.Title>
                            <hr />
                            <Row className="mb-2">
                                <Col><strong>Total:</strong></Col>
                                <Col className="text-end">R$: {valorTotal.toFixed(2)}</Col>
                            </Row>
                            <Button variant="success" onClick={finalizarCompra} className="w-100">Pagar</Button>
                        </Card.Body>
                    </Card>
                    {mensagem && <Alert className="mt-4" variant="success">{mensagem}</Alert>}
                </Col>
            </Row>
        </div>
    );
}
