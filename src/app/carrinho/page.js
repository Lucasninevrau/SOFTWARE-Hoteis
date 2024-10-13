'use client';

import Pagina from "@/app/components/Pagina";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Card, Col, Form, InputGroup, Row, Alert, Modal } from "react-bootstrap"; 
import { BsPlusCircleFill, BsDashCircle, BsTrash } from "react-icons/bs";

export default function Page() {
    const [produtosCarrinho, setProdutosCarrinho] = useState([]);
    const [cupom, setCupom] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [desconto, setDesconto] = useState(0);
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [frete, setFrete] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [numeroCasa, setNumeroCasa] = useState('');
    const [complemento, setComplemento] = useState('');
    const [loading, setLoading] = useState(true); // Estado para controle de carregamento
    const [isRedirecting, setIsRedirecting] = useState(false); // Estado para controlar redirecionamento
    const router = useRouter();

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')); // Verifique a chave correta

        if (!usuarioLogado) {
            // Se não estiver logado, redirecionar para a tela de login
            setIsRedirecting(true); // Inicia o redirecionamento
            router.push('/login'); // Redireciona para a página de login
            return; // Saia da função
        }

        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const produtosConsolidados = carrinho.reduce((acc, produto) => {
            const chaveProduto = `${produto.id}-${produto.tamanho}-${produto.nome}-${produto.valor}`;
            if (!acc[chaveProduto]) {
                acc[chaveProduto] = { ...produto, quantidade: 0 };
            }
            acc[chaveProduto].quantidade += (produto.quantidade || 1);
            return acc;
        }, {});
        setProdutosCarrinho(Object.values(produtosConsolidados));
        setLoading(false); // Define loading como false após carregar os produtos
    }, [router]);

    const adicionarAoCarrinho = (produto) => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const chaveProduto = `${produto.id}-${produto.tamanho}-${produto.nome}-${produto.valor}`;
        const produtoExistente = carrinho.find(item =>
            `${item.id}-${item.tamanho}-${item.nome}-${item.valor}` === chaveProduto
        );

        if (produtoExistente) {
            produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
        } else {
            produto.quantidade = 1;
            carrinho.push(produto);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        setProdutosCarrinho(carrinho);
    };

    const alterarQuantidade = (produto, action) => {
        setProdutosCarrinho(prevCarrinho => {
            const novoCarrinho = prevCarrinho.map(item => {
                if (item.id === produto.id && item.tamanho === produto.tamanho && item.nome === produto.nome && item.valor === produto.valor) {
                    const novaQuantidade = action === 'increment' ? (item.quantidade || 1) + 1 : Math.max((item.quantidade || 1) - 1, 0);
                    if (novaQuantidade === 0) {
                        return null; 
                    }
                    return { ...item, quantidade: novaQuantidade };
                }
                return item;
            }).filter(item => item !== null);
            localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
            return novoCarrinho;
        });
    };

    const removerProduto = (produto) => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const chaveProduto = `${produto.id}-${produto.tamanho}-${produto.nome}-${produto.valor}`;
        const produtoNoCarrinho = carrinho.find(item =>
            `${item.id}-${item.tamanho}-${item.nome}-${item.valor}` === chaveProduto
        );

        if (produtoNoCarrinho && produtoNoCarrinho.quantidade > 1) {
            produtoNoCarrinho.quantidade -= 1;
        } else {
            const novoCarrinho = carrinho.filter(item =>
                `${item.id}-${item.tamanho}-${item.nome}-${item.valor}` !== chaveProduto
            );
            localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
            setProdutosCarrinho(novoCarrinho);
            return;
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        setProdutosCarrinho(carrinho);
    };

    const aplicarCupom = () => {
        const cupons = JSON.parse(localStorage.getItem('cupons')) || [];
        const cupomExistente = cupons.find(item => item.nome === cupom);

        if (cupomExistente) {
            setDesconto(cupomExistente.valor);
            setMensagem(`Cupom aplicado com sucesso! Desconto de R$: ${cupomExistente.valor.toFixed(2)}`);
        } else {
            setMensagem('Cupom inválido.');
            setDesconto(0);
        }
    };

    const consultarCep = async () => {
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    setMensagem('CEP inválido.');
                    setEndereco('');
                    setFrete(0);
                } else {
                    setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                    const valorFrete = 15.00; // Exemplo de valor de frete
                    setFrete(valorFrete);
                    // Armazenar o endereço no localStorage
                    localStorage.setItem('endereco', JSON.stringify({
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        localidade: data.localidade,
                        uf: data.uf,
                    }));
                    setMensagem('Endereço encontrado com sucesso!');
                }
            } catch (error) {
                setMensagem('Erro ao consultar o CEP.');
                setEndereco('');
                setFrete(0);
            }
        } else {
            setMensagem('Por favor, digite um CEP válido (8 dígitos).');
            setEndereco('');
            setFrete(0);
        }
    };

    // Função para cadastrar o endereço
    const cadastrarEndereco = () => {
        const enderecoExistente = JSON.parse(localStorage.getItem('endereco')) || {};
    
        const enderecoCompleto = {
            ...enderecoExistente,
            numero: numeroCasa,
            complemento: complemento,
        };
        
        localStorage.setItem('endereco', JSON.stringify(enderecoCompleto));
        setMensagem('Endereço cadastrado com sucesso!');
        setMostrarModal(false);
        setNumeroCasa('');
        setComplemento('');
    };
    

    return (
        <Pagina>
            <Row>
                <h1>Meu Carrinho</h1>
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
                                        <Row>
                                            <Col>
                                                <Card.Body>
                                                    <Card.Title>{item.nome}</Card.Title>
                                                    <Card.Text style={{ color: '#888' }}>Tamanho: {item.tamanho}</Card.Text>
                                                    <Card.Text style={{ fontWeight: 'bold', fontSize: '1rem' }}>R$: {item.valor}</Card.Text>
                                                </Card.Body>
                                            </Col>
                                            <Col md={2}>
                                                <BsTrash
                                                    className="mt-3 mx-5"
                                                    onClick={() => removerProduto(item)}
                                                    size={20}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="d-flex justify-content-end align-items-center px-4">
                                                <h5 className="mx-4 mt-2">Quantidade: </h5>
                                                <BsDashCircle
                                                    onClick={() => alterarQuantidade(item, 'decrement')}
                                                    size={20}
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                />
                                                <p className="mb-0">{item.quantidade || 1}</p>
                                                <BsPlusCircleFill
                                                    onClick={() => alterarQuantidade(item, 'increment')}
                                                    size={20}
                                                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumo do Carrinho</Card.Title>
                            <hr />
                            <Row className="mb-2">
                                <Col><strong>Total de Itens:</strong></Col>
                                <Col className="text-end">{produtosCarrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0)}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col><strong>Valor Final:</strong></Col>
                                <Col className="text-end">R$: {(
                                    produtosCarrinho.reduce((acc, item) => acc + (item.quantidade || 1) * item.valor, 0) 
                                    - desconto + frete // Inclui o frete
                                ).toFixed(2)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o cupom de desconto"
                                            value={cupom}
                                            onChange={(e) => setCupom(e.target.value)}
                                        />
                                        <Button variant="outline-dark" onClick={aplicarCupom}>Aplicar Cupom</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            {mensagem && <Alert variant="info">{mensagem}</Alert>}
                            <Row className="mb-3 mt-4">
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite seu CEP"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                        />
                                        <Button variant="outline-dark" onClick={consultarCep}>Consultar CEP</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            {endereco && (
                                <Row className="mb-2">
                                    <Col><strong>Endereço:</strong> {endereco}</Col>
                                    <Col className="text-end">
                                        <Button variant="primary" onClick={() => setMostrarModal(true)}>Cadastrar Endereço</Button>
                                    </Col>
                                </Row>
                            )}
                            {frete > 0 && (
                                <Row className="mb-2">
                                    <Col><strong>Frete:</strong> R$: {frete.toFixed(2)}</Col>
                                </Row>
                            )}
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

            {/* Modal para cadastrar o endereço */}
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Endereço</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Logradouro</Form.Label>
                            <Form.Control type="text" value={JSON.parse(localStorage.getItem('endereco')).logradouro} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control type="text" value={JSON.parse(localStorage.getItem('endereco')).bairro} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Localidade</Form.Label>
                            <Form.Control type="text" value={JSON.parse(localStorage.getItem('endereco')).localidade} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>UF</Form.Label>
                            <Form.Control type="text" value={JSON.parse(localStorage.getItem('endereco')).uf} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nº da Casa/Apartamento/Lote</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={numeroCasa} 
                                onChange={(e) => setNumeroCasa(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Complemento</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={complemento} 
                                onChange={(e) => setComplemento(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMostrarModal(false)}>Fechar</Button>
                    <Button variant="primary" onClick={cadastrarEndereco}>Cadastrar Endereço</Button>
                </Modal.Footer>
            </Modal>
        </Pagina>
    );
}
