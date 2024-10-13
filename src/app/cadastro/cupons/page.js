'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; 
import Pagina from '@/app/components/Pagina';

export default function CadastrarCupom() {
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [cupons, setCupons] = useState([]); 
    const [usuarioMaster, setUsuarioMaster] = useState(null); 
    const [cupomSelecionado, setCupomSelecionado] = useState(null); 
    const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false); 
    const [cupomParaExcluir, setCupomParaExcluir] = useState(null); 

    const router = useRouter(); 

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        // Verifica se o usuário é o "master"
        if (usuarioLogado && usuarioLogado.usuario === 'master') {
            setUsuarioMaster(true); 
        } else {
            setUsuarioMaster(false); 
        }

        // Carrega os cupons do localStorage
        const cuponsCadastrados = JSON.parse(localStorage.getItem('cupons')) || [];
        setCupons(cuponsCadastrados);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cuponsCadastrados = JSON.parse(localStorage.getItem('cupons')) || [];

        if (cupomSelecionado) {
            // Editar cupom existente
            const cupomEditado = cuponsCadastrados.map(cupom =>
                cupom.id === cupomSelecionado.id ? { ...cupom, nome, valor: parseFloat(valor) } : cupom
            );
            localStorage.setItem('cupons', JSON.stringify(cupomEditado));
            setCupons(cupomEditado);
            alert('Cupom editado com sucesso!');
            setCupomSelecionado(null); 
        } else {
            // Cadastrar novo cupom
            const novaCategoria = {
                id: cuponsCadastrados.length + 1,
                nome,
                valor: parseFloat(valor), 
            };

            cuponsCadastrados.push(novaCategoria);
            localStorage.setItem('cupons', JSON.stringify(cuponsCadastrados));
            setCupons(cuponsCadastrados);
            alert('Cupom cadastrado com sucesso!');
        }
        setNome(''); 
        setValor(''); 
    };

    const editarCupom = (cupom) => {
        setCupomSelecionado(cupom);
        setNome(cupom.nome);
        setValor(cupom.valor);
    };

    const handleShowModalConfirmacao = (id) => {
        setCupomParaExcluir(id);
        setModalConfirmacaoVisible(true);
    };

    const handleCloseModalConfirmacao = () => {
        setModalConfirmacaoVisible(false);
        setCupomParaExcluir(null);
    };

    const handleDeleteCupom = () => {
        const cuponsCadastrados = JSON.parse(localStorage.getItem('cupons')) || [];
        const cuponsFiltrados = cuponsCadastrados.filter(cupom => cupom.id !== cupomParaExcluir);
        localStorage.setItem('cupons', JSON.stringify(cuponsFiltrados));
        setCupons(cuponsFiltrados);
        handleCloseModalConfirmacao();
        alert('Cupom excluído com sucesso!');
    };

    const limparFormulario = () => {
        setNome('');
        setValor('');
        setCupomSelecionado(null);
    };

    if (usuarioMaster === null) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Verificando...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Pagina>
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4 shadow-lg">
                        <h2 className="text-center mb-4">Cadastrar Cupom</h2>

                        {usuarioMaster ? (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome do Cupom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        placeholder="Ex: DESCONTO10"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor do Cupom</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={valor}
                                        onChange={(e) => setValor(e.target.value)}
                                        required
                                        placeholder="Ex: 10"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 mb-2">
                                    {cupomSelecionado ? 'Salvar Cupom' : 'Cadastrar Cupom'}
                                </Button>
                                <Button variant="secondary" onClick={limparFormulario} className="w-100">
                                    Novo Cupom
                                </Button>
                            </Form>
                        ) : (
                            <Alert variant="danger" className="text-center">
                                Você não tem permissão para cadastrar cupons.
                            </Alert>
                        )}
                    </Card>
                </Col>

                <Col md={6}>
                    {usuarioMaster ? (
                        <Card className="p-4 shadow-lg">
                            <h2 className="text-center mb-4">Cupons Cadastrados</h2>
                            <ul className="list-unstyled">
                                {cupons.map((cupom) => (
                                    <li key={cupom.id} className="d-flex justify-content-between align-items-center mb-2">
                                        <span onClick={() => editarCupom(cupom)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                            {cupom.nome} - R$: {cupom.valor}
                                        </span>
                                        <Button variant="link" onClick={() => handleShowModalConfirmacao(cupom.id)} className="text-danger">
                                            <FaTrash />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ) : (
                        <p></p>
                    )}
                </Col>
            </Row>

            {/* Modal de confirmação de exclusão */}
            <Modal show={modalConfirmacaoVisible} onHide={handleCloseModalConfirmacao}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Confirmar exclusão do cupom?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalConfirmacao}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteCupom}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </Pagina>
    );
}
